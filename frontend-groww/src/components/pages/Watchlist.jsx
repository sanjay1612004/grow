import { useState, useEffect, useRef } from "react";
import axios from "axios";

// Helper utility to scale raw flat API pricing arrays onto your UI Sparkline layout
function transformSparkline(prices) {
  if (!prices || prices.length === 0) return [];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;

  return prices.map((price, index) => {
    const x = (index / (prices.length - 1)) * 100;
    const y = range === 0 ? 22.5 : 40 - ((price - min) / range) * 35;
    return [x, y];
  });
}

function SparkLine({ points }) {
  if (!points || !points.length) return null;
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
  const safeLow = typeof low === "number" ? low : 20;
  const safeHigh = typeof high === "number" ? high : 80;

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 whitespace-nowrap">
      <span>L</span>
      <div className="relative w-28 h-1 bg-gray-200 rounded-sm">
        <div
          className="absolute h-full bg-gray-300 rounded-sm"
          style={{ left: `${safeLow}%`, width: `${safeHigh - safeLow}%` }}
        />
        <div
          className="absolute w-1.5 h-2.5 bg-gray-800 rounded-[1px]"
          style={{ left: `${safeHigh - 2}%`, top: "-6px" }}
        />
      </div>
      <span>H</span>
    </div>
  );
}

function CompanyLogo({ logoUrl, name }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-9 h-9 rounded-md object-contain border border-gray-200 bg-white"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }
  return <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center text-xs">🏢</div>;
}

const SortIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
    <path d="M5 1L2 4h6L5 1z" fill="#aaa" />
    <path d="M5 11L2 8h6L5 11z" fill="#aaa" />
  </svg>
);

// Drag handle icon (six dots)
const DragHandleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="4" cy="3" r="1.2" fill="#bbb" />
    <circle cx="4" cy="7" r="1.2" fill="#bbb" />
    <circle cx="4" cy="11" r="1.2" fill="#bbb" />
    <circle cx="10" cy="3" r="1.2" fill="#bbb" />
    <circle cx="10" cy="7" r="1.2" fill="#bbb" />
    <circle cx="10" cy="11" r="1.2" fill="#bbb" />
  </svg>
);

// Remove (X circle) icon
const RemoveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" stroke="#ccc" strokeWidth="1.5" />
    <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13.5" y1="6.5" x2="6.5" y2="13.5" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Compare / settings icon (two sliders)
const CompareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="2" y1="5" x2="16" y2="5" stroke="#888" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="6" cy="5" r="2" fill="white" stroke="#888" strokeWidth="1.4" />
    <line x1="2" y1="13" x2="16" y2="13" stroke="#888" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12" cy="13" r="2" fill="white" stroke="#888" strokeWidth="1.4" />
  </svg>
);

