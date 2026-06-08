import { useState, useEffect, useRef, useContext } from "react";
import Footer from "../landingpage/Footer";
import { UserPicture } from "../../App";
import { NavLink } from "react-router-dom";
import ProfileDropdown from "../UserModule/ProfileDropdown";

// ─── Groww Design Tokens ──────────────────────────────────────────────────────
const GROWW_ACCENT   = "#04b488";
const GROWW_NEGATIVE = "#ed5533";
const GROWW_GRAY900  = "#44475b";
const GROWW_GRAY700  = "#7c7e8c";
const GROWW_GRAY500  = "#a1a3ad";
const GROWW_GRAY150  = "#e9e9eb";
const GROWW_GRAY100  = "#f0f0f2";
const GROWW_GRAY50   = "#f8f8f8";

// ─── API Endpoints ────────────────────────────────────────────────────────────
const GLOBAL_API_URL =
  "https://groww.in/v1/api/stocks_data/v1/global_instruments?instrumentType=GLOBAL_INSTRUMENTS";
const INDIAN_INFO_API_URL =
  "https://groww.in/v1/api/stocks_data/v1/company/search_id/nifty?fields=ALL_ASSETS&page=0&size=50";
const INDIAN_LIVE_API_URL = "http://localhost:8000/api/indices";

// ─── Country → Flag emoji map ─────────────────────────────────────────────────
const COUNTRY_FLAG = {
  SINGAPORE:    "🇸🇬",
  US:           "🇺🇸",
  JAPAN:        "🇯🇵",
  "HONG KONG":  "🇭🇰",
  GERMANY:      "🇩🇪",
  FRANCE:       "🇫🇷",
  "SOUTH KOREA":"🇰🇷",
  UK:           "🇬🇧",
  INDIA:        "🇮🇳",
  CHINA:        "🇨🇳",
};

// ─── NSE symbol → searchId mapping (to join info + live price APIs) ───────────
// Maps the nseScriptCode used as key in indexLivePointsMap back to searchId
const NSE_SYMBOL_TO_SEARCH_ID = {
  NIFTY:             "nifty",
  BANKNIFTY:         "nifty-bank",
  FINNIFTY:          "nifty-financial-services",
  NIFTYMIDSELECT:    "nifty-midcap-select",
  INDIAVIX:          "india-vix",
  NIFTYTOTALMCAP:    "nifty-total-market-index",
  NIFTYJR:           "nifty-next",
  NIFTY100:          "nifty-218500",
  NIFTYMIDCAP:       "nifty-midcap",
  NIFTYIT:           "nifty-it",
  NIFTYPHARMA:       "nifty-pharma",
  NIFTYAUTO:         "nifty-auto",
  NIFTYFMCG:         "nifty-fmcg",
  NIFTYMETAL:        "nifty-metal",
  NIFTYPSUBANK:      "nifty-psu-bank",
  NIFTYSMALL:        "nifty-smallcap-100",
  NIFTY500:          "nifty-500",
  NIFTYSMALLCAP250:  "nifty-smallcap-250",
  NIFTYMIDCAP150:    "nifty-midcap-150",
  NIFTYCDTY:         "nifty-commodities",
};

// BSE script code → searchId
const BSE_CODE_TO_SEARCH_ID = {
  "1":  "sp-bse-sensex",
  "14": "sp-bse-bankex",
  "2":  "bse-100",
  "19": "bse-smallcap",
  "23": "bse-ipo",
  "93": "bse-focit",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n, dec = 2) {
  if (n === undefined || n === null || isNaN(n)) return "—";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
}

function fmtChange(change, perc) {
  if (change === undefined || change === null) return "—";
  const sign = change >= 0 ? "+" : "";
  return `${sign}${fmt(change)} (${sign}${Math.abs(perc).toFixed(2)}%)`;
}

