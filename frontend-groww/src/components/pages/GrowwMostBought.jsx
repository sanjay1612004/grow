import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../landingpage/Footer";
import { UserPicture } from "../../App";
import ProfileDropdown from "../UserModule/ProfileDropdown";
import GenericOrderTicket from "../UserModule/GenericOrderTicket";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatVolume(n) {
  if (n == null) return "—";
  return Number(Math.round(n)).toLocaleString("en-IN");
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

function formatPrice(n) {
  if (n == null) return "—";
  return "₹" + Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Simulate intra-day sparkline from OHLC stats */
function generateTrendPoints(stats) {
  const { close: prevClose, high, low, ltp } = stats;
  const isUp = ltp >= prevClose;
  const seed = [
    prevClose,
    prevClose + (isUp ? (high - prevClose) * 0.3  : (low - prevClose) * 0.3),
    prevClose + (isUp ? (high - prevClose) * 0.5  : (low - prevClose) * 0.5),
    prevClose + (isUp ? (high - prevClose) * 0.4  : (low - prevClose) * 0.6),
    prevClose + (isUp ? (high - prevClose) * 0.7  : (low - prevClose) * 0.4),
    prevClose + (isUp ? (high - prevClose) * 0.55 : (low - prevClose) * 0.7),
    prevClose + (isUp ? (high - prevClose) * 0.8  : (low - prevClose) * 0.5),
    prevClose + (isUp ? (high - prevClose) * 0.65 : (low - prevClose) * 0.8),
    prevClose + (isUp ? (high - prevClose) * 0.9  : (low - prevClose) * 0.6),
    prevClose + (isUp ? (high - prevClose) * 0.75 : (low - prevClose) * 0.9),
    prevClose + (isUp ? (high - prevClose) * 0.95 : (low - prevClose) * 0.75),
    prevClose + (isUp ? (high - prevClose) * 0.85 : (low - prevClose) * 0.95),
    prevClose + (isUp ? (ltp - prevClose) * 0.95  : (ltp - prevClose) * 0.95),
    ltp,
  ];
  return seed.map((v, i) => [Math.round((i / (seed.length - 1)) * 100), v]);
}

// ─── SparkLine ────────────────────────────────────────────────────────────────

function SparkLine({ points, isPositive }) {
  const w = 120, h = 36;
  const ysRaw = points.map((p) => p[1]);
  const maxY = Math.max(...ysRaw);
  const minY = Math.min(...ysRaw);
  const rangeY = maxY - minY || 1;

  const xs = points.map((p) => (p[0] / 100) * w);
  const ys = points.map((p) => h - ((p[1] - minY) / rangeY) * (h - 4) - 2);
  const d = points
    .map((_, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`)
    .join(" ");
  const color = isPositive ? "#16a34a" : "#dc2626";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <line x1="0" y1={ys[0]} x2={w} y2={ys[0]} stroke="#e5e7eb" strokeWidth="1" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[1fr_140px_160px_100px] items-center border-b border-gray-100 animate-pulse">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
        <div className="h-3.5 w-36 bg-gray-100 rounded" />
      </div>
      <div className="px-4 py-4 flex justify-center">
        <div className="h-5 w-28 bg-gray-100 rounded" />
      </div>
      <div className="px-4 py-4 flex flex-col items-end gap-1.5">
        <div className="h-3.5 w-20 bg-gray-100 rounded" />
        <div className="h-3 w-24 bg-gray-100 rounded" />
      </div>
      <div className="px-5 py-4 flex justify-end">
        <div className="h-3.5 w-16 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Invest CTA sidebar ───────────────────────────────────────────────────────

function InvestCard({ selectedStock }) {
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`https://j9cw5kv2-5000.inc1.devtunnels.ms/api/kyc/me?userId=${userId}`)
        .then((res) => {
          const kycDetails = res.data?.message || res.data?.data || res.data;
          const status = (kycDetails?.kycStatus || kycDetails?.status || "").toString().toUpperCase();
          setKycStatus(status);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  if (kycStatus === "APPROVED") return <GenericOrderTicket stock={selectedStock} />;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center gap-4 sticky top-6">
      <div className="w-44 h-28 relative">
        <img src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/newToStocks.b40891fd.svg" alt="" />
      </div>
      <div>
        <h3 className="text-md font-medium text-gray-900 leading-snug">
          Looking to invest in Stocks?
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Create your demat account on Groww in 2 minutes
        </p>
      </div>
      <button className="w-full bg-[#44c38a] hover:bg-[#38b07a] text-white font-semibold text-sm tracking-widest uppercase py-2.5 rounded-lg transition-colors duration-200">
        UNLOCK STOCKS
      </button>
    </div>
  );
}

// ─── Stock row ────────────────────────────────────────────────────────────────

function StockRow({ item, isLast, onClick, isSelected }) {
  const { company, stats } = item;
  const isPositive = stats.dayChange >= 0;
  const trendPoints = generateTrendPoints(stats);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  

  return (
    <div
      onClick={() => onClick(item)}
      className={`grid grid-cols-[1fr_140px_160px_100px] items-center transition-colors duration-100 hover:bg-gray-50 cursor-pointer ${
        !isLast ? "border-b border-gray-100" : ""
      } ${isSelected ? "bg-gray-50 border-l-4 border-l-[#00b386]" : "border-l-4 border-l-transparent"}`}
    >
      {/* Company */}
      <div className="flex items-center gap-3 px-5 py-4 min-w-0">
        <img
          src={company.imageUrl}
          alt={company.companyShortName}
          className="w-10 h-10 rounded-lg object-contain flex-shrink-0 border border-gray-100"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        {/* Fallback */}
        <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-bold items-center justify-center flex-shrink-0 hidden">
          {company.companyShortName?.slice(0, 2).toUpperCase()}
        </div>
        <span
          className="text-[13.5px] font-medium text-gray-800 leading-snug truncate hover:text-[#00b386] hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/stocks/${company.searchId}`, {
              state: {
                nse: company.nseScriptCode || "",
                bse: company.bseScriptCode || "",
                company: company.companyShortName || company.companyName,
                searchId: company.searchId,
                logo: company.imageUrl,
                name: company.companyName,
              },
            });
          }}
        >
          {company.companyName}
        </span>
      </div>

      {/* Sparkline */}
      <div className="px-2 py-4 flex items-center justify-center">
        <SparkLine points={trendPoints} isPositive={isPositive} />
      </div>

      {/* Price + change */}
      <div className="px-4 py-4 text-right">
        <div className="text-[13.5px] font-medium text-gray-900">
          {formatPrice(stats.ltp)}
        </div>
        <div className={`text-[13px] font-medium mt-0.5 ${isPositive ? "text-green-600" : "text-red-500"}`}>
          {formatChange(stats.dayChange)} ({formatPct(stats.dayChangePerc)})
        </div>
      </div>

      {/* Volume */}
      <div className="px-5 py-4 text-right text-[13px] text-gray-700">
        {formatVolume(stats.high * 1000)}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GrowwMostBought() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const {userPic,setuserPic}=useContext(UserPicture)
    const [showProfile, setShowProfile] = useState(false);
  

  useEffect(() => {
    let cancelled = false;

    const fetchStocks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=POPULAR_STOCKS_MOST_BOUGHT&page=0&size=20",
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          const fetchedStocks = data?.exploreCompanies?.POPULAR_STOCKS_MOST_BOUGHT ?? [];
          setStocks(fetchedStocks);
          if (fetchedStocks.length > 0) setSelectedStock(fetchedStocks[0]);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to fetch stocks");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStocks();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      {/* ── Navbar ── */}
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6 border-b border-gray-200 sticky top-0 z-10 bg-white/60 backdrop-blur-md">
        <img
          src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp"
          alt="Groww"backdrop-blur-md
          height={30}
          width={30}
        />
        <nav className="flex items-center gap-6">
          {["Stocks", "Explore", "Holdings", "Positions", "WatchList"].map((item) => (
            <NavLink
              key={item}
              to={`/user/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `text-md font-semibold ${
                  isActive
                    ? "text-gray-700 border-b-2 border-[#00d09c] pb-1"
                    : "text-gray-600 hover:text-gray-700"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </nav>
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
            <span className="text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5 flex-shrink-0">
              Ctrl+K
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
            {userPic && <img src={userPic} alt="" width={30} height={30} className='rounded-2xl'/>}
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
      <div className="min-h-screen bg-white font-sans">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-600 mb-6">
            Most bought stocks on Groww
          </h1>

          {/* Two-column layout */}
          <div className="flex gap-6 items-start my-7">

            {/* ── Main table card ── */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden">

              {/* Table header */}
              <div className="grid grid-cols-[1fr_140px_160px_100px] border-b border-gray-100">
                <div className="px-5 py-3 text-xs font-medium text-gray-500">
                  Company
                </div>
                <div className="px-4 py-3" />
                <div className="px-4 py-3 text-xs font-medium text-gray-500 text-right">
                  Market Price(1D)
                </div>
                <div className="px-5 py-3 text-xs font-medium text-gray-500 text-right">
                  Volume
                </div>
              </div>

              {/* Loading skeletons */}
              {loading &&
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

              {/* Error state */}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-8">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-red-400">
                    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
                    <path d="M24 14v12M24 32v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-gray-700 font-medium">Failed to load stocks</p>
                  <p className="text-sm text-gray-400">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-5 py-2 bg-[#44c38a] text-white text-sm font-medium rounded-lg hover:bg-[#38b07a] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && stocks.length === 0 && (
                <div className="py-20 text-center text-gray-400 text-sm">
                  No stocks found
                </div>
              )}

              {/* Stock rows */}
              {!loading && !error && stocks.map((item, idx) => (
                <StockRow
                  key={item.company.isin}
                  item={item}
                  isLast={idx === stocks.length - 1}
                  onClick={setSelectedStock}
                  isSelected={selectedStock?.company?.isin === item.company.isin}
                />
              ))}
            </div>

            {/* ── Sidebar ── */}
            <div className="w-102 flex-shrink-0">
              <InvestCard selectedStock={selectedStock} />
            </div>
          </div>

          {/* Footer */}
        </div>
      </div>
                <Footer />

    </div>
  );
}