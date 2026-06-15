import { useState, useRef, useEffect } from "react";
import MarketDepthSection from './MarketDepthSection'
import PerformanceSection from "./PerformanceSection";
import FundamentalsSection from "./FundamentalsSection";
import FinancialPerformanceSection from './FinancialPerformanceSection'
import AboutSection from "./AboutSection";
import ShareholdingSection from "./ShareholdingSection";
import SimilarStocksSection from "./SimilarStocksSection";
import News from "./News";
import Events from "./Events";
import Technicals from "./Technicals";
import RecentlyViewed from "./RecentlyViewed";
import Footer from "../landingpage/Footer";
// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(n) {
  return Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ─── FINANCIAL CHART ────────────────────────────────────────────────────────
function FinancialChart({ data, hoveredBar, setHoveredBar }) {
  const entries = Object.entries(data);
  const maxRev  = Math.max(...entries.map(([, v]) => v.revenue));
  const H = 160;
  return (
    <div className="flex items-end justify-between gap-3 px-2" style={{ height: H + 24 }}>
      {entries.map(([label, val], i) => {
        const revH  = (val.revenue / maxRev) * H;
        const profH = (val.profit  / maxRev) * (H * 0.25);
        const isActive = hoveredBar === label;
        return (
          <div key={label} className="flex flex-col items-center gap-0 flex-1 cursor-pointer" onMouseEnter={() => setHoveredBar(label)}>
            <div className="flex items-end gap-1 w-full justify-center" style={{ height: H }}>
              <div className="rounded-t-sm transition-all duration-200 flex-1" style={{ height: revH, backgroundColor: isActive ? "#4a5568" : "#cbd5e0", maxWidth: 24 }} />
              <div className="rounded-t-sm transition-all duration-200 flex-1" style={{ height: profH, backgroundColor: "#44c5a6", maxWidth: 12 }} />
            </div>
            <span className={`text-[10px] mt-1 whitespace-nowrap ${isActive ? "font-semibold text-gray-700" : "text-gray-400"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── RANGE BAR ───────────────────────────────────────────────────────────────
function RangeBar({ low, high, current }) {
  const pct = Math.min(Math.max(((current - low) / (high - low)) * 100, 0), 100);
  return (
    <div className="relative h-1 bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 rounded-full">
      <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full shadow" style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }} />
    </div>
  );
}

// ─── MUTUAL FUNDS ────────────────────────────────────────────────────────────
function MutualFundsSection({ fundsInvested }) {
  const funds = fundsInvested ?? [];
  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-4">Mutual Funds Invested ({funds.length})</h2>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <span className="text-[11px] text-gray-500 font-medium">Fund name</span>
          <span className="text-[11px] text-gray-500 font-medium">AUM%</span>
        </div>
        {funds.map((f, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer">
            <img src={f.logoUrl} alt={f.name} className="w-8 h-8 rounded-md object-contain flex-shrink-0 bg-white border border-gray-100" onError={(e) => { e.target.style.display = "none"; }} />
            <span className="flex-1 text-[12px] text-gray-700 leading-tight">{f.name}</span>
            <span className="text-[13px] font-semibold text-gray-800 flex-shrink-0">{Number(f.investedAumPercent).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}



// ─── SKELETON ────────────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function StockPage({ searchId,sname, stock }) {
    console.log(searchId)
  const TABS_LIST = ["Overview", "Technicals", "News", "Events"];
  const [activeTab, setActiveTab] = useState("Overview");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef(null);

  // ── API state ────────────────────────────────────────────────────────────
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const[growwCompanyId,setgrowwCompanyId]=useState(null)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(
          `https://groww.in/v1/api/stocks_data/v1/company/search_id/${searchId}?page=0&size=10`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setgrowwCompanyId(json?.header?.growwCompanyId)
        setData(json);
      } catch (e) {
        console.error("Stock page data error:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchId]);

  // ── Derive mock-compatible bid/ask from data (API doesn't supply order book) ──
  // We construct plausible depth from priceData if no orderbook is present
  const buildFallbackDepth = () => {
    const base = data?.priceData?.nse?.yearLowPrice ?? 100;
    const mid  = ((data?.priceData?.nse?.yearLowPrice ?? 100) + (data?.priceData?.nse?.yearHighPrice ?? 200)) / 2;
    const bids = [0, 0.01, 0.02, 0.03, 0.04].map((d, i) => ({
      price: +(mid - d).toFixed(2),
      qty:   Math.floor(Math.random() * 5000 + 100),
    }));
    const asks = [0.02, 0.03, 0.04, 0.05, 0.06].map((d, i) => ({
      price: +(mid + d).toFixed(2),
      qty:   Math.floor(Math.random() * 5000 + 100),
    }));
    return { bids, asks };
  };

  const depth       = buildFallbackDepth();
  const bidOrders   = depth.bids;
  const askOrders   = depth.asks;

  const handleScroll = (e) => setShowScrollTop(e.target.scrollTop > 300);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="min-h-screen bg-white overflow-y-auto"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {console.log(growwCompanyId)}
      <div className="max-w-[860px] mx-12 px-4">
        {/* ── Tab Nav ── */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex gap-0">
            {TABS_LIST.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-[14px] font-medium px-5 py-3.5 transition-colors border-b-2 -mb-px ${
                  activeTab === t ? "border-[#44c5a6] text-[#44c5a6]" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* ── Overview Content ── */}
        {activeTab === "Overview" && (
          <div className="pt-6">
            {loading && (
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))}
              </div>
            )}
            {error && (
              <div className="pt-20 text-center text-gray-400 text-sm">
                Failed to load data.{" "}
                <button onClick={() => window.location.reload()} className="text-[#44c5a6] underline">Retry</button>
              </div>
            )}
            {!loading && !error && data && (
              <>
                <MarketDepthSection bidOrders={bidOrders} askOrders={askOrders} />
                <PerformanceSection priceData={data.priceData} exchange="NSE" />
                <FundamentalsSection fundamentals={data.fundamentals} />
                <FinancialPerformanceSection financialStatement={data.financialStatement} />
                <AboutSection details={data.details} header={data.header} />
                <ShareholdingSection shareHoldingPattern={data.shareHoldingPattern} />
                <MutualFundsSection fundsInvested={data.fundsInvested} />
                <SimilarStocksSection similarAssets={data.similarAssets} />
                <RecentlyViewed sname={sname}/>

              </>
            )}
          </div>
        )}

        {activeTab === "News" && (
            <div className="pt-6">
              <News growwCompanyId={growwCompanyId}/>
              <RecentlyViewed sname={sname}/>
            </div>
        )}

        {activeTab === "Events" && (
            <div className="pt-6">
              <Events growwCompanyId={growwCompanyId}/>
              <RecentlyViewed sname={sname}/>

            </div>
        )}
        {activeTab === "Technicals" && (
            <div className="pt-6">
              <Technicals searchId={searchId}/>
              <RecentlyViewed sname={sname}/>

            </div>
        )}

      </div>

      {showScrollTop && (
        <button
          onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-10 h-10 bg-[#44c5a6] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#38b394] transition-colors z-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
              <Footer/>

    </div>
  );
}