function fmtTs(tsInMillis) {
  if (!tsInMillis) return "—";
  // tsInMillis from Groww is in seconds (epoch), not ms
  const d = new Date(tsInMillis * 1000);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Data fetching ────────────────────────────────────────────────────────────

/**
 * Fetches global indices.
 * Returns array of normalized items shaped for <GlobalRow />.
 */
async function fetchGlobalIndices() {
  const res = await fetch(GLOBAL_API_URL);
  if (!res.ok) throw new Error(`Global API ${res.status}`);
  const json = await res.json();

  return (json.aggregatedGlobalInstrumentDto || []).map((entry) => {
    const live   = entry.livePriceDto       || {};
    const detail = entry.instrumentDetailDto || {};
    const country = (detail.country || "").toUpperCase();
    return {
      name:      detail.name     || detail.symbol || "—",
      flag:      COUNTRY_FLAG[country] || "🌐",
      logoUrl:   detail.logoUrl  || "",
      searchId:  detail.searchId || "",
      time:      fmtTs(live.tsInMillis),
      ltp:       live.value,
      change:    live.dayChange,
      changePerc:live.dayChangePerc,
      high:      live.high,
      low:       live.low,
      open:      live.open,
      prevClose: live.close,
    };
  });
}

/**
 * Fetches Indian indices by merging:
 *  - Info API  → header (displayName, logoUrl, isFnoEnabled, …) + yearLow/High
 *  - Live API  → ltp, change, changePerc, high, low, open, prevClose
 *
 * Returns array of normalized items shaped for <IndianRow />.
 */
async function fetchIndianIndices() {
  // Fire both requests in parallel
  const [infoRes, liveRes] = await Promise.all([
    fetch(INDIAN_INFO_API_URL),
    fetch(INDIAN_LIVE_API_URL),
  ]);

  if (!infoRes.ok) throw new Error(`Indian info API ${infoRes.status}`);
  if (!liveRes.ok) throw new Error(`Indian live API ${liveRes.status}`);

  const infoJson = await infoRes.json();
  const liveJson = await liveRes.json();

  // Build a searchId → liveData lookup from both NSE and BSE maps
  const liveBySearchId = {};

  const nseMap = liveJson?.exchangeAggRespMap?.NSE?.indexLivePointsMap || {};
  for (const [symbol, data] of Object.entries(nseMap)) {
    const sid = NSE_SYMBOL_TO_SEARCH_ID[symbol];
    if (sid) liveBySearchId[sid] = data;
  }

  const bseMap = liveJson?.exchangeAggRespMap?.BSE?.indexLivePointsMap || {};
  for (const [code, data] of Object.entries(bseMap)) {
    const sid = BSE_CODE_TO_SEARCH_ID[code];
    if (sid) liveBySearchId[sid] = data;
  }

  return (infoJson.allAssets || []).map((asset) => {
    const header = asset.header || {};
    const sid    = header.searchId;
    const live   = liveBySearchId[sid] || {};

    return {
      header: {
        searchId:        sid,
        displayName:     header.displayName || header.shortName || sid,
        logoUrl:         header.logoUrl     || "",
        isFnoEnabled:    header.isFnoEnabled || false,
        isNseFnoEnabled: header.isNseFnoEnabled || false,
        isBseFnoEnabled: header.isBseFnoEnabled || false,
      },
      yearLow:   asset.yearLowPrice,
      yearHigh:  asset.yearHighPrice,
      ltp:       live.value,
      change:    live.dayChange,
      changePerc:live.dayChangePerc,
      high:      live.high,
      low:       live.low,
      open:      live.open,
      prevClose: live.close,
      tsInMillis:live.tsInMillis,
    };
  });
}

// ─── Logo with fallback ───────────────────────────────────────────────────────
function IndexLogo({ logoUrl, displayName }) {
  const [err, setErr] = useState(false);
  if (err || !logoUrl) {
    return (
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: GROWW_GRAY100, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 10, fontWeight: 600,
        color: GROWW_GRAY700, flexShrink: 0,
      }}>
        {(displayName || "??").slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={logoUrl}
      alt={displayName}
      onError={() => setErr(true)}
      style={{
        width: 32, height: 32, borderRadius: "50%",
        objectFit: "contain", flexShrink: 0, background: "#fff",
        border: `1px solid ${GROWW_GRAY150}`,
      }}
    />
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "28% 12% 16% 11% 11% 11% 11%",
      alignItems: "center",
      padding: "0 16px",
      minHeight: 56,
      borderBottom: `1px solid ${GROWW_GRAY150}`,
    }}>
      {[28, 12, 16, 11, 11, 11, 11].map((w, i) => (
        <div key={i} style={{ display: "flex", justifyContent: i === 0 ? "flex-start" : "flex-end" }}>
          <div style={{
            height: 14,
            width: `${40 + Math.random() * 30}%`,
            borderRadius: 4,
            background: GROWW_GRAY100,
            animation: "pulse 1.4s ease-in-out infinite",
          }} />
        </div>
      ))}
    </div>
  );
}

