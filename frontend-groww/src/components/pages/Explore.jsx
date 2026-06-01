import { useState, useEffect } from "react";

// ── tiny SVG spark line ──────────────────────────────────────────────────────
function Spark({ up = true }) {
  const color = up ? "#00b386" : "#eb5757";
  const d = up
    ? "M0 18 C10 16,15 10,25 8 C35 6,40 4,50 2"
    : "M0 4 C10 6,15 12,25 14 C35 16,40 18,50 20";
  return (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <line x1="0" y1="22" x2="60" y2="22" stroke="#e8e8e8" strokeWidth="1" />
    </svg>
  );
}

// ── stock card (grid layout) ────────────────────────────────────────────────
function StockCard({ logo, name, price, change, changeVal, up, bookmark }) {
  const color = up ? "text-[#00b386]" : "text-[#eb5757]";
  return (
    <div
      className="relative flex flex-col cursor-pointer hover:shadow-sm transition-shadow justify-between overflow-hidden border border-gray-300"
      style={{
        width: "188px",
        height: "182px",
        background: "#FFFFFF",
        padding: "16px",
        borderRadius: "12px",
        flexShrink: 0,
      }}
    >
      {bookmark && (
        <button className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 z-10">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
            <path d="M1 1h12v14l-6-3-6 3V1z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
          </svg>
        </button>
      )}

      <div className="flex flex-col items-start w-full">
        <div
          className="flex items-center justify-center bg-white overflow-hidden mb-3"
          style={{ width: "48px", height: "48px", borderRadius: "8px", border: "1px solid #F0F0F0" }}
        >
          <img
            src={logo}
            alt={name}
            className="w-full h-full object-contain p-1"
            onError={e => {
              e.target.style.display = "none";
              e.target.parentNode.innerHTML = `<span style="font-size:12px;font-weight:700;color:#6b7280">${name[0]}</span>`;
            }}
          />
        </div>

        <div className="text-sm text-gray-800 font-normal leading-tight w-full line-clamp-2 min-h-[2.5rem]">
          {name}
        </div>
      </div>

      <div className="w-full pt-1">
        <div className="text-sm font-semibold text-gray-900">{price}</div>
        <div className={`text-xs mt-0.5 font-medium whitespace-nowrap overflow-hidden text-ellipsis ${color}`}>
          {changeVal} ({change})
        </div>
      </div>
    </div>
  );
}

// ── stock row (table layout) ─────────────────────────────────────────────────
function StockRow({ logo, name, price, change, changeVal, up, volume }) {
  const color = up ? "text-[#00b386]" : "text-[#eb5757]";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center bg-white flex-shrink-0">
        <img
          src={logo}
          alt={name}
          className="w-full h-full object-contain p-0.5"
          onError={e => {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `<span class="text-xs font-bold text-gray-500">${name[0]}</span>`;
          }}
        />
      </div>

      <div className="ml-3 flex-1 text-sm text-gray-800 font-medium">{name}</div>

      <div className="mx-6 flex-shrink-0">
        <Spark up={up} />
      </div>

      <div className="text-right flex-shrink-0 w-36">
        <div className="text-sm font-medium text-gray-900">{price}</div>
        <div className={`text-xs font-medium ${color}`}>{changeVal} ({change})</div>
      </div>

      <div className="w-28 text-right flex-shrink-0 flex items-center justify-end gap-2">
        {hovered && volume === "—" ? (
          <>
            <button className="flex items-center justify-center w-8 h-8 rounded border border-gray-200 hover:border-gray-400 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 12h8M11 18h2" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded border border-gray-200 hover:border-gray-400 transition-colors">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M1 1h12v14l-6-3-6 3V1z" stroke="#6b7280" strokeWidth="1.3" fill="none"/>
              </svg>
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-500">{volume === "—" ? "" : volume}</span>
        )}
      </div>
    </div>
  );
}

