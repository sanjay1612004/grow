import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import Footer from "../landingpage/Footer";
import { UserPicture } from "../../App";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n) {
  if (n == null) return "—";
  return "₹" + Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatChange(n) {
  if (n == null) return "—";
  const abs = Math.abs(n).toFixed(2);
  return n >= 0 ? `+${abs}` : `-${abs}`;
}

function formatPct(n) {
  if (n == null) return "—";
  return `${Math.abs(n).toFixed(2)}%`;
}

function formatMinInvestment(n) {
  if (!n) return "—";
  return "₹" + Number(n).toLocaleString("en-IN");
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function generateTrendPoints(ltp, close) {
  const isUp = ltp >= close;
  const high = isUp ? ltp * 1.005 : close;
  const low  = isUp ? close       : ltp * 0.995;
  const seed = [
    close,
    close + (isUp ? (high - close) * 0.25 : (low - close) * 0.25),
    close + (isUp ? (high - close) * 0.45 : (low - close) * 0.55),
    close + (isUp ? (high - close) * 0.35 : (low - close) * 0.65),
    close + (isUp ? (high - close) * 0.6  : (low - close) * 0.45),
    close + (isUp ? (high - close) * 0.5  : (low - close) * 0.72),
    close + (isUp ? (high - close) * 0.75 : (low - close) * 0.55),
    close + (isUp ? (high - close) * 0.62 : (low - close) * 0.82),
    close + (isUp ? (high - close) * 0.85 : (low - close) * 0.62),
    close + (isUp ? (high - close) * 0.72 : (low - close) * 0.88),
    close + (isUp ? (high - close) * 0.92 : (low - close) * 0.72),
    close + (isUp ? (high - close) * 0.82 : (low - close) * 0.93),
    close + (isUp ? (ltp - close) * 0.95  : (ltp - close) * 0.95),
    ltp,
  ];
  return seed.map((v, i) => [Math.round((i / (seed.length - 1)) * 100), v]);
}

function SparkLine({ ltp, close }) {
  const isPositive = ltp >= close;
  const points = generateTrendPoints(ltp, close);
  const w = 160, h = 42;
  const ysRaw = points.map(p => p[1]);
  const maxY = Math.max(...ysRaw);
  const minY = Math.min(...ysRaw);
  const rangeY = maxY - minY || 1;
  const xs = points.map(p => (p[0] / 100) * w);
  const ys = points.map(p => h - ((p[1] - minY) / rangeY) * (h - 6) - 3);
  const d = points.map((_, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const baselineY = h - ((close - minY) / rangeY) * (h - 6) - 3;
  const color = isPositive ? "#16a34a" : "#e05c3a";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <line x1="0" y1={baselineY} x2={w} y2={baselineY} stroke="#e5e7eb" strokeWidth="1" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center px-6 py-4 border-b border-gray-100 animate-pulse">
      <div className="flex-1 h-3.5 w-52 bg-gray-100 rounded" />
      <div className="mx-6 h-6 w-40 bg-gray-100 rounded flex-shrink-0" />
      <div className="text-right w-32 flex-shrink-0">
        <div className="h-3.5 w-20 bg-gray-100 rounded ml-auto mb-1.5" />
        <div className="h-3 w-24 bg-gray-100 rounded ml-auto" />
      </div>
    </div>
  );
}

// ─── NFO Row ─────────────────────────────────────────────────────────────────

function NfoRow({ item, isLast }) {
  const { company, companyMetaContent, companyAttributes } = item;
  const status = companyMetaContent?.metaContent?.status;
  const desc   = companyMetaContent?.metaContent?.description;
  const endDate = formatDate(companyAttributes?.endDate);
  const minAmt  = formatMinInvestment(companyAttributes?.minInvestmentAmount);

  return (
    <div
      className={`flex items-center px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      {/* ETF Name + badges */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="text-[13.5px] font-medium text-gray-800 leading-snug truncate">
          {company.companyName}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          {desc?.value && (
            <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {desc.value}
            </span>
          )}
          {status?.value && (
            <span className="text-[11px] font-semibold text-[#00b386] bg-[#e6f9f3] px-2 py-0.5 rounded">
              {status.value}
            </span>
          )}
        </div>
        {endDate && (
          <div className="text-[11px] text-gray-400 mt-1">Closes {endDate} · Min {minAmt}</div>
        )}
      </div>

      {/* No sparkline for NFO — show invest CTA hint */}
      <div className="mx-6 flex-shrink-0 w-40 flex items-center justify-center">
        <button className="px-4 py-1.5 rounded-lg border border-[#00b386] text-[#00b386] text-xs font-semibold hover:bg-[#e6f9f3] transition-colors">
          Invest Now
        </button>
      </div>

      {/* Min investment */}
      <div className="w-32 text-right flex-shrink-0">
        <div className="text-[13.5px] font-medium text-gray-900">
          Min {minAmt}
        </div>
      </div>
    </div>
  );
}

// ─── ETF Row ──────────────────────────────────────────────────────────────────

function EtfRow({ item, isLast }) {
  const { company, stats } = item;
  if (!stats) return null;

  const isPositive = stats.dayChange >= 0;

  return (
    <div
      className={`flex items-center px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      {/* ETF name */}
      <div className="flex-1 min-w-0 pr-4">
        <span className="text-[13.5px] font-medium text-gray-800 leading-snug">
          {company.companyName}
        </span>
      </div>

      {/* Sparkline */}
      <div className="mx-6 flex-shrink-0">
        <SparkLine ltp={stats.ltp} close={stats.close} />
      </div>

      {/* Market price */}
      <div className="w-32 text-right flex-shrink-0">
        <div className="text-[13.5px] font-semibold text-gray-900">
          {formatPrice(stats.ltp)}
        </div>
        <div className={`text-[12.5px] font-medium mt-0.5 ${isPositive ? "text-green-600" : "text-[#e05c3a]"}`}>
          {formatChange(stats.dayChange)} ({formatPct(stats.dayChangePerc)})
        </div>
      </div>
    </div>
  );
}

// ─── Invest Sidebar ───────────────────────────────────────────────────────────

function InvestCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col items-center text-center gap-4 sticky top-6">
      <div className="w-48 h-32">

        <img src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/newToStocks.b40891fd.svg" alt="" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 leading-snug">
          Looking to invest in Stocks?
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Create your demat account on Groww in 2 minutes
        </p>
      </div>
      <button className="w-full bg-[#44c38a] hover:bg-[#38b07a] text-white font-semibold text-sm tracking-widest uppercase py-3 rounded-lg transition-colors duration-200">
        UNLOCK STOCKS
      </button>
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
            <input type="text" placeholder="Search Groww...."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none" />
            <span className="text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5 flex-shrink-0">Ctrl+K</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
{userPic && <img src={userPic} alt="" width={28} height={28} className='rounded-2xl'/>}
            {!userPic && <img src='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'  width={28} height={28} className='rounded-2xl'/>}        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GrowwETfs() {
  const [etfs,    setEtfs   ] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(
      "https://groww.in/v1/api/stocks_data/v2/explore/list/top/advance?discoveryAdvanceFilterTypes=ETF_NFO&page=0&size=24",
      { headers: { Accept: "application/json" } }
    )
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { if (!cancelled) setEtfs(data?.exploreCompanies?.ETF_NFO ?? []); })
      .catch(err => { if (!cancelled) setError(err.message || "Failed to fetch"); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // Separate NFOs (no stats) from listed ETFs (have stats)
  const nfos  = etfs.filter(e => !e.stats);
  const listed = etfs.filter(e =>  e.stats);
  const allRows = [...nfos, ...listed];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <div className="max-w-6xl mx-6 py-8">
        {/* Page title */}
        <h1 className="text-[26px] font-bold text-gray-700 mb-6">
          ETFs By Groww
        </h1>

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">

          {/* ── Main table ── */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">

            {/* Table header */}
            <div className="flex items-center px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                ETF
              </div>
              {/* Spacer for sparkline column */}
              <div className="mx-6 w-40 flex-shrink-0" />
              <div className="w-32 text-right text-xs font-medium text-gray-400 uppercase tracking-wide flex-shrink-0">
                Market Price
              </div>
            </div>

            {/* Loading skeletons */}
            {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-8">
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none" className="text-red-400">
                  <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
                  <path d="M24 14v12M24 32v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <p className="text-gray-700 font-medium text-sm">Failed to load ETFs</p>
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
            {!loading && !error && allRows.length === 0 && (
              <div className="py-20 text-center text-gray-400 text-sm">No ETFs found</div>
            )}

            {/* Rows — NFOs first, then listed ETFs */}
            {!loading && !error && allRows.map((item, idx) => {
              const isNfo  = !item.stats;
              const isLast = idx === allRows.length - 1;
              return isNfo
                ? <NfoRow  key={item.company.growwContractId} item={item} isLast={isLast} />
                : <EtfRow  key={item.company.growwContractId} item={item} isLast={isLast} />;
            })}
          </div>

          {/* ── Sidebar ── */}
          <div className="w-64 flex-shrink-0">
            <InvestCard />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}