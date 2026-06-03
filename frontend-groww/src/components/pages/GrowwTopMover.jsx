import React, { useEffect, useState, useRef, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Footer from '../landingpage/Footer';
import { UserPicture } from '../../App';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n) {
  if (n == null) return '—';
  return '₹' + Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatVolume(n) {
  if (n == null || n === 0) return '—';
  return Number(Math.round(n)).toLocaleString('en-IN');
}

function formatChange(n) {
  if (n == null) return '—';
  const abs = Math.abs(n).toFixed(2);
  return n >= 0 ? `+${abs}` : `-${abs}`;
}

function formatPct(n) {
  if (n == null) return '—';
  return `${Math.abs(n).toFixed(2)}%`;
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function generateTrendPoints(ltp, close, yearHigh, yearLow) {
  const isUp = ltp >= close;
  const high = isUp ? Math.max(ltp, close * 1.01) : close;
  const low  = isUp ? close : Math.min(ltp, close * 0.99);
  const seed = [
    close,
    close + (isUp ? (high - close) * 0.3  : (low - close) * 0.3),
    close + (isUp ? (high - close) * 0.5  : (low - close) * 0.5),
    close + (isUp ? (high - close) * 0.4  : (low - close) * 0.6),
    close + (isUp ? (high - close) * 0.7  : (low - close) * 0.4),
    close + (isUp ? (high - close) * 0.55 : (low - close) * 0.7),
    close + (isUp ? (high - close) * 0.8  : (low - close) * 0.5),
    close + (isUp ? (high - close) * 0.65 : (low - close) * 0.8),
    close + (isUp ? (high - close) * 0.9  : (low - close) * 0.6),
    close + (isUp ? (high - close) * 0.75 : (low - close) * 0.9),
    close + (isUp ? (high - close) * 0.95 : (low - close) * 0.75),
    close + (isUp ? (high - close) * 0.85 : (low - close) * 0.95),
    close + (isUp ? (ltp - close) * 0.95  : (ltp - close) * 0.95),
    ltp,
  ];
  return seed.map((v, i) => [Math.round((i / (seed.length - 1)) * 100), v]);
}

function SparkLine({ ltp, close, yearHigh, yearLow }) {
  const isPositive = ltp >= close;
  const points = generateTrendPoints(ltp, close, yearHigh, yearLow);
  const w = 140, h = 40;
  const ysRaw = points.map(p => p[1]);
  const maxY = Math.max(...ysRaw);
  const minY = Math.min(...ysRaw);
  const rangeY = maxY - minY || 1;
  const xs = points.map(p => (p[0] / 100) * w);
  const ys = points.map(p => h - ((p[1] - minY) / rangeY) * (h - 6) - 3);
  const d = points.map((_, i) => `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const color = isPositive ? '#16a34a' : '#dc2626';
  const baselineY = h - ((close - minY) / rangeY) * (h - 6) - 3;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <line x1="0" y1={baselineY} x2={w} y2={baselineY} stroke="#e5e7eb" strokeWidth="1" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center px-4 py-3.5 border-b border-gray-100 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
      <div className="ml-3 flex-1">
        <div className="h-3.5 w-44 bg-gray-100 rounded" />
      </div>
      <div className="w-36 mx-4">
        <div className="h-6 bg-gray-100 rounded" />
      </div>
      <div className="w-32 text-right">
        <div className="h-3.5 w-24 bg-gray-100 rounded ml-auto mb-1.5" />
        <div className="h-3 w-20 bg-gray-100 rounded ml-auto" />
      </div>
      <div className="w-28 text-right ml-4">
        <div className="h-3.5 w-20 bg-gray-100 rounded ml-auto" />
      </div>
    </div>
  );
}

// ─── Stock Row ────────────────────────────────────────────────────────────────

function StockRow({ stock, activeFilter, isLast }) {
  const ltp   = stock.ltp   || 0;
  const close = stock.close || 0;
  const dayChange = ltp - close;
  const dayChangePct = close ? (dayChange / close) * 100 : 0;
  const isUp = dayChange >= 0;

  const tag = stock.tag || '';
  const showVolumeWeekly = activeFilter === 'Volume shockers';
  const show52W          = activeFilter === '52W high' || activeFilter === '52W low';

  return (
    <div className={`flex items-center px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${!isLast ? 'border-b border-gray-100' : ''}`}>
      {/* Logo */}
      <div className="flex-shrink-0 w-10 h-10">
        <img
          src={stock.logoUrl}
          alt={stock.companyShortName}
          className="w-10 h-10 rounded-lg object-contain border border-gray-100"
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
        />
        <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-bold items-center justify-center hidden">
          {(stock.companyShortName||'').slice(0,2).toUpperCase()}
        </div>
      </div>

      {/* Company name + tag */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="text-[13.5px] font-medium text-gray-800 truncate">
          {stock.companyName}
        </div>
        {tag && (
          <div className="text-[11.5px] text-[#00b386] font-medium mt-0.5">{tag}</div>
        )}
      </div>

      {/* Sparkline */}
      <div className="flex-shrink-0 mx-4">
        <SparkLine ltp={ltp} close={close} yearHigh={stock.yearHigh} yearLow={stock.yearLow} />
      </div>

      {/* Market price */}
      <div className="w-36 text-right flex-shrink-0">
        <div className="text-[13.5px] font-medium text-gray-900">{formatPrice(ltp)}</div>
        <div className={`text-[13px] font-medium mt-0.5 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
          {formatChange(dayChange)} ({formatPct(dayChangePct)})
        </div>
      </div>

      {/* Right column: Volume / Vol weekly / 52W */}
      <div className="w-28 text-right ml-4 flex-shrink-0">
        {show52W ? (
          <>
            <div className="text-[13px] text-gray-700">{formatPrice(stock.yearHigh)}</div>
            <div className="text-[13px] text-gray-500 mt-0.5">{formatPrice(stock.yearLow)}</div>
          </>
        ) : (
          <div className="text-[13px] text-gray-700">
            {formatVolume(stock.volumeWeekAvg || stock.volume || 0)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar InvestCard ───────────────────────────────────────────────────────

function InvestCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col items-center text-center gap-4 sticky top-6">
      {/* Illustration — people at a store */}
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

// ─── Index Dropdown ───────────────────────────────────────────────────────────

const INDEX_OPTIONS = ['NIFTY 100', 'NIFTY 500', 'NIFTY Midcap 100', 'NIFTY Smallcap 100',"Nifty Total Market"];
const INDEX_API_MAP = {
  'NIFTY 100': 'GIDXNIFTY100',
  'NIFTY 500': 'GIDXNIFTY500',
  'NIFTY Midcap 100':'GIDXNIFMDCP100',
  'NIFTY Smallcap 100':'GIDXNIFSMCP100',
  'Nifty Total Market':'GIDXNIFTYTOTALMCAP'
};

const ROUTE_MAP = {
  "Top gainers": "top-gainers",
  "Top losers": "top-losers",
  "Volume shockers": "volume-shockers",
  "Top by volume": "top-by-volume",
  "52W high": "52w-high",
  "52W low": "52w-low",
};

function IndexDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:border-gray-400 flex items-center gap-1.5 transition-colors"
      >
        {value}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[140px] py-1">
          {INDEX_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${opt === value ? 'text-[#00b386] font-semibold' : 'text-gray-700'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTERS = [
  { label: 'Top gainers',      moverType: 'TOP_GAINERS',       title: 'Top gainers today',             rightCol: 'Volume' },
  { label: 'Top losers',       moverType: 'TOP_LOSERS',        title: 'Top losers today',              rightCol: 'Volume' },
  { label: 'Volume shockers',  moverType: 'VOLUME_SHOCKERS',   title: 'Volume shockers today',         rightCol: 'Vol weekly change (1D)' },
  { label: 'Top by volume',    moverType: 'TRADED_BY_VOLUME',     title: 'Top by volume stocks today',    rightCol: 'Volume' },
  { label: '52W high',         moverType: 'YEARLY_HIGH',         title: 'Stocks at 52 week high',        rightCol: '52W High / 52W Low' },
  { label: '52W low',          moverType: 'YEARLY_LOW',          title: 'Stocks at 52 week low',         rightCol: '52W High / 52W Low' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GrowwTopMover() {
  const [activeFilter, setActiveFilter] = useState('Top gainers');
  const [selectedIndex, setSelectedIndex] = useState('NIFTY 100');
  const [stocks, setStocks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
 const {userPic,setuserPic}=useContext(UserPicture)
 const navigate=useNavigate()

  const currentFilter = FILTERS.find(f => f.label === activeFilter) || FILTERS[0];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setStocks([]);

    const indice   = INDEX_API_MAP[selectedIndex] || 'GIDXNIFTY100';
    const moverType = currentFilter.moverType;

    fetch(
      `https://groww.in/bff/web/stocks/explore/web-pages/top_movers?indice=${indice}&moverType=${moverType}&pageSize=15`,
      { headers: { Accept: 'application/json' } }
    )
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { if (!cancelled) setStocks(data?.data?.stocks || []); })
      .catch(err => { if (!cancelled) setError(err.message || 'Failed to fetch'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [activeFilter, selectedIndex]);

  const show52W = activeFilter === '52W high' || activeFilter === '52W low';

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ── Navbar ── */}
      <div className="border-b border-gray-100 sticky top-0 z-10 bg-white/60 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6">
          <img
            src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp"
            alt="Groww" height={30} width={30}
          />
          <nav className="flex items-center gap-6">
            {['Stocks', 'Explore', 'Holdings', 'Positions', 'WatchList'].map(item => (
              <NavLink
                key={item}
                to={`/user/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-sm font-semibold ${isActive
                    ? 'text-gray-800 border-b-2 border-[#00d09c] pb-1'
                    : 'text-gray-500 hover:text-gray-700'}`
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
            {!userPic && <img src='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'  width={28} height={28} className='rounded-2xl'/>}             
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-2 py-8">

          {/* Title */}
          <h1 className="text-[22px] font-bold text-gray-700 mb-6">
            {currentFilter.title}
          </h1>

          {/* Filter tabs row */}
          <div className="flex items-center gap-2.5 mb-6 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.label}
onClick={() => {
  const slug = ROUTE_MAP[f.label];

  setActiveFilter(f.label);

  navigate(
    slug
      ? `/markets/${slug}?index=${INDEX_API_MAP[selectedIndex]}`
      : ""
  );
}}                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeFilter === f.label
                    ? 'border-gray-800 text-gray-900 bg-white font-semibold'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
<IndexDropdown
  value={selectedIndex}
  onChange={(value) => {
    setSelectedIndex(value);

    const slug = ROUTE_MAP[activeFilter];

    navigate(
      slug
        ? `/markets/${slug}?index=${INDEX_API_MAP[value]}`
        : `/markets?index=${INDEX_API_MAP[value]}`
    );
  }}
/>          </div>

          {/* Two-column layout */}
          <div className="flex gap-6 items-start">

            {/* ── Main table ── */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">

              {/* Table header */}
              <div className="flex items-center px-5 py-2.5 bg-gray-50 border-b border-gray-200">
                <div className="w-10 flex-shrink-0" />
                <div className="ml-3 flex-1 text-xs font-medium text-gray-400 uppercase tracking-wide">Company</div>
                <div className="w-36 mx-4 flex-shrink-0" />
                <div className="w-36 text-right text-xs font-medium text-gray-400 uppercase tracking-wide flex-shrink-0">
                  Market Price (1D)
                </div>
                <div className="w-28 text-right ml-4 text-xs font-medium text-gray-400 uppercase tracking-wide flex-shrink-0">
                  {show52W ? '52W High / Low' : currentFilter.rightCol}
                </div>
              </div>

              {/* Loading */}
              {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

              {/* Error */}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-8">
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="text-red-400">
                    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
                    <path d="M24 14v12M24 32v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-gray-700 font-medium text-sm">Failed to load stocks</p>
                  <p className="text-xs text-gray-400">{error}</p>
                  <button
                    onClick={() => setActiveFilter(activeFilter)}
                    className="mt-1 px-4 py-1.5 bg-[#44c38a] text-white text-sm font-medium rounded-lg hover:bg-[#38b07a] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && stocks.length === 0 && (
                <div className="py-16 text-center text-gray-400 text-sm">No data available</div>
              )}

              {/* Rows */}
              {!loading && !error && stocks.map((stock, idx) => (
                <StockRow
                  key={stock.isin || idx}
                  stock={stock}
                  activeFilter={activeFilter}
                  isLast={idx === stocks.length - 1}
                />
              ))}
            </div>

            {/* ── Sidebar ── */}
            <div className="w-64 flex-shrink-0">
              <InvestCard />
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}