// ─── Table Header ─────────────────────────────────────────────────────────────
function TableHeader() {
  const cols = [
    { label: "Index name",  align: "left",  width: "28%" },
    { label: "Last traded", align: "right", width: "12%" },
    { label: "Day change",  align: "right", width: "16%" },
    { label: "High",        align: "right", width: "11%" },
    { label: "Low",         align: "right", width: "11%" },
    { label: "Open",        align: "right", width: "11%" },
    { label: "Prev. Close", align: "right", width: "11%" },
  ];
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: cols.map(c => c.width).join(" "),
      borderBottom: `1px solid ${GROWW_GRAY150}`,
      padding: "10px 16px",
      background: "#fff",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      {cols.map(col => (
        <div key={col.label} style={{
          fontSize: 12, fontWeight: 435, color: GROWW_GRAY700,
          textAlign: col.align, fontFamily: "GrowwSans, system-ui, sans-serif",
          lineHeight: "18px",
        }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

// ─── Indian Indices Row ───────────────────────────────────────────────────────
function IndianRow({ item }) {
  const [hovered, setHovered] = useState(false);
  const isUp = (item.change ?? 0) >= 0;
  const changeColor = isUp ? GROWW_ACCENT : GROWW_NEGATIVE;
  const timeStr = item.tsInMillis ? fmtTs(item.tsInMillis) : "—";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "28% 12% 16% 11% 11% 11% 11%",
        alignItems: "center",
        padding: "0 16px",
        minHeight: 56,
        borderBottom: `1px solid ${GROWW_GRAY150}`,
        background: hovered ? GROWW_GRAY50 : "#fff",
        cursor: "pointer",
        transition: "background-color 0.15s ease",
      }}
    >
      {/* Index name cell */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <IndexLogo logoUrl={item.header.logoUrl} displayName={item.header.displayName} />
        <div style={{ marginLeft: 12, display: "flex", flexDirection: "column", minHeight: 30, justifyContent: "center" }}>
          <span style={{
            fontSize: 14, fontWeight: 535,
            color: hovered ? GROWW_ACCENT : GROWW_GRAY900,
            textDecoration: hovered ? "underline" : "none",
            fontFamily: "GrowwSans, system-ui, sans-serif", lineHeight: "20px",
            transition: "color 0.15s",
          }}>
            {item.header.displayName}
          </span>
          <span style={{ fontSize: 12, color: GROWW_GRAY500, fontFamily: "GrowwSans, system-ui, sans-serif", lineHeight: "18px" }}>
            {timeStr}
          </span>
        </div>
      </div>

      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmt(item.ltp)}
      </div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: changeColor, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmtChange(item.change, item.changePerc)}
      </div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmt(item.high)}
      </div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmt(item.low)}
      </div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmt(item.open)}
      </div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmt(item.prevClose)}
      </div>
    </div>
  );
}

