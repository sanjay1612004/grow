import { useState, useEffect, useRef, useCallback, useContext } from "react";
import Footer from "../landingpage/Footer"
import { UserPicture } from "../../App";
import { NavLink } from "react-router-dom";
import ProfileDropdown from "../UserModule/ProfileDropdown";


const API_URL = "http://localhost:8000/api/etf-stocks";

function getReturn(stock, key) {
  const r = stock.returns?.find((r) => r.key === key);
  return r ? r.value : null;
}

function Sparkline({ ltp, close }) {
  const isUp = ltp >= close;
  const color = isUp ? "#00b386" : "#e74c3c";
  const pts = [0.6, 0.45, 0.55, 0.4, 0.5, isUp ? 0.3 : 0.65, isUp ? 0.2 : 0.75];
  const w = 80, h = 32;
  const points = pts.map((y, i) => `${(i / (pts.length - 1)) * w},${y * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function ETFLogo({ logoUrl, name }) {
  const [err, setErr] = useState(false);
  const initials = (name || "").split(" ").slice(0, 2).map((w) => w[0] || "").join("").toUpperCase() || "ET";
  if (!logoUrl || err) {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: "#f0f0f0",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700, color: "#666", flexShrink: 0, border: "1px solid #e0e0e0"
      }}>{initials}</div>
    );
  }
  return (
    <img src={logoUrl} alt={name} onError={() => setErr(true)}
      style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain", flexShrink: 0, background: "#fff", border: "1px solid #e8e8e8" }} />
  );
}

const FILTERS = [
  { label: "Nifty 50", key: "nifty50" },
  { label: "Gold", key: "gold" },
  { label: "Silver", key: "silver" },
  { label: "International", key: "international" },
  { label: "Debt", key: "debt" },
];

function matchFilter(stock, key) {
  const name = (stock.companyData?.shortName || "").toLowerCase();
  const code = (stock.nseScriptCode || "").toLowerCase();
  if (key === "gold") return name.includes("gold");
  if (key === "silver") return name.includes("silver");
  if (key === "nifty50") return (
    code === "niftybees" || code === "setfnif50" || code === "niftyietf" ||
    code === "hdfcnifty" || code === "bslnifty" || code === "niftycase" ||
    code === "aonenifty" || code === "growwnifty"
  );
  if (key === "international") return (
    name.includes("nasdaq") || name.includes("hang seng") || name.includes("fang") ||
    name.includes("s&p") || name.includes("global") || name.includes("nyse")
  );
  if (key === "debt") return (
    name.includes("liquid") || name.includes("gilt") || name.includes("bond") ||
    name.includes("debt") || name.includes("1d rate")
  );
  return true;
}

function SortIcon({ active, dir }) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 1, marginLeft: 4, verticalAlign: "middle" }}>
      <span style={{ fontSize: 8, lineHeight: 1, color: active && dir === "asc" ? "#333" : "#bbb" }}>▲</span>
      <span style={{ fontSize: 8, lineHeight: 1, color: active && dir === "desc" ? "#333" : "#bbb" }}>▼</span>
    </span>
  );
}

function Row({ stock }) {
  const [hovered, setHovered] = useState(false);
  const ltp = stock.ltp ?? 0;
  const close = stock.close ?? ltp;
  const change = ltp - close;
  const changePct = close ? (change / close) * 100 : 0;
  const nav = stock.nav ?? 0;
  const navDelta = ltp ? ((nav - ltp) / ltp) * 100 : 0;
  const return1Y = getReturn(stock, "return1Y");
  const isUp = change >= 0;
  const navUp = navDelta >= 0;

  return (
    
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#f7fffe" : "#fff",
        borderBottom: "1px solid #f0f0f0",
        transition: "background 0.1s",
        cursor: "pointer",
      }}
    >
      {/* Company */}
      <td style={{ padding: "14px 16px 14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ETFLogo logoUrl={stock.companyData?.logoUrl} name={stock.companyData?.shortName} />
          <span style={{
            fontSize: 13, fontWeight: 500, color: "#1a1a1a",
            maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }}>
            {stock.companyData?.shortName}
          </span>
        </div>
      </td>

      {/* Sparkline */}
      <td style={{ padding: "14px 12px", width: 96 }}>
        <Sparkline ltp={ltp} close={close} />
      </td>

      {/* Market price */}
      <td style={{ padding: "14px 20px", textAlign: "right", fontSize: 13, fontWeight: 500, color: "#1a1a1a", whiteSpace: "nowrap" }}>
        ₹{ltp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>

      {/* 1D price change */}
      <td style={{ padding: "14px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: isUp ? "#00b386" : "#e74c3c" }}>
          {isUp ? "+" : ""}{change.toFixed(2)} ({isUp ? "+" : ""}{changePct.toFixed(2)}%)
        </span>
      </td>

      {/* NAV / delta from mkt */}
      <td style={{ padding: "14px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>
          ₹{nav.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: 12, color: navUp ? "#00b386" : "#e74c3c", marginTop: 1 }}>
          {navUp ? "+" : ""}{navDelta.toFixed(2)}%
        </div>
      </td>

      {/* Today's volume / hover actions */}
      <td style={{ padding: "14px 20px", textAlign: "right", minWidth: 180 }}>
        {hovered ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
            <button style={{
              background: "none", border: "none", cursor: "pointer", padding: "4px 6px",
              color: "#888", display: "flex", alignItems: "center"
            }} title="Watchlist">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </button>
            <button style={{
              background: "none", border: "1px solid #00b386", borderRadius: 6, padding: "4px 10px",
              fontSize: 12, fontWeight: 600, color: "#00b386", cursor: "pointer", letterSpacing: 0.3
            }}>SIP</button>
            <button style={{
              background: "#00b386", border: "none", borderRadius: 6, padding: "5px 12px",
              fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer"
            }}>B</button>
            <button style={{
              background: "#e74c3c", border: "none", borderRadius: 6, padding: "5px 12px",
              fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer"
            }}>S</button>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: "#1a1a1a" }}>
            {stock.volume ? stock.volume.toLocaleString("en-IN") : "0"}
          </span>
        )}
      </td>

      {/* 1Y returns */}
      <td style={{ padding: "14px 20px 14px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
        {return1Y === null ? (
          <span style={{ fontSize: 13, color: "#aaa" }}>-</span>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 600, color: return1Y >= 0 ? "#00b386" : "#e74c3c" }}>
            {return1Y >= 0 ? "+" : ""}{return1Y.toFixed(2)}%
          </span>
        )}
      </td>
    </tr>
  );
}

export default function GrowwStockScreener() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortCol, setSortCol] = useState("return1Y");
  const [sortDir, setSortDir] = useState("desc");
  const [filterCount, setFilterCount] = useState(0);
  const { userPic } = useContext(UserPicture);
  const [showProfile, setShowProfile] = useState(false);


  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setStocks(json?.data?.screenerList || []);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setFilterCount(activeFilters.length); }, [activeFilters]);

  const toggleFilter = (key) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const clearAll = () => setActiveFilters([]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const filtered = stocks.filter((s) => {
    if (activeFilters.length === 0) return true;
    return activeFilters.some((f) => matchFilter(s, f));
  });

  const sorted = [...filtered].sort((a, b) => {
    let av, bv;
    if (sortCol === "ltp") { av = a.ltp ?? 0; bv = b.ltp ?? 0; }
    else if (sortCol === "change") {
      av = (a.ltp ?? 0) - (a.close ?? a.ltp ?? 0);
      bv = (b.ltp ?? 0) - (b.close ?? b.ltp ?? 0);
    }
    else if (sortCol === "volume") { av = a.volume ?? 0; bv = b.volume ?? 0; }
    else if (sortCol === "return1Y") { av = getReturn(a, "return1Y") ?? -9999; bv = getReturn(b, "return1Y") ?? -9999; }
    else { av = 0; bv = 0; }
    return sortDir === "desc" ? bv - av : av - bv;
  });

  const ColHeader = ({ label, col, align = "right" }) => (
    <th
      onClick={() => col && handleSort(col)}
      style={{
        padding: "12px 20px", textAlign: align, fontSize: 12, fontWeight: 500,
        color: "#666", whiteSpace: "nowrap", cursor: col ? "pointer" : "default",
        userSelect: "none", borderBottom: "1px solid #e8e8e8", background: "#fff"
      }}
    >
      {label}
      {col && <SortIcon active={sortCol === col} dir={sortDir} />}
    </th>
  );

  return (
    <div>
       <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6 sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 w-full">
        <img src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp" alt="Groww" height={30} width={30} />
        <nav className="flex items-center gap-6">
          {["Stocks","Explore","Holdings","Positions","WatchList"].map(item => (
            <NavLink key={item} to={`/user/${item.toLowerCase()}`}
              className={({ isActive }) => `text-[15px] font-semibold ${isActive ? "text-gray-700 border-b-2 border-[#00d09c] pb-1" : "text-gray-500 hover:text-gray-700"}`}>
              {item}
            </NavLink>
          ))}
        </nav>
        <div className="flex-1 max-w-xs ml-auto">
          <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg px-3 h-9 gap-2 focus-within:border-gray-400 focus-within:bg-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2"/><path d="M20 20l-3-3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/></svg>
            <input type="text" placeholder="Search Groww...." className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none"/>
            <span className="text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5">Ctrl+K</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
          <div className="cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
            {userPic
              ? <img src={userPic} alt="" width={28} height={28} className="rounded-full"/>
              : <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" width={28} height={28} className="rounded-full"/>}
          </div>
          {showProfile && (
            <div className="absolute right-5 top-12 z-[9999]">
              <ProfileDropdown/>
            </div>
          )}
        </div>
      </div>
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>ETF Stocks Screener</h1>
          <button
            onClick={fetchData}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#888", display: "flex", alignItems: "center" }}
            title="Refresh"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>

        {/* Filter chips row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          {/* Sliders/filter icon button */}
          <button style={{
            width: 36, height: 36, borderRadius: "50%", border: "1px solid #e0e0e0",
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", position: "relative", flexShrink: 0
          }}>
            <svg width="16" height="16" fill="none" stroke="#555" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 8h12M3 12h8"/>
            </svg>
            {filterCount > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -4, background: "#1a1a1a", color: "#fff",
                borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{filterCount}</span>
            )}
          </button>

          {FILTERS.map((f) => {
            const active = activeFilters.includes(f.key);
            return (
              <button
                key={f.key}
                onClick={() => toggleFilter(f.key)}
                style={{
                  padding: "6px 16px", borderRadius: 20,
                  border: active ? "1.5px solid #1a1a1a" : "1px solid #d0d0d0",
                  background: "#fff", fontSize: 13, fontWeight: active ? 600 : 400,
                  color: "#1a1a1a", cursor: "pointer", transition: "all 0.15s"
                }}
              >
                {f.label}
              </button>
            );
          })}

          <button
            onClick={clearAll}
            style={{
              background: "none", border: "none", fontSize: 13, color: activeFilters.length > 0 ? "#1a1a1a" : "#bbb",
              cursor: activeFilters.length > 0 ? "pointer" : "default", fontWeight: 500,
              textDecoration: activeFilters.length > 0 ? "underline" : "none", padding: "6px 4px"
            }}
          >
            Clear all
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: "#fff8f8", border: "1px solid #ffd0d0", borderRadius: 8,
            padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#c0392b",
            display: "flex", alignItems: "center", gap: 8
          }}>
            <span>⚠ Failed to load: {error}</span>
            <button onClick={fetchData} style={{ marginLeft: "auto", color: "#c0392b", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>Retry</button>
          </div>
        )}

        {/* Table */}
        <div style={{ border: "1px solid #e8e8e8", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fff" }}>
                <th style={{ padding: "12px 16px 12px 20px", textAlign: "left", fontSize: 12, fontWeight: 500, color: "#666", borderBottom: "1px solid #e8e8e8" }}>
                  Company
                </th>
                <th style={{ padding: "12px 12px", width: 96, borderBottom: "1px solid #e8e8e8" }}></th>
                <ColHeader label="Market price" col="ltp" />
                <ColHeader label="1D price change" col="change" />
                <ColHeader label="NAV/delta from mkt" col={null} />
                <ColHeader label="Today's volume" col="volume" />
                <ColHeader label="1Y returns" col="return1Y" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} style={{ padding: "18px 20px" }}>
                        <div style={{
                          height: 14, borderRadius: 6, background: "#f0f0f0",
                          width: j === 0 ? "70%" : j === 1 ? 80 : "60%",
                          animation: "pulse 1.5s ease-in-out infinite"
                        }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sorted.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 14 }}>No ETFs found</td></tr>
              ) : (
                sorted.map((stock) => <Row key={stock.gsin || stock.nseScriptCode} stock={stock} />)
              )}
            </tbody>
          </table>
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
      </div>
      <Footer/>
    </div>
    </div>
  );
}
