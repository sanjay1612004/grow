import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserPicture } from "../../App";

// ── Spark-line mini chart ────────────────────────────────────────────────────
function SparkLine({ points, color }) {
  const w = 90, h = 40;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const ys = points.map((v) => h - ((v - min) / range) * (h - 6) - 3);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const baseY = ys[0];
  return (
    <svg width={w} height={h} className="block">
      <line x1={0} y1={baseY} x2={w} y2={baseY} stroke="#ccc" strokeWidth={1} strokeDasharray="3,3" />
      <path d={d} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── 52-week range bar ────────────────────────────────────────────────────────
function WeekRange52({ position }) {
  const pct = Math.min(Math.max(position, 0), 1) * 100;
  return (
    <div className="flex items-center gap-1 min-w-[120px]">
      <span className="text-[11px] text-gray-400">L</span>
      <div className="flex-1 h-[3px] bg-gray-200 rounded-sm relative">
        <div
          className="absolute w-2 h-2 bg-gray-800 rounded-full -translate-x-1/2"
          style={{ top: -2.5, left: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-gray-400">H</span>
    </div>
  );
}

// ── Sample stock data ────────────────────────────────────────────────────────
function generatePoints(trend, n = 30) {
  let v = 100 + Math.random() * 20;
  return Array.from({ length: n }, () => {
    v += (Math.random() - (trend === "up" ? 0.35 : 0.65)) * 3;
    return Math.max(v, 10);
  });
}

const STOCKS = [
  { id: 1, name: "Netweb Technolog...", logo: "N", logoColor: "#1a73e8", logoBg: "#e8f0fe", price: "₹4,670.70", change: "+598.70", changePct: "14.70%", positive: true, volume: "1,06,23,544", volDiff: "+1,011.85%", volDiffPos: true, w52pos: 0.82, trend: "up" },
  { id: 2, name: "Adani Total Gas", logo: "adani", logoColor: "#f60", logoBg: "#fff3e0", price: "₹773.30", change: "-35.25", changePct: "4.36%", positive: false, volume: "4,47,79,830", volDiff: "+87.48%", volDiffPos: true, w52pos: 0.35, trend: "down" },
  { id: 3, name: "MTAR Technologies", logo: "MTR", logoColor: "#555", logoBg: "#f5f5f5", price: "₹7,879.50", change: "-10.00", changePct: "0.13%", positive: false, volume: "15,28,301", volDiff: "-30.34%", volDiffPos: false, w52pos: 0.58, trend: "down" },
  { id: 4, name: "Apollo Micro Syste...", logo: "AMS", logoColor: "#0057a8", logoBg: "#e3f0fb", price: "₹409.00", change: "-8.85", changePct: "2.12%", positive: false, volume: "1,90,00,777", volDiff: "-66.43%", volDiffPos: false, w52pos: 0.22, trend: "down" },
  { id: 5, name: "HFCL", logo: "HF", logoColor: "#fff", logoBg: "#1565c0", price: "₹179.94", change: "+6.02", changePct: "3.46%", positive: true, volume: "11,11,12,652", volDiff: "+45.68%", volDiffPos: true, w52pos: 0.65, trend: "up" },
  { id: 6, name: "KCP", logo: "kcp", logoColor: "#e65100", logoBg: "#fff8e1", price: "₹164.53", change: "+2.83", changePct: "1.75%", positive: true, volume: "7,63,591", volDiff: "+569.40%", volDiffPos: true, w52pos: 0.48, trend: "up" },
  { id: 7, name: "Swelect Energy Sy...", logo: "SE", logoColor: "#388e3c", logoBg: "#e8f5e9", price: "₹661.35", change: "+11.05", changePct: "1.70%", positive: true, volume: "94,525", volDiff: "+110.64%", volDiffPos: true, w52pos: 0.55, trend: "up" },
];

const SPARKLINES = Object.fromEntries(STOCKS.map((s) => [s.id, generatePoints(s.trend)]));

// ── Filter chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1 px-3 py-1.5 rounded-full border text-[13px] cursor-pointer whitespace-nowrap transition-all duration-150 font-[inherit]
        ${active
          ? "border-[#00b386] bg-[#e6f7f2] text-[#00b386]"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
        }`}
    >
      {label}
    </button>
  );
}

// ── Left filter panel ────────────────────────────────────────────────────────
const FILTER_SECTIONS = ["Sort by", "Price change >1%", "52W Performance", "RSI", "MACD", "Near breakout", "Index", "Sector", "Market Cap"];
const INDEX_OPTIONS = ["All", "Nifty 50", "Nifty 100", "Nifty 500", "Nifty midcap 100", "Nifty midcap 150", "Nifty smallcap 100", "Nifty smallcap 250", "Nifty total market"];

function FilterPanel({ onClose }) {
  const [activeSection, setActiveSection] = useState("Index");
  const [selectedIndex, setSelectedIndex] = useState("All");

  return (
    <div className="fixed inset-0 z-[100] flex items-start">
      {/* overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/25" />
      {/* panel */}
      <div className="relative flex w-[470px] h-screen bg-white shadow-[4px_0_24px_rgba(0,0,0,0.12)] z-10">
        {/* left nav */}
        <div className="w-40 border-r border-gray-100 pt-4">
          {FILTER_SECTIONS.map((s) => (
            <div
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-4 py-3 text-[13px] cursor-pointer transition-all duration-150
                ${activeSection === s
                  ? "text-[#00b386] font-semibold border-l-[3px] border-[#00b386] bg-[#f0fbf7]"
                  : "text-gray-700 font-normal border-l-[3px] border-transparent hover:bg-gray-50"
                }`}
            >
              {s}
            </div>
          ))}
        </div>
        {/* right content */}
        <div className="flex-1 py-4 overflow-y-auto">
          {activeSection === "Index"
            ? INDEX_OPTIONS.map((opt) => (
              <div
                key={opt}
                onClick={() => setSelectedIndex(opt)}
                className="flex items-center gap-2.5 px-5 py-3 cursor-pointer text-sm text-gray-700 hover:bg-gray-50"
              >
                <div
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: `2px solid ${selectedIndex === opt ? "#00b386" : "#bbb"}` }}
                >
                  {selectedIndex === opt && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00b386]" />
                  )}
                </div>
                {opt}
              </div>
            ))
            : (
              <div className="p-5 text-sm text-gray-400">
                Configure {activeSection} filters here.
              </div>
            )
          }
        </div>
        {/* footer */}
        <div className="absolute bottom-0 left-0 right-0 flex border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-white border-none text-sm cursor-pointer text-gray-400 font-[inherit] hover:bg-gray-50 transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-gray-100 border-none text-sm cursor-pointer text-gray-700 font-[inherit] font-semibold hover:bg-gray-200 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ dir }) {
  if (dir === "asc") return <span className="text-[10px]"> ↑</span>;
  if (dir === "desc") return <span className="text-[10px]"> ↓</span>;
  return <span className="text-[10px] opacity-50"> ⇅</span>;
}