// ── news card ────────────────────────────────────────────────────────────────
function NewsCard({ logo, name, change, up, headline, time }) {
  const color = up ? "text-[#00b386]" : "text-[#eb5757]";
  return (
    <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white cursor-pointer hover:shadow-sm transition-shadow flex flex-col justify-between min-w-0">
      <div>
        <div className="w-9 h-9 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center bg-white mb-3">
          <img
            src={logo}
            alt={name}
            className="w-full h-full object-contain p-1"
            onError={e => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `<span class="text-xs font-bold text-gray-500">${name[0]}</span>`;
            }}
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-800">{name}</span>
          <span className={`text-sm font-semibold ${color}`}>{change}</span>
        </div>

        <div className="border-l-2 border-gray-200 pl-3">
          <p className="text-sm text-gray-500 leading-relaxed text-left">
            {headline}
          </p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        {time}
      </div>
    </div>
  );
}

// ── sector row ──────────────────────────────────────────────────────────────
function SectorRow({ icon, name, gainers, losers, change }) {
  const up = !change.startsWith("-");
  const total = gainers + losers;
  const gainPct = (gainers / total) * 100;
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
  <img src={icon} alt={name} className="w-6 h-6 mr-3 object-contain flex-shrink-0"/>      
<div className="flex-1 text-sm text-gray-800">{name}</div>
      <div className="flex items-center gap-3 mr-8">
        <span className="text-xs text-gray-500">{gainers}</span>
        <div className="w-32 h-1.5 rounded-full overflow-hidden bg-gray-100">
          <div className="h-full flex">
            <div className="h-full bg-[#00b386]" style={{ width: `${gainPct}%` }} />
            <div className="h-full bg-[#eb5757]" style={{ width: `${100 - gainPct}%` }} />
          </div>
        </div>
        <span className="text-xs text-gray-500">{losers}</span>
      </div>
      <div className={`text-sm font-medium w-20 text-right ${up ? "text-[#00b386]" : "text-[#eb5757]"}`}>{change}</div>
    </div>
  );
}

