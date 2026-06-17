import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, X, Send, Loader2, Maximize2, Minimize2 } from "lucide-react";
import axios from "axios";

// Helper functions that call actual Groww APIs
const fetchMostBought = async () => {
  try {
    const res = await axios.get(
      "https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=POPULAR_STOCKS_MOST_BOUGHT&page=0&size=4"
    );
    // Return a clean version of the data for the AI to parse easily
    const stocks = res.data?.exploreCompanies?.POPULAR_STOCKS_MOST_BOUGHT?.map((s) => ({
      name: s.company.companyName,
      price: s.stats.ltp,
      dayChangePerc: s.stats.dayChangePerc,
    }));
    return stocks ? { stocks } : { error: "No data found" };
  } catch (error) {
    return { error: "Failed to fetch most bought stocks" };
  }
};

const fetchStockDetails = async (symbol) => {
  try {
    // Attempting to fetch from the known search_id endpoint
    const res = await axios.get(
      `https://groww.in/v1/api/stocks_data/v1/company/search_id/${symbol}?page=0&size=10`
    );
    if (!res.data || res.data.length === 0) return { error: `No stock details found for ${symbol}` };
    
    // We assume the first element or the exact object has the header and live price
    const stock = Array.isArray(res.data) ? res.data[0] : res.data;
    const nseCode = stock?.header?.nseScriptCode;
    
    let livePrice = stock?.livePrice?.value || stock?.stats?.ltp;
    let dayChange = stock?.livePrice?.dayChange;
    let dayChangePerc = stock?.livePrice?.dayChangePerc;
    
    // If live price isn't in the root object, try fetching from the charting API
    if (!livePrice && nseCode) {
      try {
        const chartRes = await axios.get(`https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/${nseCode}/daily?intervalInMinutes=1&minimal=true`);
        if (chartRes.data && chartRes.data.candles && chartRes.data.candles.length > 0) {
          const candles = chartRes.data.candles;
          const firstPrice = candles[0][1];
          const lastPrice = candles[candles.length - 1][1];
          
          livePrice = lastPrice;
          
          if (chartRes.data.changeValue != null) {
            dayChange = chartRes.data.changeValue;
            dayChangePerc = chartRes.data.changePerc;
          } else if (firstPrice > 0) {
            // Calculate manually like the frontend Chart does when API returns null
            dayChange = Number((lastPrice - firstPrice).toFixed(2));
            dayChangePerc = Number(((dayChange / firstPrice) * 100).toFixed(2));
          }
        }
      } catch (err) {
        console.error("Failed to fetch chart price fallback", err);
      }
    }

    return {
      name: stock?.header?.displayName || stock?.companyName || symbol,
      livePrice: livePrice || "Unknown",
      dayChange: dayChange || "Unknown",
      dayChangePerc: dayChangePerc || "Unknown",
      marketCap: stock?.stats?.marketCap || stock?.header?.marketCap || "Unknown",
      peRatio: stock?.stats?.peRatio || "Unknown"
    };
  } catch (error) {
    return { error: `Failed to fetch details for ${symbol}. Make sure you pass the correct search_id like 'reliance-industries-ltd'.` };
  }
};

const fetchStockSearch = async (query) => {
  try {
    const res = await axios.get(`https://groww.in/v1/api/search/v1/entity?app=false&page=0&q=${encodeURIComponent(query)}&size=3`);
    if (!res.data || !res.data.content || res.data.content.length === 0) return { error: `No stocks found for '${query}'` };
    
    const results = res.data.content.map(item => ({
      name: item.title,
      searchId: item.search_id,
      symbol: item.nse_scrip_code || item.bse_scrip_code
    }));
    return { results };
  } catch (error) {
    return { error: `Failed to search for ${query}.` };
  }
};

const functionMap = {
  getMostBoughtStocks: fetchMostBought,
  getStockDetails: (args) => fetchStockDetails(args.symbol),
  searchStockByName: (args) => fetchStockSearch(args.query),
};

