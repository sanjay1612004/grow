import React, { useState, useEffect, useCallback, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Footer from '../landingpage/Footer';
import { UserPicture } from '../../App';
import ProfileDropdown from "../UserModule/ProfileDropdown";

// ─── News feed fallback ───────────────────────────────────────────────────────
const FALLBACK_FEED = [
  { postId: "f1", publishedAt: new Date(Date.now() - 5*60*1000).toISOString(), publisher: "Stock News Summary",
    data: { title: "NMDC targets 0.75-1 MT coal output from its captive mine in Q2. Higher profits expected, driven by improved operational efficiency.", body: "NMDC targets 0.75-1 MT coal output from its captive mine in Q2.\n\nHigher profits expected, driven by improved operational efficiency and better coal realisations.\n\nSource: Livesquawk",
      cta: [{ ctaText: "NMDC", ctaUrl: "https://groww.in/stocks/nmdc-ltd", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/NMDC.webp" }], reactions: [{ count: 0 }] } },
  { postId: "f2", publishedAt: new Date(Date.now() - 5*60*1000).toISOString(), publisher: "Stock News Summary",
    data: { title: "MOFSL highlights SBI, BEL, Tata Steel, Infosys, and M&M among top Nifty picks post Q4 results.", body: "MOFSL highlights SBI, BEL, Tata Steel, Infosys, and M&M among top Nifty picks post Q4 results.\n\nNon-Nifty picks also identified for portfolio diversification.\n\nSource: ScoutQuest",
      cta: [{ ctaText: "MO Financial", ctaUrl: "https://groww.in/stocks/motilal-oswal-financial-services-ltd", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/MOTILALOFS.webp" }], reactions: [{ count: 0 }] } },
  { postId: "f3", publishedAt: new Date(Date.now() - 5*60*1000).toISOString(), publisher: "Stock News Summary",
    data: { title: "HDFC Bank Ltd. sees heavy Rs 700, Rs 750 put option interest before June 2026 expiry. With stock at Rs 745.", body: "HDFC Bank Ltd. sees heavy Rs 700, Rs 750 put option interest before June 2026 expiry.\n\nWith stock at Rs 745, options activity signals key support zones.\n\nSource: Livesquawk",
      cta: [{ ctaText: "HDFC Bank", ctaUrl: "https://groww.in/stocks/hdfc-bank-ltd", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/HDFCBANK.webp" }], reactions: [{ count: 0 }] } },
  { postId: "f4", publishedAt: new Date(Date.now() - 6*60*1000).toISOString(), publisher: "Stock News Summary",
    data: { title: "Cholamandalam Investment & Finance Co Ltd is rated Hold by MarketsMojo. The rating was last updated on 0.", body: "Cholamandalam Investment & Finance Co Ltd is rated Hold by MarketsMojo.\n\nThe rating was last updated recently with a target price revision.\n\nSource: ScoutQuest",
      cta: [{ ctaText: "Cholamandalam Invest", ctaUrl: "https://groww.in/stocks/cholamandalam-investment-and-finance-company-ltd", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/M&MFIN.webp" }], reactions: [{ count: 0 }] } },
  { postId: "f5", publishedAt: new Date(Date.now() - 7*60*1000).toISOString(), publisher: "Stock News Summary",
    data: { title: "MCX Sees ₹31 Cr Block Deal at ₹3,057", body: "MCX saw an NSE block trade of Rs. 31.04 cr for 101,536 shares.\n\nThe shares were traded at Rs. 3,057.10 each.\n\nSource: Livesquawk",
      cta: [{ ctaText: "MCX", ctaUrl: "https://groww.in/stocks/multi-commodity-exchange-of-india-ltd", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/MCX_1.webp" }], reactions: [{ count: 4 }] } },
  { postId: "f6", publishedAt: new Date(Date.now() - 8*60*1000).toISOString(), publisher: "Stock News Summary",
    data: { title: "Coffee Day Jumps 20% on Strong Q4 Results", body: "Coffee Day shares surged 20% after the announcement of Q4 results.\n\nSource: ScoutQuest",
      cta: [{ ctaText: "Coffee Day Entr", ctaUrl: "https://groww.in/stocks/coffee-day-enterprises-ltd", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/CoffeeDayEnter_14875379836_54778.png" }], reactions: [{ count: 7 }] } },
];

// ─── Movers fallback ──────────────────────────────────────────────────────────


const FALLBACK_GAINERS = [
  { companyShortName: "LTM",           searchId: "larsen-toubro-infotech-ltd",          ltp: 4258.7,  close: 4061.6, logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/LTIM.webp",       nseScriptCode: "LTM" },
  { companyShortName: "Tech Mahindra", searchId: "tech-mahindra-ltd",                    ltp: 1553.7,  close: 1483.9, logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/TECHM.webp",      nseScriptCode: "TECHM" },
  { companyShortName: "Infosys",       searchId: "infosys-ltd",                           ltp: 1213.2,  close: 1160.9, logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/INFY.webp",       nseScriptCode: "INFY" },
  { companyShortName: "Coal India",    searchId: "coal-india-ltd",                        ltp: 473.5,   close: 457.9,  logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/COALINDIA.webp",  nseScriptCode: "COALINDIA" },
  { companyShortName: "TCS",           searchId: "tata-consultancy-services-ltd",         ant: 2332.0,  close: 2258.9, logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/TCS.webp",        nseScriptCode: "TCS" },
  { companyShortName: "Zydus",         searchId: "cadila-healthcare-ltd",                 ltp: 1103.4,  close: 1077.7, logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/ZYDUSLIFE.webp",  nseScriptCode: "ZYDUSLIFE" },
];
const FALLBACK_LOSERS = [
  { companyShortName: "Delta Corp",    searchId: "delta-corp-ltd",                        ltp: 125.4,   close: 142.6,  logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/DELTACORP.png",   nseScriptCode: "DELTACORP" },
  { companyShortName: "ONGC",          searchId: "oil-natural-gas-corporation-ltd",       ltp: 238.9,   close: 249.3,  logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/ONGC.webp",       nseScriptCode: "ONGC" },
  { companyShortName: "Bharti Airtel", searchId: "bharti-airtel-ltd",                     ltp: 1798.5,  close: 1832.0, logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/BHARTIARTL.webp", nseScriptCode: "BHARTIARTL" },
  { companyShortName: "Cummins India", searchId: "cummins-india-ltd",                     ltp: 2874.3,  close: 3319.0, logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/CUMMINSIND.png",  nseScriptCode: "CUMMINSIND" },
  { companyShortName: "Siemens",       searchId: "siemens-ltd",                           ltp: 5862.0,  close: 6453.0, logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/SIEMENS.png",     nseScriptCode: "SIEMENS" },
  { companyShortName: "Vedanta",       searchId: "vedanta-ltd",                           ltp: 432.1,   close: 463.0,  logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos2/VEDL.png",        nseScriptCode: "VEDL" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTimeAgo(dateString) {
  try {
    const diffMs   = Math.abs(Date.now() - new Date(dateString));
    const diffSecs  = Math.floor(diffMs / 1000);
    const diffMins  = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays  = Math.floor(diffHours / 24);
    if (diffSecs < 60)  return "Just now";
    if (diffMins < 60)  return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch { return "1d ago"; }
}

function fmtPrice(n) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcChange(ltp, close) {
  const change    = ltp - close;
  const changePct = close !== 0 ? (change / close) * 100 : 0;
  return { change, changePct };
}

// ─── Skeleton: news card ──────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#ebebeb] p-5 flex flex-col gap-3">
      <div className="w-11 h-11 rounded-xl bg-[#f3f3f3] animate-pulse" />
      <div className="flex items-center justify-between">
        <div className="h-3.5 w-28 rounded bg-[#f3f3f3] animate-pulse" />
        <div className="h-3.5 w-14 rounded bg-[#f3f3f3] animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-[#f3f3f3] animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-[#f3f3f3] animate-pulse" />
        <div className="h-3 w-3/4 rounded bg-[#f3f3f3] animate-pulse" />
      </div>
      <div className="h-3 w-20 rounded bg-[#f3f3f3] animate-pulse mt-1" />
    </div>
  );
}

// ─── Skeleton: sidebar mover row ──────────────────────────────────────────────
function SkeletonMoverRow() {
  return (
    <div className="flex items-center justify-between py-[14px] border-b border-[#f5f5f5] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#f3f3f3] animate-pulse shrink-0" />
        <div className="h-3.5 w-24 rounded bg-[#f3f3f3] animate-pulse" />
      </div>
      <div className="text-right space-y-1.5">
        <div className="h-3.5 w-20 rounded bg-[#f3f3f3] animate-pulse ml-auto" />
        <div className="h-3 w-28 rounded bg-[#f3f3f3] animate-pulse ml-auto" />
      </div>
    </div>
  );
}

// ─── News card ────────────────────────────────────────────────────────────────
function GrowwCard({ company, logo, title, body, time, change, isUp, url }) {
  const bodyText = (body ?? "").replace(/\n+/g, " ").trim();
  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl border border-[#ebebeb] p-5 flex flex-col hover:shadow-md hover:border-[#d8d8d8] transition-all duration-200 no-underline cursor-pointer min-h-[190px]"
    >
      {/* Logo */}
      <div className="mb-3">
        {logo ? (
          <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-[#ebebeb]">
            <img src={logo} alt={company ?? ""} className="w-9 h-9 object-contain"
              onError={e => { e.target.style.display = "none"; e.target.parentNode.classList.add("bg-[#f3f3f3]"); }} />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-xl bg-[#f3f3f3]" />
        )}
      </div>

      {/* Company + change % */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-bold text-gray-700 leading-none truncate max-w-[65%]">{company}</span>
        {change && (
          <span className={`text-[13px] font-bold tabular-nums leading-none ${isUp ? "text-[#00b386]" : "text-[#eb5b3c]"}`}>
            {change}
          </span>
        )}
      </div>

    

      {/* Body — 3-line clamp */}
      <p className="text-[12.5px] text-[#7c7e8c] leading-relaxed flex-1 mb-3 line-clamp-2">
        {bodyText}
      </p>

      {/* Footer */}
      <div className="pt-3 border-t border-[#f7f9fa] flex items-center justify-between">
        <span className="text-[11.5px] text-[#b0b2be]">{time}</span>
        <span className="text-[12px] font-semibold text-[#00b386] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          Explore →
        </span>
      </div>
    </a>
  );
}

// ─── Sidebar mover row (screenshot-accurate) ──────────────────────────────────
function MoverRow({ stock, isGainer }) {
  const { change, changePct } = calcChange(stock.ltp, stock.close);
  const sign  = change >= 0 ? "+" : "";

  return (
    <a
      href={`https://groww.in/stocks/${stock.searchId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between py-[14px] border-b border-[#f5f5f5] last:border-0 no-underline -mx-5 px-5 hover:bg-[#fafafa] transition-colors duration-150"
    >
      {/* Logo + name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl border border-[#ebebeb] bg-white flex items-center justify-center overflow-hidden shrink-0">
          <img src={stock.logoUrl} alt={stock.companyShortName} className="w-8 h-8 object-contain"
            onError={e => { e.target.style.display = "none"; e.target.parentNode.classList.add("bg-[#f5f5f5]"); }} />
        </div>
        <span className="text-[14px] font-semibold text-[#1e2237] leading-none truncate">
          {stock.companyShortName}
        </span>
      </div>

      {/* Price + change */}
      <div className="text-right shrink-0 ml-3">
        <p className="text-[14px] font-semibold text-[#1e2237] leading-none mb-[5px]">
          ₹{fmtPrice(stock.ltp)}
        </p>
        <p className={`text-[12.5px] font-semibold leading-none ${isGainer ? "text-[#00b386]" : "text-[#eb5b3c]"}`}>
          {sign}{fmtPrice(Math.abs(change))} ({sign}{Math.abs(changePct).toFixed(2)}%)
        </p>
      </div>
    </a>
  );
}

// ─── Sidebar movers panel ─────────────────────────────────────────────────────
function MoversPanel({ title, stocks, loading, isGainer }) {
  const seeMoreUrl  = isGainer
    ? "https://groww.in/stocks/top-gainers"
    : "https://groww.in/stocks/top-losers";

  return (
    <div>
    <div className="flex items-center justify-between px-5 pt-5 pb-1 mb-3 ">
        <h2 className="text-[18px] font-semibold text-gray-700 leading-none">{title}</h2>
        <a href={seeMoreUrl} target="_blank" rel="noopener noreferrer"
          className={`text-[13px]  font-semibold no-underline ${isGainer ? "text-[#00b386]" : "text-[#eb5b3c]"}`}>
          See more
        </a>
      </div>
    <div className="bg-white rounded-2xl border border-[#ebebeb] overflow-hidden w-[400px]">
      
      {/* Rows */}
      <div className="px-5 pb-2">
        {loading
          ? [...Array(4)].map((_, i) => <SkeletonMoverRow key={i} />)
          : stocks.map(s => (
              <MoverRow key={s.nseScriptCode || s.companyShortName} stock={s} isGainer={isGainer} />
            ))
        }
      </div>
    </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function GrowwStockNews() {
  const [feedItems,      setFeedItems]      = useState([]);
  const [gainers,        setGainers]        = useState([]);
  const [losers,         setLosers]         = useState([]);
  const [loadingFeed,    setLoadingFeed]    = useState(true);
  const [loadingGainers, setLoadingGainers] = useState(true);
  const [loadingLosers,  setLoadingLosers]  = useState(true);
  const [isRefreshing,   setIsRefreshing]   = useState(false);
  const [usingFallback,  setUsingFallback]  = useState(false);
 const {userPic,setuserPic}=useContext(UserPicture)
  const [showProfile, setShowProfile] = useState(false);
  

  const MOVERS_BASE = "https://groww.in/bff/web/stocks/explore/web-pages/top_movers?indice=GIDXNIFTY100&pageSize=4&moverType=";

  // Fetch news feed
  const fetchFeed = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setLoadingFeed(true);
    try {
      const res  = await fetch("https://groww.in/v2/api/feed/public?page=0&publisherId=stocknewssummary&size=50");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = data.feed ?? [];
      if (items.length === 0) throw new Error("empty");
      setFeedItems(items);
      setUsingFallback(false);
    } catch (err) {
      console.error("Feed fetch error:", err);
      setFeedItems(FALLBACK_FEED);
      setUsingFallback(true);
    } finally {
      setLoadingFeed(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch gainers
  const fetchGainers = useCallback(async () => {
    setLoadingGainers(true);
    try {
      const res  = await fetch(MOVERS_BASE + "TOP_GAINERS");
      if (!res.ok) throw new Error();
      const json = await res.json();
      const list = json?.data?.stocks ?? [];
      setGainers(list.length ? list : FALLBACK_GAINERS);
    } catch {
      setGainers(FALLBACK_GAINERS);
    } finally {
      setLoadingGainers(false);
    }
  }, []);

  // Fetch losers
  const fetchLosers = useCallback(async () => {
    setLoadingLosers(true);
    try {
      const res  = await fetch(MOVERS_BASE + "TOP_LOSERS");
      if (!res.ok) throw new Error();
      const json = await res.json();
      const list = json?.data?.stocks ?? [];
      setLosers(list.length ? list : FALLBACK_LOSERS);
    } catch {
      setLosers(FALLBACK_LOSERS);
    } finally {
      setLoadingLosers(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    fetchGainers();
    fetchLosers();
  }, [fetchFeed, fetchGainers, fetchLosers]);

  // Map raw feed item → GrowwCard flat props
  const renderCards = (items) =>
    items.map((item, index) => {
      const cta       = item.data?.cta?.[0];
      const isUpIndex = index % 3 !== 0;
      const mockChange = `${isUpIndex ? "+" : "-"}${((index + 1) * 1.34).toFixed(2)}%`;
      return (
        <GrowwCard
          key={item.postId || index}
          company={cta?.ctaText || "Market News"}
          logo={cta?.logoUrl}
          title={item.data?.title}
          body={item.data?.body}
          time={formatTimeAgo(item.publishedAt)}
          change={cta?.change || mockChange}
          isUp={cta?.isUp !== undefined ? cta.isUp : isUpIndex}
          url={cta?.ctaUrl}
        />
      );
    });

  return (
    <div className="w-full min-h-screen bg-white text-[#1c1c1c] antialiased selection:bg-[#00b386]/20 font-sans">

      {/* ── Navbar ── */}
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6 border-b border-gray-200 sticky top-0 z-10 bg-white/60 backdrop-blur-md">
        <img
          src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp"
          alt="Groww" height={30} width={30}
        />
        <nav className="flex items-center gap-6">
          {["Stocks", "Explore", "Holdings", "Positions", "WatchList"].map(item => (
            <NavLink
              key={item}
              to={`/user/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `text-[15px] font-semibold ${isActive
                  ? "text-gray-700 border-b-2 border-[#00d09c] pb-1"
                  : "text-gray-500 hover:text-gray-700"}`
              }
            >
              {item}
            </NavLink>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-xs ml-auto">
          <div className="flex items-center bg-gray-200 border border-gray-200 rounded-lg px-3 h-9 gap-2 focus-within:border-gray-400 focus-within:bg-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
              <path d="M20 20l-3-3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search Groww...."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none"
            />
            <span className="text-xs text-gray-400 bg-gray-300 rounded px-1.5 py-0.5 flex-shrink-0">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <div className="cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
            {userPic && <img src={userPic} alt="" width={28} height={28} className='rounded-2xl'/>}
            {!userPic && <img src='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'  width={28} height={28} className='rounded-2xl'/>}
          </div>
          {showProfile && (
            <div className="absolute right-5 top-12 z-[9999]">
              <ProfileDropdown/>
            </div>
          )}
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="max-w-[1240px] mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT: news feed ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-gray-700">Stocks In News Today</h1>
              
            </div>

            {loadingFeed ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCards(feedItems)}
              </div>
            )}
          </div>

          {/* ── RIGHT: sidebar movers ── */}
          <div className="w-full lg:w-[330px] shrink-0 space-y-5">
            <MoversPanel
              title="Top gainers today"
              stocks={gainers}
              loading={loadingGainers}
              isGainer={true}
            />
            <MoversPanel
              title="Top losers today"
              stocks={losers}
              loading={loadingLosers}
              isGainer={false}
            />
          </div>

        </div>
      </div>
      <Footer/>
    </div>
  );
}