// ── trading screen card ──────────────────────────────────────────────────────
function TradingCard({ title, label, type,image }) {
  const isBullish = type === "Bullish";
  const bg = isBullish ? "bg-[#e6f7f3] text-[#00b386]" : "bg-[#fdf2f2] text-[#eb5757]";

  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex flex-col items-start min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900 mb-1.5 truncate w-full">
          {title}
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${bg}`}>
          {label}
        </span>
      </div>

      <div className="w-25 h-26 flex-shrink-0 ml-2">
  <img src={image} alt="" className="w-full h-full object-contain" />
</div>
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────────────
export default function Explore() {
  const [activeTab, setActiveTab] = useState("Explore");
  const [moverFilter, setMoverFilter] = useState("Gainers");
  const [moverIndex, setMoverIndex] = useState("NIFTY 100");
  const [mostBought, setMostBought] = useState([]);
  const [topMovers, setTopMovers] = useState([]);
  const [moversLoading, setMoversLoading] = useState(false);
  const [Topintradaystocks,setTopintradaystocks]=useState([])
  const[MostboughtETFs,setMostboughtETFs]=useState([])
  const[ETFsbyGroww,setETFsbyGroww]=useState([])
  const[Stocksinnewstoday,setStocksinnewstoday]=useState([])
  const[Sectorstrendingtoday,setSectorstrendingtoday]=useState([])

  // ── Fetch most bought stocks ─────────────────────────────────────────────
  useEffect(() => {
    const fetchMostBoughtStocks = async () => {
      try {
        const response = await fetch(
          "https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=POPULAR_STOCKS_MOST_BOUGHT_MTF&page=0&size=4"
        );
        const data = await response.json();
        const rawStocks = data?.exploreCompanies?.POPULAR_STOCKS_MOST_BOUGHT_MTF || [];

        const formattedStocks = rawStocks.map((item) => {
          const ltp = item.stats.ltp || 0;
          const dayChange = item.stats.dayChange || 0;
          const dayChangePerc = item.stats.dayChangePerc || 0;
          const isUp = dayChange >= 0;

          return {
            logo: item.company.imageUrl,
            name: item.company.companyShortName || item.company.companyName,
            price: `₹${ltp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            changeVal: `${isUp ? "+" : ""}${dayChange.toFixed(2)}`,
            change: `${Math.abs(dayChangePerc).toFixed(2)}%`,
            up: isUp,
          };
        });

        setMostBought(formattedStocks);
      } catch (error) {
        console.error("Failed to fetch most bought stocks:", error);
      }
    };

    fetchMostBoughtStocks();
  }, []);


  // ── Top intraday stocks ─────────────────────────────────────────────
  useEffect(() => {
    const fetchTopintradaystocks = async () => {
      try {
        const response = await fetch(
          "https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=POPULAR_STOCKS_INTRADAY_VOLUME&page=0&size=4"
        );
        const data = await response.json();
        const rawStocks = data?.exploreCompanies?.POPULAR_STOCKS_INTRADAY_VOLUME || [];

        const formattedStocks = rawStocks.map((item) => {
          const ltp = item.stats.ltp || 0;
          const dayChange = item.stats.dayChange || 0;
          const dayChangePerc = item.stats.dayChangePerc || 0;
          const isUp = dayChange >= 0;

          return {
            logo: item.company.imageUrl,
            name: item.company.companyShortName || item.company.companyName,
            price: `₹${ltp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            changeVal: `${isUp ? "+" : ""}${dayChange.toFixed(2)}`,
            change: `${Math.abs(dayChangePerc).toFixed(2)}%`,
            up: isUp,
          };
        });

        setTopintradaystocks(formattedStocks);
      } catch (error) {
        console.error("Failed to fetch most bought stocks:", error);
      }
    };

    fetchTopintradaystocks();
  }, []);


  // ── Most bought ETFs ─────────────────────────────────────────────
  useEffect(() => {
  const fetchETFstocks = async () => {
    try {
      const response = await fetch(
        "https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=POPULAR_STOCKS_MOST_BOUGHT_ETF_INTERNATIONAL,POPULAR_STOCKS_MOST_BOUGHT_ETF_NIFTY_FIFTY,POPULAR_STOCKS_MOST_BOUGHT_ETF_SILVER,POPULAR_STOCKS_MOST_BOUGHT_ETF_GOLD&page=0&size=4"
      );

      const data = await response.json();

      console.log("ETF Response:", data);
      console.log("Explore Companies:", data?.exploreCompanies);

      const rawStocks = [
        ...(data?.exploreCompanies?.POPULAR_STOCKS_MOST_BOUGHT_ETF_INTERNATIONAL || []),
        ...(data?.exploreCompanies?.POPULAR_STOCKS_MOST_BOUGHT_ETF_NIFTY_FIFTY || []),
        ...(data?.exploreCompanies?.POPULAR_STOCKS_MOST_BOUGHT_ETF_SILVER || []),
        ...(data?.exploreCompanies?.POPULAR_STOCKS_MOST_BOUGHT_ETF_GOLD || []),
      ];

      console.log("ETF Stocks:", rawStocks);

      const formattedStocks = rawStocks.map((item) => {
        const ltp = item?.stats?.ltp || 0;
        const dayChange = item?.stats?.dayChange || 0;
        const dayChangePerc = item?.stats?.dayChangePerc || 0;
        const isUp = dayChange >= 0;

        return {
          logo: item?.company?.imageUrl,
          name: item?.company?.companyShortName || item?.company?.companyName,
          price: `₹${ltp.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          changeVal: `${isUp ? "+" : ""}${dayChange.toFixed(2)}`,
          change: `${Math.abs(dayChangePerc).toFixed(2)}%`,
          up: isUp,
        };
      });

      setMostboughtETFs(formattedStocks);
    } catch (error) {
      console.error("Failed to fetch ETFs:", error);
    }
  };

  fetchETFstocks();
}, []);

  // ── Stocksinnewstoday ─────────────────────────────────────────────

useEffect(() => {
  const fetchStocksInNewsToday = async () => {
    try {
      const response = await fetch(
        "https://groww.in/v2/api/feed/public?page=0&publisherId=stocknewssummary&size=4"
      );

      const data = await response.json();

      const rawNews = data?.feed || [];

      const formattedNews = rawNews.map((item) => ({
        logo: item?.data?.cta?.[0]?.logoUrl || "",
        name: item?.data?.cta?.[0]?.ctaText || "",
        change: "+0.00%",
        up: true,
        headline: item?.data?.body || item?.data?.title || "",
        time: "2 hours ago",
      }));

      setStocksinnewstoday(formattedNews);
    } catch (error) {
      console.error("Failed to fetch stocks in news:", error);
    }
  };

  fetchStocksInNewsToday();
}, []);

  // ── Sectorstrendingtoday ─────────────────────────────────────────────

useEffect(() => {
  const fetchTrendingSectors = async () => {
    try {
      const response = await fetch(
        "https://groww.in/bff/web/stocks/explore/web-pages/trending_sectors?pageSize=6"
      );

      const data = await response.json();

      const rawSectors = data?.data?.sectors || [];

      const formattedSectors = rawSectors.map((item) => ({
        icon: item.sectorLogo,
        name: item.sectorName,
        gainers: item.positiveStocks,
        losers: item.negativeStocks,
        change: `${item.dayChangePercent >= 0 ? "+" : ""}${item.dayChangePercent.toFixed(2)}%`,
      }));

      setSectorstrendingtoday(formattedSectors);
    } catch (error) {
      console.error("Failed to fetch trending sectors:", error);
    }
  };

  fetchTrendingSectors();
}, []);


// ── ETFs by Groww ─────────────────────────────────────────────
useEffect(() => {
  const fetchETFsbyGrowwstocks = async () => {
    try {
      const response = await fetch(
        "https://groww.in/v1/api/stocks_data/v2/explore/list/top/advance?discoveryAdvanceFilterTypes=ETF_NFO&page=0&size=4"
      );

      const data = await response.json();

      const rawStocks = data?.exploreCompanies?.ETF_NFO || [];

      const formattedStocks = rawStocks.map((item) => {
        const ltp = item?.stats?.ltp ?? 0;
        const dayChange = item?.stats?.dayChange ?? 0;
        const dayChangePerc = item?.stats?.dayChangePerc ?? 0;
        const isUp = dayChange >= 0;

        return {
          logo: item?.company?.imageUrl || "",
          name: item?.company?.companyShortName || item?.company?.companyName || "",
          price: ltp
            ? `₹${ltp.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "NFO",
          changeVal: `${isUp ? "+" : ""}${dayChange.toFixed(2)}`,
          change: `${Math.abs(dayChangePerc).toFixed(2)}%`,
          up: isUp,
        };
      });

      setETFsbyGroww(formattedStocks);
    } catch (error) {
      console.error("Failed to fetch ETFs by Groww:", error);
    }
  };

  fetchETFsbyGrowwstocks();
}, []);


  

  // ── Fetch top movers (re-runs when filter changes) ───────────────────────
  useEffect(() => {
    const fetchTopMovers = async () => {
      setMoversLoading(true);

      const moverType =
        moverFilter === "Gainers" ? "TOP_GAINERS" :
        moverFilter === "Losers" ? "TOP_LOSERS" :
        "VOLUME_SHOCKERS";

      try {
        const response = await fetch(
          `https://groww.in/bff/web/stocks/explore/web-pages/top_movers?indice=GIDXNIFTY100&moverType=${moverType}&pageSize=6`
        );
        const data = await response.json();
        const stocks = data?.data?.stocks || [];

        const formatted = stocks.map((item) => {
          const ltp = item.ltp || 0;
          const prev = item.close || 0;
          const dayChange = ltp - prev;
          const dayChangePct = prev ? (dayChange / prev) * 100 : 0;
          const isUp = dayChange >= 0;

          return {
            logo: item.logoUrl,
            name: item.companyShortName || item.companyName,
            price: `₹${ltp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            changeVal: `${isUp ? "+" : ""}${dayChange.toFixed(2)}`,
            change: `${Math.abs(dayChangePct).toFixed(2)}%`,
            up: isUp,
            volume: "-",
          };
        });

        setTopMovers(formatted);
      } catch (error) {
        console.error("Failed to fetch top movers:", error);
      } finally {
        setMoversLoading(false);
      }
    };

    fetchTopMovers();
  }, [moverFilter]);

  const tabs = ["Explore", "Holdings", "Positions", "Orders", "Watchlist"];

  const indices = [
    { name: "NIFTY", val: "23,910.80", chg: "-2.90", pct: "0.01%", up: false },
    { name: "SENSEX", val: "75,965.80", chg: "-43.90", pct: "0.06%", up: false },
    { name: "BANKNIFTY", val: "54,904.70", chg: "-188.20", pct: "0.34%", up: false },
    { name: "MIDCPNIFTY", val: "14,706.10", chg: "+30.50", pct: "0.21%", up: true },
    { name: "FINNIFTY", val: "25,795.40", chg: "-1.20", pct: "0.01%", up: false },
  ];

  const mtfStocks = [
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/ATGL.webp", name: "Adani Total Gas", price: "₹808.55", changeVal: "95.45", change: "13.39%", up: true },
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/HDFCBANK.webp", name: "HDFC Bank", price: "₹758.65", changeVal: "-20.25", change: "2.60%", up: false },
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/PINELABS1.png", name: "Pine Labs", price: "₹145.83", changeVal: "7.89", change: "5.72%", up: true },
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/ENRIN.webp", name: "Siemens Energy India", price: "₹3,766.10", changeVal: "303.50", change: "8.77%", up: true },
  ];

  // const intradayStocks = [
  //   { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/AMS_BANSAL1.webp", name: "Apollo Micro Systems", price: "₹418.25", changeVal: "6.15", change: "1.49%", up: true },
  //   { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/ATGL.webp", name: "Adani Total Gas", price: "₹774.45", changeVal: "61.35", change: "8.60%", up: true },
  //   { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/ATGL.webp", name: "Adani Power", price: "₹247.79", changeVal: "3.26", change: "1.33%", up: true },
  //   { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/MTARTECH.webp", name: "MTAR Technologies", price: "₹7,814.00", changeVal: "-64.00", change: "0.81%", up: false, bookmark: true },
  // ];

  const sectors = [
    { icon: "🔋", name: "Batteries", gainers: 7, losers: 1, change: "+3.17%" },
    { icon: "⛽", name: "Gas Distribution", gainers: 6, losers: 6, change: "+2.46%" },
    { icon: "⚡", name: "Electrical Equipment", gainers: 70, losers: 37, change: "+2.36%" },
    { icon: "🗑️", name: "Waste Management", gainers: 4, losers: 12, change: "-1.53%" },
    { icon: "🛡️", name: "Insurance", gainers: 3, losers: 12, change: "-1.58%" },
    { icon: "🚂", name: "Railways", gainers: 7, losers: 4, change: "-2.13%" },
  ];

  const etfsBought = [
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/tata_groww.png", name: "Tata Gold Exchange", price: "₹92.20", changeVal: "-0.20", change: "0.22%", up: false },
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/nippon_groww.png", name: "Nippon India Silver", price: "₹82.52", changeVal: "-0.08", change: "0.10%", up: false },
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/motilal_groww.png", name: "Motilal Oswal", price: "₹30.75", changeVal: "-0.33", change: "1.06%", up: false },
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/nippon_groww.png", name: "Nippon india ETF", price: "₹26.77", changeVal: "-0.11", change: "0.41%", up: false },
  ];

  const newsStocks = [
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/SUKHJIT.webp", name: "Sukhjit Starch", change: "-2.61%", up: false, headline: "Sukhjit Starch & Chemicals posted Q4 revenue of ₹4B, up from ₹3.6B YoY. This marks an 11% year-over-year...", time: "2 hours ago" },
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/KALLAM.webp", name: "Kallam Textiles", change: "+0.68%", up: true, headline: "Kallam Textiles Ltd seeks extension till June 15, 2026, for Q4 FY26 results due to audit delays. NCLT admitted...", time: "2 hours ago" },
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/AARTIIND.webp", name: "Aarti Industries", change: "+1.99%", up: true, headline: "Aarti Industries confirms repayment of Commercial Paper (CP) issued on Feb 25, 2026. The CP, bearing ISIN...", time: "2 hours ago" },
    { logo: "https://assets-netstorage.groww.in/stock-assets/logos2/SUBAM.webp", name: "Subam Papers", change: "-3.49%", up: false, headline: "Subam Papers Ltd planned to raise ₹107.04 Cr via preferential issue but received ₹74.36 Cr. Equity shares...", time: "2 hours ago" }
  ];

  const tradingScreens = [
    { title: "High momentum stocks", label: "Bullish", type: "Bullish",image:"https://storage.googleapis.com/groww-static-content/app-assets/stocks/stocksIcons/stocks_near_breakout_light.webp" },
    { title: "Volume shockers", label: "Bullish", type: "Bullish",image:"https://storage.googleapis.com/groww-static-content/app-assets/stocks/stocksIcons/macd_above_signal_line_light.webp" },
    { title: "52-week high breakouts", label: "Bullish", type: "Bullish",image:"https://storage.googleapis.com/groww-static-content/app-assets/stocks/stocksIcons/overbought_with_high_volume_light.webp" },
    { title: "Bearish MACD crossover", label: "Bearish", type: "Bearish",image:"https://storage.googleapis.com/groww-static-content/app-assets/stocks/stocksIcons/oversold_with_high_volume_light.webp" },
  ];

  const products = [
    { icon: "https://storage.googleapis.com/groww-assets/web-assets/img/stock/mint_ipo_light.svg", name: "IPO", badge: "4 open" },
    { icon: "https://storage.googleapis.com/groww-assets/web-assets/img/stock/bond_mint_light.svg", name: "Bonds", badge: null },
    { icon: "https://storage.googleapis.com/groww-static-content/web-assets/img/stock/mint_etf_light.webp", name: "ETFs", badge: null },
    { icon: "https://storage.googleapis.com/groww-assets/web-assets/img/stock/mint_intraday_light.svg", name: "Intraday Screener", badge: null },
    { icon: "https://resources.groww.in/web-assets/img/stock/stocks_sip_light.svg", name: "Stocks SIP", badge: null },
    { icon: "https://storage.googleapis.com/groww-assets/web-assets/img/stock/mtf_mint_light.svg", name: "MTF stocks", badge: null },
    { icon: "https://storage.googleapis.com/groww-assets/web-assets/img/stock/mint_event_light.svg", name: "Events calendar", badge: null },
    { icon: "https://storage.googleapis.com/groww-assets/web-assets/img/stock/mint_screener_light.svg", name: "All Stocks screener", badge: null },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 p-3" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── Top nav ──────────────────────────────────────────────────────── */}

   

      {/* ── Index ticker ─────────────────────────────────────────────────── */}
      {/* <div className="bg-white border-b border-gray-200 overflow-hidden">
        <div className="flex items-center gap-8 px-6 py-2.5 overflow-x-auto scrollbar-hide">
          {indices.map(idx => (
            <div key={idx.name} className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">{idx.name}</span>
              <span className="text-sm text-gray-900">{idx.val}</span>
              <span className={`text-sm ${idx.up ? "text-[#00b386]" : "text-[#eb5757]"}`}>
                {idx.chg} ({idx.pct})
              </span>
            </div>
          ))}
          <button className="flex-shrink-0 text-gray-400 hover:text-gray-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
        </div>
      </div> */}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="max-w-[1400px] mx-auto px-1 py-1">
        <div className="flex gap-6 ">

          {/* ── Left column (2/3) ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Most bought stocks */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Most bought stocks on Groww
              </h2>

               <div className="grid grid-cols-4 gap-3">
                {mtfStocks.map(s => <StockCard key={s.name} {...s} />)}
              </div>

              <a className="mt-4 text-sm text-[#00b386] font-medium hover:underline flex items-center gap-1" href="/stocks/most-bought-stocks-on-groww">
                See more
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </a>
            </section>

            {/* Top movers */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Top movers today</h2>
              <div className="flex items-center gap-3 mb-4">
                {["Gainers", "Losers", "Volume shockers"].map(f => (
                  <button key={f} onClick={() => setMoverFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      moverFilter === f
                        ? "border-gray-900 text-gray-900 bg-white"
                        : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"
                    }`}>
                    {f}
                  </button>
                ))}
                <button className="ml-1 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-gray-600 bg-white hover:border-gray-300 flex items-center gap-1">
                  {moverIndex}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
                <div className="flex items-center px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <div className="w-10 flex-shrink-0" />
                  <div className="ml-3 flex-1 text-xs text-gray-400 font-medium">Company</div>
                  <div className="mx-6 flex-shrink-0 w-16" />
                  <div className="text-xs text-gray-400 font-medium text-right w-36">Market price (1D)</div>
                  <div className="text-xs text-gray-400 font-medium text-right w-28">Volume</div>
                </div>

                {moversLoading ? (
                  <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                    Loading...
                  </div>
                ) : topMovers.length === 0 ? (
                  <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                    No data available
                  </div>
                ) : (
                  topMovers.map(s => <StockRow key={s.name} {...s} />)
                )}
              </div>

              <a className="mt-3 text-sm text-[#00b386] font-medium hover:underline flex items-center gap-1" href="/topmovers">
                See more
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </a>
            </section>

            {/* Most traded stocks in MTF */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Most traded stocks in MTF</h2>
              <div className="flex overflow-x-auto scrollbar-hide gap-1.5">
                {mostBought.map((s) => (
                  <div key={s.name} className="flex-shrink-0 px-0.5">
                    <StockCard {...s} />
                  </div>
                ))}
              </div>
              <a className="mt-3 text-sm text-[#00b386] font-medium hover:underline flex items-center gap-1" href="/stocks/mtf/most-traded">
                See more
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </a>
            </section>

            {/* Top intraday stocks */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Top intraday stocks</h2>
              <div className="grid grid-cols-4 gap-3">
                {Topintradaystocks.map(s => <StockCard key={s.name} {...s} />)}
              </div>
              <a className="mt-3 text-sm text-[#00b386] font-medium hover:underline flex items-center gap-1" href="/stocks/intraday">
                Intraday screener <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </a>
            </section>

            {/* Sectors trending today */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Sectors trending today</h2>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <div className="flex-1 text-xs text-gray-500">Sector</div>
                  <div className="mr-8 text-xs text-gray-500" style={{marginRight:"6rem"}}>Gainers/Losers</div>
                  <div className="w-20 text-xs text-gray-500 text-right">1D price change</div>
                </div>
                {Sectorstrendingtoday.map(s => <SectorRow key={s.name} {...s} />)}
              </div>
              <a className="mt-3 text-sm text-[#00b386] font-medium hover:underline flex items-center gap-1" href="/stocks/sectors-trending" >
                See all sectors <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </a>
            </section>

            {/* Most bought ETFs */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Most bought ETFs</h2>
              <div className="grid grid-cols-4 gap-3">
                {MostboughtETFs.map(s => <StockCard key={s.name} {...s} />)}
              </div>
              <a className="mt-3 text-sm text-[#00b386] font-medium hover:underline flex items-center gap-1" href="/etfs">
                See all ETFs <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </a>
            </section>

            {/* ETFs by Groww */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">ETFs by Groww</h2>
              <div className="grid grid-cols-4 gap-3">
                {ETFsbyGroww.map(s => <StockCard key={s.name + "-groww"} {...s} />)}
              </div>
              <a className="mt-3 text-sm text-[#00b386] font-medium hover:underline flex items-center gap-1" href="/etf-nfo">
                See all ETFs <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </a>
            </section>

            {/* Stocks in news today */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Stocks in news today</h2>
              <div className="grid grid-cols-2 gap-4">
                {Stocksinnewstoday.map(s => <NewsCard key={s.name} {...s} />)}
              </div>
              <a className="mt-4 text-sm text-[#00b386] font-medium hover:underline flex items-center gap-1">
                See more news
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </a>
            </section>

          </div>

          {/* ── Right column (sidebar) ──────────────────────────────────── */}

          <aside className="w-[360px] flex-shrink-0 space-y-4 h-fit self-start">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your investments</h2>

            {/* Your investments */}
            <div className="bg-white border border-gray-300 rounded-xl p-6 h-48">
              <div className="flex flex-col items-center py-4">
                <div className="w-32 h-24 mb-3">
                  <img src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/newToStocks.b40891fd.svg" alt="" />
                </div>
                <p className="text-sm text-gray-600">You haven't invested yet</p>
              </div>
            </div>

            {/* Products & Tools */}
            <h2 className="text-xl font-semibold text-gray-900 px-1 pt-4 pb-2 mt-10">Products & Tools</h2>

            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
              {products.map((p, i) => (
                <div key={p.name} className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer ${i < products.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg w-6 text-center"><img src={p.icon} alt="" /></span>
                    <span className="text-sm text-gray-800">{p.name}</span>
                  </div>
                  {p.badge && (
                    <span className="text-xs text-white bg-[#00b386] px-2 py-0.5 rounded-full">{p.badge}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Trading Screens */}
            <div className="sticky  top-25 mt-30">
            <h3 className="text-xl font-semibold text-gray-900 px-1 pt-4 pb-2">Trading screens</h3>

            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden  shadow-sm">
              {tradingScreens.map((t) => (
                <TradingCard key={t.title} {...t} />
              ))}
              <div className="px-4 py-3.5 bg-white">
                <button className="text-sm text-[#00b386] font-medium hover:underline flex items-center gap-1">
                  All trading screens
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            </div>

          </aside>
        </div>
      </main>


    </div>
  );
}