// Groww icon (circular arrow)
const GrowwIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2a5 5 0 1 1-3.54 1.46" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path d="M3 2l.46 1.46L5 2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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
  const [loading, setLoading] = useState(true);
  const [watchlistName, setWatchlistName] = useState("");
  const [stocks, setStocks] = useState([]);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [stocksSnapshot, setStocksSnapshot] = useState([]); // for Undo

  // Hovered row tracking (normal mode)
  const [hoveredRow, setHoveredRow] = useState(null);
  const userId=localStorage.getItem("userId")

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const listRes = await axios.get(
          `http://localhost:5000/api/watchlist/all/lists?userId=${userId}`
        );
        if (!listRes.data.watchlists || listRes.data.watchlists.length === 0) {
          setLoading(false);
          return;
        }
        const firstWatchlist = listRes.data.watchlists[0];
        const detailsRes = await axios.get(
          `http://localhost:5000/api/watchlist/by-id/${firstWatchlist._id}`
        );
        const { watchlistName: incomingName, stocks: incomingStocks } = detailsRes.data;
        setWatchlistName(incomingName || "Watchlist");
        setStocks(incomingStocks || []);
      } catch (err) {
        console.error("Watchlist fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleDeleteRow = async (searchId) => {
    if (!window.confirm("Are you sure you want to remove this stock from your watchlist?")) {
      return;
    }
    try {
      const res = await axios.delete("http://localhost:5000/api/watchlist/remove", {
        data: {
          userId,
          watchlistId: 1,
          searchId: searchId
        }
      });
      if (res.data.success) {
        setStocks((prevStocks) => prevStocks.filter((stock) => stock.searchId !== searchId));
      }
    } catch (err) {
      console.error("Error removing stock from backend database context:", err);
      alert("Failed to remove item. Please try again.");
    }
  };

  // Edit mode: remove stock inline (no confirm dialog in edit mode — uses the ⊗ button)
  const handleEditModeRemove = (searchId) => {
    setStocks((prev) => prev.filter((s) => s.searchId !== searchId));
  };

  // Enter edit mode
  const handleEditClick = () => {
    setEditName(watchlistName);
    setStocksSnapshot([...stocks]); // snapshot for undo
    setIsEditMode(true);
  };

  // Done — save changes
  const handleDone = () => {
    if (editName.trim()) {
      setWatchlistName(editName.trim());
    }
    setIsEditMode(false);
  };

  // Undo — restore snapshot
  const handleUndo = () => {
    setStocks([...stocksSnapshot]);
    setEditName(watchlistName); // revert name too
  };

  // Delete watchlist
  const handleDeleteWatchlist = () => {
    if (window.confirm("Are you sure you want to delete this entire watchlist?")) {
      setStocks([]);
      setIsEditMode(false);
    }
  };

  const filtered = isEditMode
    ? stocks // no search filter in edit mode
    : stocks.filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="font-sans bg-white rounded-2xl shadow-md max-w-6xl mx-auto my-6 overflow-hidden border-gray-300">

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-0 border border-gray-300 px-6">
        <div className="py-[18px] pb-[14px] font-bold text-[15px] text-gray-900 border-b-[2.5px] border-gray-900 mr-6 cursor-pointer">
          {watchlistName || "Loading..."}
        </div>
        {/* Hide + Watchlist in edit mode */}
        {!isEditMode && (
          <div className="py-[18px] pb-[14px] font-semibold text-sm text-emerald-500 cursor-pointer flex items-center gap-1">
            <span className="text-lg leading-none">+</span> Watchlist
          </div>
        )}
      </div>

      {/* ── Toolbar: Normal mode vs Edit mode ── */}
      {!isEditMode ? (
        /* Normal mode: Search + Add stocks + Edit */
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 w-64">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="#aaa" strokeWidth="1.4" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your watchlist"
              className="bg-transparent border-none outline-none text-[13.5px] text-gray-600 w-full placeholder-gray-400"
            />
          </div>

          <div className="flex gap-2.5">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white text-[13.5px] font-medium text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-base leading-none">+</span> Add stocks
            </button>
            <button
              onClick={handleEditClick}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white text-[13.5px] font-medium text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 10.5h2.5l7-7L8 1l-7 7v2.5z" stroke="#555" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      ) : (
        /* Edit mode: Watchlist name input + Delete watchlist + Undo + Done */
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {/* Editable watchlist name */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3.5 py-2 w-64">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-transparent border-none outline-none text-[13.5px] text-gray-800 font-medium w-full"
            />
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-gray-400 flex-shrink-0">
              <path d="M1 10.5h2.5l7-7L8 1l-7 7v2.5z" stroke="#aaa" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Delete watchlist */}
            <button
              onClick={handleDeleteWatchlist}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white text-[13px] font-medium text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
                <path d="M1 3.5h11M4.5 3.5V2h4v1.5M5.5 6v5M7.5 6v5M2 3.5l.8 8.5h7.4l.8-8.5H2z" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              Delete watchlist
            </button>

            {/* Undo */}
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white text-[13px] font-medium text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5A4.5 4.5 0 1 1 6.5 2" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                <path d="M2 2.5V6.5H6" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              Undo
            </button>

            {/* Done */}
            <button
              onClick={handleDone}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[13.5px] font-semibold cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-2.5 text-[12.5px] font-medium text-gray-400 whitespace-nowrap select-none ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.key === "company"
                    ? `Company (${filtered.length})`
                    : col.label}
                  {col.sortable && <SortIcon />}
                </span>
              </th>
            ))}
            {/* Extra header cell for action column */}
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400 text-sm">
                Loading live watchlist items...
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400 text-sm">
                No matching stocks found
              </td>
            </tr>
          ) : (
            filtered.map((stock, idx) => {
              const {
                _id,
                nseScriptCode,
                logo,
                name,
                price,
                changeVal,
                change,
                volume,
                yearLow,
                yearHigh,
                sparklinePrices,
                up,
                searchId
              } = stock;

              const isPositive = up || changeVal?.startsWith("+");
              const isHovered = hoveredRow === (_id || nseScriptCode);

              return (
                <tr
                  key={_id || nseScriptCode}
                  className={`transition-colors duration-150 hover:bg-gray-50 ${
                    idx < filtered.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                  onMouseEnter={() => !isEditMode && setHoveredRow(_id || nseScriptCode)}
                  onMouseLeave={() => !isEditMode && setHoveredRow(null)}
                >
                  {/* Company */}
                  <td className="px-4 py-[18px]">
                    <div className="flex items-center gap-3">
                      <CompanyLogo logoUrl={logo} name={name} />
                      <span className="text-[14.5px] font-semibold text-gray-900">
                        {name}
                      </span>
                    </div>
                  </td>

                  {/* Trend */}
                  <td className="px-4 py-[18px]">
                    <SparkLine points={transformSparkline(sparklinePrices)} />
                  </td>

                  {/* Mkt price */}
                  <td className="px-4 py-[18px] text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {price}
                    </span>
                  </td>

                  {/* 1D change */}
                  <td className="px-4 py-[18px] text-right">
                    <span className={`text-[13.5px] font-medium ${isPositive ? "text-emerald-600" : "text-[#d63c1a]"}`}>
                      {changeVal} ({change})
                    </span>
                  </td>

                  {/* 1D vol */}
                  <td className="px-4 py-[18px] text-right">
                    <span className="text-[13.5px] text-gray-600">
                      {typeof volume === "number" ? volume.toLocaleString("en-IN") : volume}
                    </span>
                  </td>

                  {/* 52W perf */}
                  <td className="px-4 py-[18px] text-right">
                    <div className="flex justify-end">
                      <FiftyTwoWeekBar low={yearLow} high={yearHigh} />
                    </div>
                  </td>

                  {/* Action column */}
                  <td className="px-3 py-[18px]">
                    {isEditMode ? (
                      /* Edit mode: drag handle + remove button */
                      <div className="flex items-center gap-2 justify-end">
                        <span className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors">
                          <DragHandleIcon />
                        </span>
                        <button
                          onClick={() => handleDeleteRow(searchId)}
                          className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
                          title="Remove from watchlist"
                        >
                          <RemoveIcon />
                        </button>
                      </div>
                    ) : (
                      /* Normal mode: hover quick-action buttons */
                      <div
                        className="flex items-center gap-1.5 justify-end transition-opacity duration-150"
                        style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? "auto" : "none" }}
                      >
                        {/* Compare / filter icon */}
                        <button
                          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Compare"
                        >
                          <CompareIcon />
                        </button>

                        {/* Groww button — green */}
                        <button
                          className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer"
                          title="View on Groww"
                        >
                          <span className="text-white text-[11px] font-bold leading-none">G</span>
                        </button>

                        {/* Smallcase button — red/orange */}
                        <button
                          className="flex items-center justify-center w-7 h-7 rounded-md bg-[#e8472a] hover:bg-[#cc3c22] transition-colors cursor-pointer"
                          title="View on Smallcase"
                        >
                          <span className="text-white text-[11px] font-bold leading-none">S</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}