// ── Action buttons on hover ──────────────────────────────────────────────────
function ActionButtons() {
  return (
    <div className="flex gap-1.5 items-center">
      <button className="w-8 h-8 rounded-md border border-gray-200 bg-white cursor-pointer flex items-center justify-center text-sm hover:bg-gray-50 transition-colors">
        ⚖
      </button>
      <button className="w-8 h-8 rounded-md border border-gray-200 bg-white cursor-pointer flex items-center justify-center text-sm hover:bg-gray-50 transition-colors">
        🔖
      </button>
      <button className="px-3.5 py-1.5 rounded-md border-none bg-[#00b386] text-white font-bold text-[13px] cursor-pointer font-[inherit] hover:bg-[#00a077] transition-colors">
        B
      </button>
      <button className="px-3.5 py-1.5 rounded-md border-none bg-[#e05d5d] text-white font-bold text-[13px] cursor-pointer font-[inherit] hover:bg-[#cc4d4d] transition-colors">
        S
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function GrowwStockScreener() {
  const [showPanel, setShowPanel] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [clearTooltip, setClearTooltip] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [activeFilters, setActiveFilters] = useState(["Price change >1%", "52W Performance", "RSI", "MACD"]);
 const {userPic,setuserPic}=useContext(UserPicture)

  function handleSort(col) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  }

  function handleRefresh() {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  }

  const displayStocks = [...STOCKS].sort((a, b) => {
    if (!sortCol) return 0;
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortCol === "price") return mul * (parseFloat(a.price.replace(/[₹,]/g, "")) - parseFloat(b.price.replace(/[₹,]/g, "")));
    if (sortCol === "change") return mul * (parseFloat(a.change) - parseFloat(b.change));
    if (sortCol === "volume") return mul * (parseFloat(a.volume.replace(/,/g, "")) - parseFloat(b.volume.replace(/,/g, "")));
    return 0;
  });

  return (
    <div className="font-[Nunito_Sans,Segoe_UI,sans-serif]">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6">
        <img
          src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp"
          alt="Groww"
          height={30}
          width={30}
        />
        <nav className="flex items-center gap-6">
          {["Stocks", "Explore", "Holdings", "Positions", "WatchList"].map((item) => (
            <NavLink
              key={item}
              to={`/user/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `text-[15px] font-semibold ${isActive
                  ? "text-gray-700 border-b-2 border-[#00d09c] pb-1"
                  : "text-gray-500 hover:text-gray-700"
                }`
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
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
                      {userPic && <img src={userPic} alt="" width={28} height={28} className='rounded-2xl'/>}
            {!userPic && <img src='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'  width={28} height={28} className='rounded-2xl'/>}             

        </div>
      </div>

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <div className="bg-white min-h-screen px-8 py-7 max-w-[1280px] mx-auto">

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-5">
          <h1 className="text-[24px] font-bold text-gray-700 m-0">Intraday Stocks Screener</h1>
          <button
            onClick={handleRefresh}
            title="Refresh"
            className={`bg-transparent border-none cursor-pointer text-base text-gray-600 p-1 flex items-center hover:text-gray-900 transition-colors
              ${spinning ? "animate-spin" : ""}`}
          >
            ↺
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2 items-center mb-6 flex-wrap">

          {/* Settings button */}
          <button
            onClick={() => setShowPanel(true)}
            className="relative w-9 h-9 rounded-full border border-gray-300 bg-white cursor-pointer flex items-center justify-center text-base hover:border-gray-400 transition-colors"
          >
            ⚙
            {activeFilters.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>

          <FilterChip label="Nifty 50" active onClick={() => setShowPanel(true)} />
          <FilterChip label="Gold" onClick={() => setShowPanel(true)} />
          <FilterChip label="Silver" onClick={() => setShowPanel(true)} />
          <FilterChip label="International" onClick={() => setShowPanel(true)} />
          <FilterChip label="Dept" onClick={() => setShowPanel(true)} />


          {/* Clear all with tooltip */}
          <div className="relative">
            <button
              onMouseEnter={() => setClearTooltip(true)}
              onMouseLeave={() => setClearTooltip(false)}
              onClick={() => setActiveFilters([])}
              className={`bg-transparent border-none text-[13px] text-gray-400 cursor-pointer px-1 py-1.5 font-[inherit]
                ${activeFilters.length > 0 ? "underline decoration-dashed" : ""}`}
            >
              Clear all
            </button>
            {clearTooltip && (
              <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap z-50 pointer-events-none">
                Clear all will remove all the applied filters
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Header */}
          <div className="grid px-6 py-3 bg-gray-50 border-b border-gray-100 text-[13px]"
            style={{ gridTemplateColumns: "260px 100px 1fr 180px 160px 160px 160px" }}
          >
            <div className="text-gray-500 font-medium">Company</div>
            <div />
            <div
              className={`cursor-pointer select-none font-medium ${sortCol === "price" ? "text-gray-900 font-semibold" : "text-gray-500"}`}
              onClick={() => handleSort("price")}
            >
              Market price <SortIcon dir={sortCol === "price" ? sortDir : null} />
            </div>
            <div
              className={`cursor-pointer select-none font-medium ${sortCol === "change" ? "text-gray-900 font-semibold" : "text-gray-500"}`}
              onClick={() => handleSort("change")}
            >
              1D price change <SortIcon dir={sortCol === "change" ? sortDir : null} />
            </div>
            <div
              className={`cursor-pointer select-none font-medium ${sortCol === "volume" ? "text-gray-900 font-semibold" : "text-gray-500"}`}
              onClick={() => handleSort("volume")}
            >
              1D volume <SortIcon dir={sortCol === "volume" ? sortDir : null} />
            </div>
            <div className="text-gray-500 font-medium">1W avg vol diff</div>
            <div className="text-gray-500 font-medium">52W performance</div>
          </div>

          {/* Rows */}
          {displayStocks.map((stock) => {
            const isHovered = hoveredRow === stock.id;
            const sparkColor = stock.positive ? "#00b386" : "#e05d5d";

            return (
              <div
                key={stock.id}
                onMouseEnter={() => setHoveredRow(stock.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`grid px-6 py-4 border-b border-gray-50 items-center cursor-pointer transition-colors duration-100
                  ${isHovered ? "bg-[#fafff9]" : "bg-white"}`}
                style={{ gridTemplateColumns: "260px 100px 1fr 180px 160px 160px 160px" }}
              >
                {/* Company */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100 overflow-hidden font-bold"
                    style={{
                      background: stock.logoBg,
                      color: stock.logoColor,
                      fontSize: stock.logo.length > 2 ? 8 : 13,
                    }}
                  >
                    {stock.logo}
                  </div>
                  <span className="font-semibold text-sm text-gray-900">{stock.name}</span>
                </div>

                {/* Sparkline */}
                <div>
                  <SparkLine points={SPARKLINES[stock.id]} color={sparkColor} />
                </div>

                {/* Market price */}
                <div className="text-sm font-semibold text-gray-900">{stock.price}</div>

                {/* 1D price change */}
                <div className={`text-sm font-semibold ${stock.positive ? "text-[#00b386]" : "text-[#e05d5d]"}`}>
                  {stock.positive ? "+" : ""}{stock.change} ({stock.changePct})
                </div>

                {/* 1D volume / action buttons */}
                <div className="text-sm text-gray-700">
                  {isHovered ? <ActionButtons /> : stock.volume}
                </div>

                {/* 1W avg vol diff */}
                <div className={`text-sm font-semibold ${stock.volDiffPos ? "text-[#00b386]" : "text-[#e05d5d]"}`}>
                  {stock.volDiff}
                </div>

                {/* 52W performance */}
                <div>
                  <WeekRange52 position={stock.w52pos} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter panel */}
      {showPanel && <FilterPanel onClose={() => setShowPanel(false)} />}
    </div>
  );
}