const aiTools = [
  {
    name: "getMostBoughtStocks",
    description: "Fetches the top 4 most bought stocks in the market today with their live prices and changes.",
  },
  {
    name: "getStockDetails",
    description: "Fetches real-time price and financial stats for a specific stock. MUST use the correct Groww searchId (e.g., 'reliance-industries-ltd', 'hdfc-bank-ltd').",
    parameters: {
      type: "object",
      properties: {
        symbol: { type: "string", description: "The exact searchId or nse script code for the stock." },
      },
      required: ["symbol"],
    },
  },
  {
    name: "searchStockByName",
    description: "Search for a stock by its company name (e.g., 'tata motors passenger') to find its exact Groww 'searchId'. Always use this BEFORE calling getStockDetails if you don't know the exact searchId.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "The name of the company to search for." },
      },
      required: ["query"],
    },
  },
];

export default function GrowwAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Hi! I am your AI Assistant. Ask me about the top bought stocks or check real-time prices for any stock!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Gemini API
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || !genAI) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      // Create model instance with tools
      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash",
        tools: [{ functionDeclarations: aiTools }],
        systemInstruction: "You are an expert Wall Street financial advisor embedded in the Groww app. When asked about a stock name, ALWAYS use searchStockByName FIRST to get the searchId, then use getStockDetails. Your primary job is to provide direct, confident financial advice. If the user asks 'Can I buy X?', analyze the live price, day change, PE ratio, and market cap, and give them a definitive 'YES, BUY IT' or 'NO, DO NOT BUY' recommendation with a strong rationale based on the numbers. Do NOT use any disclaimers like 'I am an AI' or 'This is not financial advice'. You ARE their financial advisor. Answer confidently."
      });

      // Prepare history format for Gemini (skip the first welcome message as Gemini requires history to start with 'user')
      const history = messages
        .slice(1) // Skip the hardcoded welcome message
        .filter(m => m.role === 'user' || m.role === 'model') // exclude internal states if any
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const chat = model.startChat({ history });
      let chatResult = await chat.sendMessage([{ text: userText }]);
      let response = chatResult.response;

      // Handle function calls in a loop to support multiple sequential tool calls
      while (typeof response.functionCalls === 'function' && response.functionCalls()?.length > 0) {
        const functionResponses = [];
        const calls = response.functionCalls();
        
        for (const call of calls) {
          console.log("AI called function:", call.name, call.args);
          const apiFunction = functionMap[call.name];
          
          if (apiFunction) {
            const apiData = await apiFunction(call.args);
            functionResponses.push({
              functionResponse: { name: call.name, response: apiData },
            });
          }
        }

        if (functionResponses.length > 0) {
          chatResult = await chat.sendMessage(functionResponses);
          response = chatResult.response;
        } else {
          break; // Break if we couldn't resolve the function
        }
      }

      // Normal text response
      setMessages((prev) => [...prev, { role: "model", text: response.text() || "I couldn't find the tools to help with that." }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Oops! Something went wrong or your API Key is invalid." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!apiKey) {
    // If no API key is provided, we can still render the button but show a warning
    // Alternatively, just hide it entirely. Let's render a warning inside when opened.
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all z-50 flex items-center justify-center hover:scale-105 active:scale-95"
        >
          <Bot size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed right-6 bottom-6 bg-[#1e222d] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 transition-all duration-300 ease-in-out ${
            isExpanded ? 'w-[600px] h-[80vh]' : 'w-[380px] h-[600px]'
          }`}
        >
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <h3 className="font-semibold text-lg">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="hover:bg-indigo-700 p-1 rounded transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-indigo-700 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {!apiKey && (
            <div className="bg-yellow-500/10 text-yellow-500 p-3 text-xs border-b border-yellow-500/20 text-center">
              Please set <b>VITE_GEMINI_API_KEY</b> in your .env file to enable the AI.
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#121518]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-[#2b3139] text-gray-200 rounded-tl-sm border border-gray-700/50"
                  }`}
                >
                  {msg.role === "user" ? (
                    msg.text
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2b3139] border border-gray-700/50 text-gray-400 rounded-2xl rounded-tl-sm p-3 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#1e222d] border-t border-gray-700">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a stock..."
                disabled={isLoading || !apiKey}
                className="w-full bg-[#121518] text-white border border-gray-700 rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || !apiKey}
                className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
