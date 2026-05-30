import { useState } from "react";

const stockData = [
  {
    id: 1,
    logo: "adani",
    name: "Adani Power",
    price: "₹243.37",
    change: "-₹5.54",
    changePct: "2.23%",
    volume: "7,18,56,898",
    low52: 15,
    high52: 78,
    trend: [
      [0,38],[5,35],[10,40],[15,32],[20,34],[25,30],[30,33],[35,28],[40,31],
      [45,26],[50,29],[55,24],[60,27],[65,22],[70,25],[75,20],[80,28],[85,18],
      [90,23],[95,15],[100,20]
    ]
  },
  {
    id: 2,
    logo: "zydus",
    name: "Zydus Lifesciences",
    price: "₹1,077.70",
    change: "-₹8.10",
    changePct: "0.75%",
    volume: "45,88,161",
    low52: 35,
    high52: 68,
    trend: [
      [0,32],[5,34],[10,30],[15,35],[20,28],[25,33],[30,26],[35,30],[40,24],
      [45,28],[50,22],[55,26],[60,20],[65,24],[70,18],[75,22],[80,16],[85,30],
      [90,14],[95,10],[100,5]
    ]
  },
  {
    id: 3,
    logo: "vedanta",
    name: "Vedanta",
    price: "₹352.60",
    change: "-₹2.10",
    changePct: "0.59%",
    volume: "3,26,84,449",
    low52: 45,
    high52: 72,
    trend: [
      [0,30],[5,35],[10,25],[15,38],[20,22],[25,36],[30,20],[35,34],[40,24],
      [45,32],[50,28],[55,34],[60,22],[65,30],[70,26],[75,32],[80,20],[85,28],
      [90,22],[95,26],[100,20]
    ]
  },
  {
    id: 4,
    logo: "bel",
    name: "Bharat Electronics",
    price: "₹410.75",
    change: "-₹8.35",
    changePct: "1.99%",
    volume: "2,65,59,872",
    low52: 55,
    high52: 62,
    trend: [
      [0,22],[5,26],[10,20],[15,28],[20,18],[25,26],[30,16],[35,24],[40,14],
      [45,22],[50,18],[55,20],[60,16],[65,22],[70,12],[75,18],[80,10],[85,20],
      [90,8],[95,15],[100,5]
    ]
  },
  {
    id: 5,
    logo: "tata",
    name: "Tata Steel",
    price: "₹208.02",
    change: "-₹6.68",
    changePct: "3.11%",
    volume: "6,74,67,374",
    low52: 35,
    high52: 70,
    trend: [
      [0,35],[5,38],[10,32],[15,36],[20,30],[25,34],[30,28],[35,32],[40,26],
      [45,30],[50,24],[55,28],[60,22],[65,26],[70,18],[75,20],[80,14],[85,16],
      [90,10],[95,12],[100,2]
    ]
  }
];

function SparkLine({ points }) {
  const w = 120, h = 45;
  const xs = points.map(p => (p[0] / 100) * w);
  const ys = points.map(p => (p[1] / 45) * h);
  const d = points
    .map((_, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <path d={d} fill="none" stroke="#e8472a" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function FiftyTwoWeekBar({ low, high }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 whitespace-nowrap">
      <span>L</span>
      <div className="relative w-28 h-1 bg-gray-200 rounded-sm">
        <div
          className="absolute h-full bg-gray-300 rounded-sm"
          style={{ left: `${low}%`, width: `${high - low}%` }}
        />
        <div
          className="absolute w-1.5 h-2.5 bg-gray-800 rounded-[1px]"
          style={{ left: `${high - 2}%`, top: "-6px" }}
        />
      </div>
      <span>H</span>
    </div>
  );
}

function CompanyLogo({ type }) {
  if (type === "adani") {
    return (
      <div className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-[9px] font-bold text-[#1a1a6e] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
        adani
      </div>
    );
  }
  if (type === "zydus") {
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-base" style={{ background: "linear-gradient(135deg, #5bc4c0 0%, #a78bfa 50%, #f97316 100%)" }}>
        🫐
      </div>
    );
  }
  if (type === "vedanta") {
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22c55e, #3b82f6, #1d4ed8)" }}>
        <svg width="22" height="22" viewBox="0 0 22 22">
          <ellipse cx="11" cy="11" rx="9" ry="5" fill="none" stroke="white" strokeWidth="1.5" transform="rotate(-30 11 11)" />
          <ellipse cx="11" cy="11" rx="9" ry="5" fill="none" stroke="white" strokeWidth="1.5" transform="rotate(30 11 11)" />
          <ellipse cx="11" cy="11" rx="9" ry="5" fill="none" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }
  if (type === "bel") {
    return (
      <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)" }}>
        <svg width="20" height="20" viewBox="0 0 20 20">
          <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="2" />
          <polyline points="10,2 18,10 10,18" fill="none" stroke="white" strokeWidth="2" />
          <polyline points="4,2 12,10 4,18" fill="none" stroke="white" strokeWidth="2" />
        </svg>
      </div>
    );
  }
  if (type === "tata") {
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}>
        <svg width="22" height="22" viewBox="0 0 22 22">
          <ellipse cx="11" cy="11" rx="9" ry="9" fill="none" stroke="white" strokeWidth="1.5" />
          <line x1="11" y1="2" x2="11" y2="20" stroke="white" strokeWidth="1.5" />
          <ellipse cx="11" cy="11" rx="4" ry="9" fill="none" stroke="white" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }
  return null;
}

const SortIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
    <path d="M5 1L2 4h6L5 1z" fill="#aaa" />
    <path d="M5 11L2 8h6L5 11z" fill="#aaa" />
  </svg>
);

