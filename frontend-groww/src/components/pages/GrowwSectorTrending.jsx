import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import Footer from "../landingpage/Footer";
import { UserPicture } from "../../App";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPct(n) {
  if (n == null) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${Math.abs(n).toFixed(2)}%`;
}

// ─── Gainers/Losers Bar ───────────────────────────────────────────────────────
// Two bars always fill the same fixed total width — split proportionally

function GainersLosersBar({ positive, negative }) {
  const total = positive + negative || 1;
  const greenPct = (positive / total) * 100;
  const redPct   = (negative / total) * 100;
  const BAR_TOTAL_PX = 380;

  return (
    <div className="flex items-center" style={{ width: BAR_TOTAL_PX + 60 }}>
      {/* Left count */}
      <span className="text-xs text-gray-500 w-8 text-right mr-2 flex-shrink-0">{positive}</span>

      {/* Fixed-width bar container — always same total length */}
      <div className="flex h-[5px] rounded-full overflow-hidden" style={{ width: BAR_TOTAL_PX }}>
        <div className="h-full bg-[#16a34a]" style={{ width: `${greenPct}%` }} />
        <div className="h-full bg-[#e05c3a]" style={{ width: `${redPct}%` }} />
      </div>

      {/* Right count */}
      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{negative}</span>
    </div>
  );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center px-6 py-4 border-b border-gray-100 animate-pulse">
      <div className="w-9 h-9 rounded bg-gray-100 flex-shrink-0" />
      <div className="ml-5 w-48 h-3.5 bg-gray-100 rounded flex-shrink-0" />
      <div className="flex-1 mx-8">
        <div className="h-[5px] w-80 bg-gray-100 rounded" />
      </div>
      <div className="w-16 h-4 bg-gray-100 rounded ml-auto flex-shrink-0" />
    </div>
  );
}

// ─── Sector Row ───────────────────────────────────────────────────────────────

function SectorRow({ sector, isLast }) {
  const isPositive = sector.dayChangePercent >= 0;

  return (
    <div
      className={`flex items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-100 cursor-pointer ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      {/* Sector icon */}
      <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
        <img
          src={sector.sectorLogo}
          alt={sector.sectorName}
          className="w-9 h-9 object-contain"
          onError={e => { e.target.style.opacity = 0; }}
        />
      </div>

      {/* Sector name */}
      <div className="ml-5 w-56 flex-shrink-0">
        <span className="text-[13.5px] font-semibold text-gray-800">
          {sector.sectorName}
        </span>
      </div>

      {/* Gainers / Losers bar */}
      <div className="flex-1 flex items-center justify-center">
        <GainersLosersBar
          positive={sector.positiveStocks}
          negative={sector.negativeStocks}
        />
      </div>

      {/* 1D price change */}
      <div className="w-24 text-right flex-shrink-0">
        <span
          className={`text-[13.5px] font-semibold ${
            isPositive ? "text-[#16a34a]" : "text-[#e05c3a]"
          }`}
        >
          {formatPct(sector.dayChangePercent)}
        </span>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
    const {userPic,setuserPic}=useContext(UserPicture)

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6">
        <img
          src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp"
          alt="Groww"
          height={30}
          width={30}
        />
        <nav className="flex items-center gap-6">
          {["Stocks", "Explore", "Holdings", "Positions", "WatchList"].map(item => (
            <NavLink
              key={item}
              to={`/user/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `text-sm font-semibold ${
                  isActive
                    ? "text-gray-800 border-b-2 border-[#00d09c] pb-1"
                    : "text-gray-500 hover:text-gray-700"
                }`
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
              type="text"
              placeholder="Search Groww...."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none"
            />
            <span className="text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5 flex-shrink-0">
              Ctrl+K
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
            {userPic && <img src={userPic} alt="" width={28} height={28} className='rounded-2xl'/>}
            {!userPic && <img src='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'  width={28} height={28} className='rounded-2xl'/>}             
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GrowwSectorTrending() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(null);
  

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(
      "https://groww.in/bff/web/stocks/explore/web-pages/trending_sectors?pageSize=30",
      { headers: { Accept: "application/json" } }
    )
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { if (!cancelled) setSectors(data?.data?.sectors || []); })
      .catch(err => { if (!cancelled) setError(err.message || "Failed to fetch"); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // Max total stocks across all sectors — used to scale bar widths

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Page title */}
        <h1 className="text-[22px] font-bold text-gray-700 mb-6">
          Trending sectors
        </h1>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Table header */}
          <div className="flex items-center px-6 py-3 bg-gray-50 border-b border-gray-200">
            {/* Icon placeholder */}
            <div className="w-9 flex-shrink-0" />

            {/* Sector label */}
            <div className="ml-5 w-56 flex-shrink-0 text-xs font-medium text-gray-400 uppercase tracking-wide">
              Sector
            </div>

            {/* Gainers/Losers label — centered */}
            <div className="flex-1 flex items-center justify-center text-xs font-medium text-gray-400 uppercase tracking-wide">
              Gainers/Losers (1D)
            </div>

            {/* 1D price change — with sort arrow matching screenshot */}
            <div className="w-24 text-right flex-shrink-0 flex items-center justify-end gap-1">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                1D price change
              </span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400 flex-shrink-0">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Loading skeletons */}
          {loading &&
            Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-8">
              <svg width="44" height="44" viewBox="0 0 48 48" fill="none" className="text-red-400">
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
                <path d="M24 14v12M24 32v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <p className="text-gray-700 font-medium text-sm">Failed to load sectors</p>
              <p className="text-xs text-gray-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-1 px-4 py-1.5 bg-[#44c38a] text-white text-sm font-medium rounded-lg hover:bg-[#38b07a] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && sectors.length === 0 && (
            <div className="py-20 text-center text-gray-400 text-sm">No sectors found</div>
          )}

          {/* Sector rows */}
          {!loading && !error && sectors.map((sector, idx) => (
            <SectorRow
              key={sector.industryCode}
              sector={sector}
              isLast={idx === sectors.length - 1}
            />
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}