// ─── Global Indices Row ───────────────────────────────────────────────────────
function GlobalRow({ item }) {
  const [hovered, setHovered] = useState(false);
  const isUp = (item.change ?? 0) >= 0;
  const changeColor = isUp ? GROWW_ACCENT : GROWW_NEGATIVE;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "28% 12% 16% 11% 11% 11% 11%",
        alignItems: "center",
        padding: "0 16px",
        minHeight: 56,
        borderBottom: `1px solid ${GROWW_GRAY150}`,
        background: hovered ? GROWW_GRAY50 : "#fff",
        cursor: "pointer",
        transition: "background-color 0.15s ease",
      }}
    >
      {/* Flag / Logo + Name */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {item.logoUrl ? (
          <IndexLogo logoUrl={item.logoUrl} displayName={item.name} />
        ) : (
          <div style={{
            width: 32, height: 32, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22, flexShrink: 0,
          }}>
            {item.flag}
          </div>
        )}
        <div style={{ marginLeft: 12, display: "flex", flexDirection: "column", minHeight: 30, justifyContent: "center" }}>
          <span style={{
            fontSize: 14, fontWeight: 535,
            color: hovered ? GROWW_ACCENT : GROWW_GRAY900,
            textDecoration: hovered ? "underline" : "none",
            fontFamily: "GrowwSans, system-ui, sans-serif", lineHeight: "20px",
            transition: "color 0.15s",
          }}>
            {item.name}
          </span>
          <span style={{ fontSize: 12, color: GROWW_GRAY500, fontFamily: "GrowwSans, system-ui, sans-serif", lineHeight: "18px" }}>
            {item.time}
          </span>
        </div>
      </div>

      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmt(item.ltp)}</div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: changeColor, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmtChange(item.change, item.changePerc)}</div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmt(item.high)}</div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmt(item.low)}</div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmt(item.open)}</div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmt(item.prevClose)}</div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function Tabs({ active, onChange }) {
  const tabs = [
    { id: "indian", label: "Indian Indices" },
    { id: "global", label: "Global Indices" },
  ];
  const containerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabRefs = useRef({});

  useEffect(() => {
    const el = tabRefs.current[active];
    if (el && containerRef.current) {
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const tabRect = el.getBoundingClientRect();
      setIndicator({ left: tabRect.left - containerLeft, width: tabRect.width });
    }
  }, [active]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative", display: "flex",
        background: GROWW_GRAY50, borderBottom: `1px solid ${GROWW_GRAY150}`,
        padding: "0 16px", borderRadius: "8px 8px 0 0",
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          ref={el => tabRefs.current[tab.id] = el}
          onClick={() => onChange(tab.id)}
          style={{
            padding: "14px 20px 13px", border: "none", background: "transparent",
            cursor: "pointer", fontSize: 14,
            fontWeight: active === tab.id ? 535 : 435,
            fontFamily: "GrowwSans, system-ui, sans-serif",
            color: active === tab.id ? GROWW_ACCENT : GROWW_GRAY700,
            lineHeight: "20px", transition: "color 0.2s",
            position: "relative", whiteSpace: "nowrap", outline: "none",
          }}
        >
          {tab.label}
        </button>
      ))}
      <div style={{
        position: "absolute", bottom: 0, height: 3,
        background: GROWW_ACCENT, borderRadius: "2px 2px 0 0",
        transition: "left 0.2s ease-in-out, width 0.2s ease-in-out",
        left: indicator.left, width: indicator.width,
      }} />
    </div>
  );
}