const columns = [
  { key: "company",  label: "Company",   sortable: true,  align: "left"  },
  { key: "trend",    label: "Trend",     sortable: false, align: "left"  },
  { key: "price",    label: "Mkt price", sortable: true,  align: "right" },
  { key: "change",   label: "1D change", sortable: true,  align: "right" },
  { key: "volume",   label: "1D vol",    sortable: true,  align: "right" },
  { key: "perf52",   label: "52W perf",  sortable: false, align: "right" },
];

export default function StockWatchlist() {
  const [search, setSearch] = useState("");

  const filtered = stockData.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-sans bg-white rounded-2xl shadow-md max-w-6xl mx-auto my-6 overflow-hidden border-gray-300">

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-0 border border-gray-300 px-6">
        <div className="py-[18px] pb-[14px] font-bold text-[15px] text-gray-900 border-b-[2.5px] border-gray-900 mr-6 cursor-pointer">
          Sanjay's Watchlist
        </div>
        <div className="py-[18px] pb-[14px] font-semibold text-sm text-emerald-500 cursor-pointer flex items-center gap-1">
          <span className="text-lg leading-none">+</span> Watchlist
        </div>
      </div>

      {/* ── Search + Actions ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 w-64">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="#aaa" strokeWidth="1.4" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your watchlist"
            className="bg-transparent border-none outline-none text-[13.5px] text-gray-600 w-full placeholder-gray-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white text-[13.5px] font-medium text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-base leading-none">+</span> Add stocks
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white text-[13.5px] font-medium text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 10.5h2.5l7-7L8 1l-7 7v2.5z" stroke="#555" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
            </svg>
            Edit
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-2.5 text-[12.5px] font-medium text-gray-400 whitespace-nowrap select-none ${col.align === "right" ? "text-right" : "text-left"}`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.key === "company"
                    ? `Company (${filtered.length})`
                    : col.label}
                  {col.sortable && <SortIcon />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((stock, idx) => (
            <tr
              key={stock.id}
              className={`transition-colors duration-150 hover:bg-gray-50 ${idx < filtered.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              {/* Company */}
              <td className="px-4 py-[18px]">
                <div className="flex items-center gap-3">
                  <CompanyLogo type={stock.logo} />
                  <span className="text-[14.5px] font-semibold text-gray-900">{stock.name}</span>
                </div>
              </td>

              {/* Trend */}
              <td className="px-4 py-[18px]">
                <SparkLine points={stock.trend} />
              </td>

              {/* Mkt price */}
              <td className="px-4 py-[18px] text-right">
                <span className="text-sm font-medium text-gray-900">{stock.price}</span>
              </td>

              {/* 1D change */}
              <td className="px-4 py-[18px] text-right">
                <span className="text-[13.5px] font-medium text-[#d63c1a]">
                  {stock.change} ({stock.changePct})
                </span>
              </td>

              {/* 1D vol */}
              <td className="px-4 py-[18px] text-right">
                <span className="text-[13.5px] text-gray-600">{stock.volume}</span>
              </td>

              {/* 52W perf */}
              <td className="px-4 py-[18px] text-right">
                <div className="flex justify-end">
                  <FiftyTwoWeekBar low={stock.low52} high={stock.high52} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