// ─── Error Banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", background: "#fff5f3",
      borderBottom: `1px solid #fde0d8`,
    }}>
      <span style={{ fontSize: 13, color: GROWW_NEGATIVE, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {message}
      </span>
      <button
        onClick={onRetry}
        style={{
          fontSize: 12, fontWeight: 535, color: GROWW_ACCENT,
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "GrowwSans, system-ui, sans-serif",
          textDecoration: "underline",
        }}
      >
        Retry
      </button>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const { userPic } = useContext(UserPicture);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="border-b border-gray-100 bg-white sticky top-0 z-1000 bg-white/60 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6">
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
                `text-sm font-semibold ${isActive
                  ? "text-gray-800 border-b-2 border-[#00d09c] pb-1"
                  : "text-gray-500 hover:text-gray-700"}`
              }
            >
              {item}
            </NavLink>
          ))}
        </nav>
        <div className="flex-1 max-w-xs ml-auto">
          <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg px-3 h-9 gap-2 focus-within:border-gray-300 focus-within:bg-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
              <path d="M20 20l-3-3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text" placeholder="Search Groww...."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none"
            />
            <span className="text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5 flex-shrink-0">Ctrl+K</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
            {userPic
              ? <img src={userPic} alt="" width={28} height={28} className="rounded-2xl" />
              : <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" width={28} height={28} className="rounded-2xl" />
            }
          </div>
          {showProfile && (
            <div className="absolute right-5 top-12 z-[9999]">
              <ProfileDropdown/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GrowwAllIndices() {
  const [activeTab, setActiveTab] = useState("global");

  // Global indices state
  const [globalData,    setGlobalData]    = useState([]);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [globalError,   setGlobalError]   = useState(null);

  // Indian indices state
  const [indianData,    setIndianData]    = useState([]);
  const [indianLoading, setIndianLoading] = useState(true);
  const [indianError,   setIndianError]   = useState(null);

  // ── fetch helpers ──────────────────────────────────────────────────────────
  const loadGlobal = async () => {
    setGlobalLoading(true);
    setGlobalError(null);
    try {
      const data = await fetchGlobalIndices();
      setGlobalData(data);
    } catch (err) {
      setGlobalError(err.message || "Failed to load global indices");
    } finally {
      setGlobalLoading(false);
    }
  };

  const loadIndian = async () => {
    setIndianLoading(true);
    setIndianError(null);
    try {
      const data = await fetchIndianIndices();
      setIndianData(data);
    } catch (err) {
      setIndianError(err.message || "Failed to load Indian indices");
    } finally {
      setIndianLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadGlobal();
    loadIndian();
  }, []);

  // Auto-refresh every 60 seconds (indices don't need sub-second refresh)
  useEffect(() => {
    const id = setInterval(() => {
      loadGlobal();
      loadIndian();
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  // ── render ─────────────────────────────────────────────────────────────────
  const SKELETON_COUNT = 10;

  return (
    <div>
      <Navbar />
      <div style={{
        minHeight: "100vh", background: "#fff",
        fontFamily: "GrowwSans, NotoSans, system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased", color: GROWW_GRAY900,
      }}>
        <style>{`
          @font-face {
            font-family: GrowwSans;
            font-style: normal;
            font-weight: 300 700;
            src: url(https://resources.groww.in/web-assets/font/GrowwSans-Variable.woff2) format("woff2-variations");
            font-display: swap;
          }
          @font-face {
            font-family: Soehne;
            font-style: normal;
            font-weight: 300 700;
            src: url(https://resources.groww.in/web-assets/font/Soehne.woff2) format("woff2-variations");
            font-display: swap;
          }
          * { box-sizing: border-box; }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
          }
        `}</style>

        <div style={{ maxWidth: 1216, margin: "0 auto", padding: "0 32px" }}>

          {/* Page heading */}
          <h1 style={{
            margin: "24px 0 10px", fontSize: 20, fontWeight: 535,
            fontFamily: "Soehne, GrowwSans, system-ui, sans-serif",
            color: GROWW_GRAY900, lineHeight: "2rem",
          }}>
            All Indices
          </h1>

          {/* World Map */}
          <div style={{ overflow: "hidden" }}>
            <img
              src="https://freesvg.org/img/molumen-world-map-1.png"
              style={{ width: "100%", display: "block", transform: "translateY(-240px)" }}
              alt=""
            />
          </div>

          {/* Data Table */}
          <div style={{
            border: `1px solid ${GROWW_GRAY150}`, borderRadius: 8,
            overflow: "hidden", background: "#fff",
            zIndex: 900, position: "relative", marginTop: -700, marginBottom: 30,
          }}>
            <Tabs active={activeTab} onChange={setActiveTab} />

            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 800 }}>
                <TableHeader />

                {/* ── Global Tab ── */}
                {activeTab === "global" && (
                  <div>
                    {globalError && (
                      <ErrorBanner
                        message={`Could not load global indices: ${globalError}`}
                        onRetry={loadGlobal}
                      />
                    )}
                    {globalLoading
                      ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonRow key={i} />)
                      : globalData.map(item => (
                          <GlobalRow key={item.searchId || item.name} item={item} />
                        ))
                    }
                  </div>
                )}

                {/* ── Indian Tab ── */}
                {activeTab === "indian" && (
                  <div>
                    {indianError && (
                      <ErrorBanner
                        message={`Could not load Indian indices: ${indianError}`}
                        onRetry={loadIndian}
                      />
                    )}
                    {indianLoading
                      ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonRow key={i} />)
                      : indianData.map(item => (
                          <IndianRow key={item.header.searchId} item={item} />
                        ))
                    }
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </div>
  );
}
