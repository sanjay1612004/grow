import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { NavLink } from "react-router-dom";
import { UserPicture } from "../../App";
import ProfileDropdown from "../UserModule/ProfileDropdown";

// ── Spark-line mini chart ─────────────────────────────────────────────────────
function SparkLine({ points, color }) {
  const w = 120, h = 32;
  if (!points || points.length < 2) return <svg width={w} height={h} />;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const ys = points.map((v) => h - ((v - min) / range) * (h - 8) - 4);
  const baseY = ys[0];
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} className="block flex-shrink-0 mr-7">
      <line x1={0} y1={baseY} x2={w} y2={baseY} stroke="#e0e0e0" strokeWidth={1} strokeDasharray="3,3" />
      <path d={d} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── 52-week range bar ─────────────────────────────────────────────────────────
function WeekRange52({ low, high, current }) {
  const position = high !== low ? Math.min(Math.max((current - low) / (high - low), 0), 1) : 0.5;
  const pct = position * 100;
  return (
    <div className="flex items-center gap-1.5 min-w-[120px]">
      <span className="text-[11px] text-gray-400 font-medium">L</span>
      <div className="flex-1 h-[3px] bg-gray-200 rounded-full relative">
        <div className="absolute w-[9px] h-[9px] bg-gray-700 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2"
          style={{ left: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-gray-400 font-medium">H</span>
    </div>
  );
}

// ── Indian number format ──────────────────────────────────────────────────────
function formatIndianNumber(n) {
  if (n === null || n === undefined) return "—";
  const num = Math.round(n);
  const s = num.toString();
  if (s.length <= 3) return s;
  let result = s.slice(-3);
  let rest = s.slice(0, -3);
  while (rest.length > 2) {
    result = rest.slice(-2) + "," + result;
    rest = rest.slice(0, -2);
  }
  return rest + "," + result;
}

// ── Deterministic spark points ────────────────────────────────────────────────
function generateSparkPoints(ltp, close, yearLow, yearHigh) {
  const isPositive = ltp >= close;
  const seed = Math.abs(Math.round(ltp * 100)) % 9973;
  let v = close;
  const points = [];
  for (let i = 0; i < 30; i++) {
    const x = Math.sin(seed + i * 9301 + 49297) * 233280;
    const r = x - Math.floor(x);
    const drift = isPositive ? 0.54 : 0.46;
    v += (r - drift) * (Math.abs(ltp - close) / 8 + 0.5);
    v = Math.max((yearLow ?? ltp * 0.8) * 0.97, Math.min((yearHigh ?? ltp * 1.2) * 1.03, v));
    points.push(v);
  }
  points[points.length - 1] = ltp;
  return points;
}

// ── Sort icon ─────────────────────────────────────────────────────────────────
function SortIcon({ dir }) {
  return (
    <svg width="8" height="10" viewBox="0 0 8 10" fill="none" className="inline ml-1 -mt-0.5 align-middle">
      <path d="M4 1L7 4H1L4 1Z" fill={dir === "asc" ? "#444" : "#ccc"} />
      <path d="M4 9L1 6H7L4 9Z" fill={dir === "desc" ? "#444" : "#ccc"} />
    </svg>
  );
}

// ── Action buttons ────────────────────────────────────────────────────────────
function ActionButtons() {
  return (
    <div className="flex gap-1.5 items-center">
      <button className="w-8 h-8 rounded-md border border-gray-200 bg-white cursor-pointer flex items-center justify-center hover:bg-gray-50 transition-colors" title="Compare">
        <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
          <path d="M1 6.5H15M11 2L15 6.5L11 11M5 2L1 6.5L5 11" stroke="#888" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="w-8 h-8 rounded-md border border-gray-200 bg-white cursor-pointer flex items-center justify-center hover:bg-gray-50 transition-colors" title="Watchlist">
        <svg width="12" height="15" viewBox="0 0 12 15" fill="none">
          <path d="M1 1h10v13l-5-3.5L1 14V1z" stroke="#888" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="px-3 py-[5px] rounded-md bg-[#00b386] text-white font-bold text-[13px] cursor-pointer hover:bg-[#00a077] transition-colors border-none">B</button>
      <button className="px-3 py-[5px] rounded-md bg-[#e05d5d] text-white font-bold text-[13px] cursor-pointer hover:bg-[#cc4d4d] transition-colors border-none">S</button>
    </div>
  );
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
      <div className="w-9 h-9 rounded-lg bg-gray-100 animate-pulse flex-shrink-0" />
      <div className="flex-1 h-4 bg-gray-100 rounded animate-pulse" style={{maxWidth:180}} />
      <div className="h-4 bg-gray-100 rounded animate-pulse" style={{width:80}} />
      <div className="h-4 bg-gray-100 rounded animate-pulse" style={{width:120}} />
      <div className="h-4 bg-gray-100 rounded animate-pulse" style={{width:80}} />
      <div className="h-4 bg-gray-100 rounded animate-pulse" style={{width:90}} />
      <div className="h-4 bg-gray-100 rounded animate-pulse" style={{width:120}} />
    </div>
  );
}

// ── Filter panel left sidebar ─────────────────────────────────────────────────
const PANEL_SECTIONS = [
  { key: "sort_by", label: "Sort by" },
  { key: "price_change", label: "Price change >1%" },
  { key: "w52", label: "52W Performance" },
  { key: "rsi", label: "RSI" },
  { key: "macd", label: "MACD" },
  { key: "near_breakout", label: "Near breakout" },
  { key: "index", label: "Index" },
  { key: "sector", label: "Sector" },
  { key: "market_cap", label: "Market Cap" },
];

const SECTOR_LIST = [
  "Agriculture & Allied Industries","Apparel and Clothes","Auto Ancillary","Auto Manufacturers",
  "Auto Retail","Aviation","Banks","Batteries","Chemicals","Consumer Electronics","Defence",
  "Diversified Financials","E-Commerce/App based Aggregator","Electric Utilities",
  "Fertilisers & Agrochemicals","Finance","FMCG","Healthcare","Infrastructure","Insurance",
  "IT-Software","Metals & Mining","Oil & Gas","Pharmaceuticals","Real Estate","Retail",
  "Telecom","Textiles","Travel & Tourism"
];

function FilterPanel({ onClose, initSection, filterState, setFilterState }) {
  const [activeSection, setActiveSection] = useState(initSection || "price_change");
  const [sectorSearch, setSectorSearch] = useState("");
  const [localState, setLocalState] = useState(() => JSON.parse(JSON.stringify(filterState)));

  const setRadio = (key, val) => setLocalState(s => ({ ...s, [key]: val }));
  const toggleCheck = (key, val) => setLocalState(s => {
    const arr = s[key] || [];
    return { ...s, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
  });

  const countActive = () => {
    let n = 0;
    if (localState.price_change && localState.price_change !== "None") n++;
    if (localState.w52 && localState.w52 !== "None") n++;
    if (localState.rsi && localState.rsi !== "None") n++;
    if (localState.macd && localState.macd !== "None") n++;
    if (localState.near_breakout?.length) n++;
    if (localState.index && localState.index !== "All") n++;
    if (localState.sector?.length) n++;
    if (localState.market_cap?.length) n++;
    if (localState.sort_by && localState.sort_by !== "None") n++;
    return n;
  };

  const handleApply = () => { setFilterState(localState); onClose(); };
  const handleClearAll = () => {
    const cleared = { price_change:"None", w52:"None", rsi:"None", macd:"None", near_breakout:[], index:"All", sector:[], market_cap:[], sort_by:"None" };
    setLocalState(cleared);
    setFilterState(cleared);
    onClose();
  };

  const renderContent = () => {
    if (activeSection === "sort_by") {
      const opts = ["None","Price: High to Low","Price: Low to High","Change %: High to Low","Volume: High to Low"];
      return (
        <div className="pt-3">
          {opts.map(opt => (
            <div key={opt} onClick={() => setRadio("sort_by", opt)} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 text-sm text-gray-700">
              <RadioCircle active={localState.sort_by === opt || (!localState.sort_by && opt === "None")} />
              {opt}
            </div>
          ))}
        </div>
      );
    }
    if (activeSection === "price_change") {
      const opts = ["None","in last 5 mins","in last 15 mins","in last 1 hour","Today"];
      return (
        <div className="pt-3">
          {opts.map(opt => (
            <div key={opt} onClick={() => setRadio("price_change", opt)} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 text-sm text-gray-700">
              <RadioCircle active={localState.price_change === opt || (!localState.price_change && opt === "None")} />
              {opt === "in last 1 hour" ? <span>in last <strong>1</strong> hour</span> : opt}
            </div>
          ))}
          <p className="px-5 pt-3 pb-2 text-[12px] text-gray-400 leading-[1.6]">
            Shows stocks that have moved by more than 1% within the chosen time frame. Useful to quickly spot stocks with big price movements.
          </p>
        </div>
      );
    }
    if (activeSection === "w52") {
      const opts = ["None","Near 52W High (within 5%)","Near 52W Low (within 5%)","All time high"];
      return (
        <div className="pt-3">
          {opts.map(opt => (
            <div key={opt} onClick={() => setRadio("w52", opt)} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 text-sm text-gray-700">
              <RadioCircle active={localState.w52 === opt || (!localState.w52 && opt === "None")} />
              {opt}
            </div>
          ))}
        </div>
      );
    }
    if (activeSection === "rsi") {
      const opts = ["None","Oversold (RSI < 30)","Overbought (RSI > 70)"];
      return (
        <div className="pt-3">
          {opts.map(opt => (
            <div key={opt} onClick={() => setRadio("rsi", opt)} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 text-sm text-gray-700">
              <RadioCircle active={localState.rsi === opt || (!localState.rsi && opt === "None")} />
              {opt}
            </div>
          ))}
          <p className="px-5 pt-3 pb-2 text-[12px] text-gray-400 leading-[1.6]">
            This filter uses the RSI (14-day) to show whether a stock is overbought (&gt;70), oversold (&lt;30), or trading in a balanced range (30-70). This can help you decide if a stock may reverse direction soon.
          </p>
        </div>
      );
    }
    if (activeSection === "macd") {
      const opts = ["None","Bullish crossover","Bearish crossover","Above signal line","Below signal line"];
      return (
        <div className="pt-3">
          {opts.map(opt => (
            <div key={opt} onClick={() => setRadio("macd", opt)} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 text-sm text-gray-700">
              <RadioCircle active={localState.macd === opt || (!localState.macd && opt === "None")} />
              {opt}
            </div>
          ))}
        </div>
      );
    }
    if (activeSection === "near_breakout") {
      const opts = ["Near R1","R1 Breakout","Near R2","R2 Breakout","Near R3","R3 Breakout"];
      const sel = localState.near_breakout || [];
      return (
        <div className="pt-3">
          <div className="flex items-center justify-between px-5 py-2">
            <span className="text-[12px] text-gray-500">{sel.length} selected</span>
            <button onClick={() => setLocalState(s => ({...s, near_breakout:[]}))} className="text-[12px] text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer font-[inherit]">Deselect all</button>
          </div>
          {opts.map(opt => (
            <div key={opt} onClick={() => toggleCheck("near_breakout", opt)} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50">
              <CheckBox active={sel.includes(opt)} />
              <span className="text-sm text-gray-800">{opt}</span>
            </div>
          ))}
          <p className="px-5 pt-3 pb-2 text-[12px] text-gray-400 leading-[1.6]">
            Breakout levels (R1, R2, R3) are key resistance points calculated using pivot points. If a stock is near a resistance level, it may reverse, but if it breaks out, it could signal a bullish trend.
          </p>
        </div>
      );
    }
    if (activeSection === "index") {
      const opts = ["All","Nifty 50","Nifty 100","Nifty 500","Nifty Midcap 100","Nifty Midcap 150","Nifty Smallcap 100","Nifty Smallcap 250","Nifty Total Market"];
      return (
        <div className="pt-3">
          {opts.map(opt => (
            <div key={opt} onClick={() => setRadio("index", opt)} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 text-sm text-gray-700">
              <RadioCircle active={localState.index === opt || (!localState.index && opt === "All")} />
              {opt}
            </div>
          ))}
        </div>
      );
    }
    if (activeSection === "sector") {
      const sel = localState.sector || [];
      const filtered = SECTOR_LIST.filter(s => s.toLowerCase().includes(sectorSearch.toLowerCase()));
      return (
        <div className="pt-2">
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-8 bg-gray-50">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#aaa" strokeWidth="2"/><path d="M20 20l-3-3" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/></svg>
              <input value={sectorSearch} onChange={e => setSectorSearch(e.target.value)} placeholder="Search" className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none text-[13px]" />
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-1">
            <span className="text-[12px] text-gray-500">{sel.length} selected</span>
            <button onClick={() => setLocalState(s => ({...s, sector:[]}))} className="text-[12px] text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer font-[inherit]">Deselect all</button>
          </div>
          {filtered.map(opt => (
            <div key={opt} onClick={() => toggleCheck("sector", opt)} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50">
              <CheckBox active={sel.includes(opt)} />
              <span className="text-sm text-gray-800">{opt}</span>
            </div>
          ))}
        </div>
      );
    }
    if (activeSection === "market_cap") {
      const opts = [
        { label:"Largecap", sub:"₹1L Cr and above" },
        { label:"Midcap", sub:"₹30K Cr – ₹1L Cr" },
        { label:"Smallcap", sub:"₹5K Cr – ₹30K Cr" },
        { label:"Microcap", sub:"Below ₹5K Cr" },
      ];
      const sel = localState.market_cap || [];
      return (
        <div className="pt-3">
          <div className="flex items-center justify-between px-5 py-2">
            <span className="text-[12px] text-gray-500">{sel.length} selected</span>
            <button onClick={() => setLocalState(s => ({...s, market_cap:[]}))} className="text-[12px] text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer font-[inherit]">Deselect all</button>
          </div>
          {opts.map(opt => (
            <div key={opt.label} onClick={() => toggleCheck("market_cap", opt.label)} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50">
              <CheckBox active={sel.includes(opt.label)} />
              <div>
                <div className="text-sm text-gray-800">{opt.label}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{opt.sub}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const activeCount = countActive();

  return (
    <div className="fixed inset-0 z-[200] flex items-start">
      <div onClick={onClose} className="absolute inset-0 bg-black/20" />
      <div className="relative flex w-[460px] h-screen bg-white shadow-[4px_0_32px_rgba(0,0,0,0.15)] z-10 flex-col">
        {/* scrollable top bar for left nav + right content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left nav */}
          <div className="w-[155px] border-r border-gray-100 overflow-y-auto flex-shrink-0">
            {PANEL_SECTIONS.map(s => (
              <div key={s.key} onClick={() => setActiveSection(s.key)}
                className={`px-4 py-[11px] text-[13px] cursor-pointer border-l-[3px] transition-colors
                  ${activeSection === s.key ? "text-[#00b386] font-semibold border-[#00b386] bg-[#f0fbf7]" : "text-gray-600 border-transparent hover:bg-gray-50"}`}
              >
                {s.label}
              </div>
            ))}
          </div>
          {/* Right content */}
          <div className="flex-1 overflow-y-auto pb-4">
            {renderContent()}
          </div>
        </div>
        {/* Footer */}
        <div className="flex border-t border-gray-100 flex-shrink-0">
          <button onClick={handleClearAll} className="flex-1 py-3.5 bg-white border-none text-[13px] text-gray-500 cursor-pointer font-[inherit] hover:bg-gray-50">
            Clear all
          </button>
          <button onClick={handleApply} className="flex-1 py-3.5 bg-gray-100 border-none text-[13px] text-gray-800 font-semibold cursor-pointer font-[inherit] hover:bg-gray-200 transition-colors">
            Apply {activeCount > 0 ? `(${activeCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

function RadioCircle({ active }) {
  return (
    <div className="w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ border: `2px solid ${active ? "#00b386" : "#ccc"}` }}>
      {active && <div className="w-[9px] h-[9px] rounded-full bg-[#00b386]" />}
    </div>
  );
}

function CheckBox({ active }) {
  return (
    <div className="w-[18px] h-[18px] rounded flex-shrink-0 flex items-center justify-center"
      style={{ border: `2px solid ${active ? "#00b386" : "#ccc"}`, background: active ? "#00b386" : "white" }}>
      {active && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

// ── Chip dropdown (inline) ────────────────────────────────────────────────────
function ChipDropdown({ label, filterKey, filterState, setFilterState, options, isRadio = true, onClose }) {
  const ref = useRef(null);
  const sel = filterState[filterKey];
  const isActive = isRadio ? (sel && sel !== "None") : (sel?.length > 0);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute top-[calc(100%+6px)] left-0 bg-white border border-gray-200 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] z-50 min-w-[220px] py-2 overflow-hidden">
      {options.map(opt => {
        const val = typeof opt === "string" ? opt : opt.value;
        const display = typeof opt === "string" ? opt : opt.label;
        const sub = typeof opt === "object" ? opt.sub : null;
        const checked = isRadio ? (sel === val || (!sel && val === "None")) : (sel || []).includes(val);
        return (
          <div key={val}
            onClick={() => {
              if (isRadio) {
                setFilterState(s => ({ ...s, [filterKey]: val }));
              } else {
                setFilterState(s => {
                  const arr = s[filterKey] || [];
                  return { ...s, [filterKey]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
                });
              }
            }}
            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 text-sm text-gray-700"
          >
            {isRadio ? <RadioCircle active={checked} /> : <CheckBox active={checked} />}
            <div>
              <div className={checked ? "font-semibold text-gray-900" : ""}>{display}</div>
              {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Filter chip button ────────────────────────────────────────────────────────
const CHIP_CONFIGS = {
  price_change: {
    label: "Price change >1%",
    options: [
      {value:"None",label:"None"},
      {value:"in last 5 mins",label:"in last 5 mins"},
      {value:"in last 15 mins",label:"in last 15 mins"},
      {value:"in last 1 hour",label:"in last 1 hour"},
      {value:"Today",label:"Today"},
    ],
    isRadio: true,
  },
  w52: {
    label: "52W Performance",
    options: [
      {value:"None",label:"None"},
      {value:"Near 52W High (within 5%)",label:"Near 52W High (within 5%)"},
      {value:"Near 52W Low (within 5%)",label:"Near 52W Low (within 5%)"},
      {value:"All time high",label:"All time high"},
    ],
    isRadio: true,
  },
  rsi: {
    label: "RSI",
    options: [
      {value:"None",label:"None"},
      {value:"Oversold (RSI < 30)",label:"Oversold (RSI < 30)"},
      {value:"Overbought (RSI > 70)",label:"Overbought (RSI > 70)"},
    ],
    isRadio: true,
  },
  macd: {
    label: "MACD",
    options: [
      {value:"None",label:"None"},
      {value:"Bullish crossover",label:"Bullish crossover"},
      {value:"Bearish crossover",label:"Bearish crossover"},
      {value:"Above signal line",label:"Above signal line"},
      {value:"Below signal line",label:"Below signal line"},
    ],
    isRadio: true,
  },
};

function FilterChip({ filterKey, filterState, setFilterState }) {
  const [open, setOpen] = useState(false);
  const config = CHIP_CONFIGS[filterKey];
  const sel = filterState[filterKey];
  const isActive = sel && sel !== "None";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] cursor-pointer font-[inherit] whitespace-nowrap transition-all
          ${isActive ? "border-[#00b386] bg-[#f0fbf7] text-[#00b386]" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"}`}
      >
        {config.label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d={open ? "M1 5L5 1L9 5" : "M1 1L5 5L9 1"} stroke={isActive ? "#00b386" : "#999"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <ChipDropdown
          label={config.label}
          filterKey={filterKey}
          filterState={filterState}
          setFilterState={setFilterState}
          options={config.options}
          isRadio={config.isRadio}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

// ── Apply filters to stocks ───────────────────────────────────────────────────
function applyFilters(stocks, filterState) {
  let result = [...stocks];

  // price_change filter: filter by % change threshold
  if (filterState.price_change && filterState.price_change !== "None") {
    result = result.filter(s => {
      const pct = s.close !== 0 ? Math.abs((s.ltp - s.close) / s.close * 100) : 0;
      return pct > 1;
    });
  }

  // 52W Performance
  if (filterState.w52 && filterState.w52 !== "None") {
    result = result.filter(s => {
      if (!s.yearHigh || !s.yearLow) return true;
      const pctFromHigh = (s.yearHigh - s.ltp) / s.yearHigh * 100;
      const pctFromLow = (s.ltp - s.yearLow) / s.yearLow * 100;
      if (filterState.w52 === "Near 52W High (within 5%)") return pctFromHigh <= 5;
      if (filterState.w52 === "Near 52W Low (within 5%)") return pctFromLow <= 5;
      if (filterState.w52 === "All time high") return pctFromHigh <= 1;
      return true;
    });
  }

  // Market Cap
  if (filterState.market_cap?.length) {
    result = result.filter(s => {
      const mc = s.marketCap;
      if (!mc) return false;
      return filterState.market_cap.some(cap => {
        if (cap === "Largecap") return mc >= 100000;
        if (cap === "Midcap") return mc >= 30000 && mc < 100000;
        if (cap === "Smallcap") return mc >= 5000 && mc < 30000;
        if (cap === "Microcap") return mc < 5000;
        return false;
      });
    });
  }

  // Sort
  if (filterState.sort_by && filterState.sort_by !== "None") {
    if (filterState.sort_by === "Price: High to Low") result.sort((a,b) => b.ltp - a.ltp);
    if (filterState.sort_by === "Price: Low to High") result.sort((a,b) => a.ltp - b.ltp);
    if (filterState.sort_by === "Change %: High to Low") result.sort((a,b) => {
      const pa = a.close ? Math.abs((a.ltp-a.close)/a.close) : 0;
      const pb = b.close ? Math.abs((b.ltp-b.close)/b.close) : 0;
      return pb - pa;
    });
    if (filterState.sort_by === "Volume: High to Low") result.sort((a,b) => (b.volume||0) - (a.volume||0));
  }

  return result;
}

// ── Default filter state ──────────────────────────────────────────────────────
const DEFAULT_FILTERS = {
  price_change: "None", w52: "None", rsi: "None", macd: "None",
  near_breakout: [], index: "All", sector: [], market_cap: [], sort_by: "None",
};

// ── Grid column template — single source of truth ─────────────────────────────
// logo | company+sparkline | market price | 1D change | volume | 1W avg vol | 52W
const GRID_COLS = "52px 1fr 110px 150px 160px 140px 160px";

// ── Main component ─────────────────────────────────────────────────────────────
export default function GrowwInteradaystock() {
  const [showPanel, setShowPanel] = useState(false);
  const [panelInitSection, setPanelInitSection] = useState("price_change");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [spinning, setSpinning] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterState, setFilterState] = useState(DEFAULT_FILTERS);
  const [showClearTooltip, setShowClearTooltip] = useState(false);
  const { userPic } = useContext(UserPicture);
  const [showProfile, setShowProfile] = useState(false);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/intraday-stocks");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setStocks(json?.data?.screenerList ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStocks(); }, [fetchStocks]);

  const handleRefresh = () => {
    setSpinning(true);
    fetchStocks().finally(() => setTimeout(() => setSpinning(false), 500));
  };

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const handleClearAll = () => setFilterState(DEFAULT_FILTERS);

  const openPanel = (section) => { setPanelInitSection(section); setShowPanel(true); };

  // Count active filters for badge
  const activeFilterCount = (() => {
    let n = 0;
    if (filterState.price_change !== "None") n++;
    if (filterState.w52 !== "None") n++;
    if (filterState.rsi !== "None") n++;
    if (filterState.macd !== "None") n++;
    if (filterState.near_breakout?.length) n++;
    if (filterState.index !== "All") n++;
    if (filterState.sector?.length) n++;
    if (filterState.market_cap?.length) n++;
    if (filterState.sort_by !== "None") n++;
    return n;
  })();

  // Apply filters then column sort
  let displayStocks = applyFilters(stocks, filterState);
  if (sortCol && filterState.sort_by === "None") {
    displayStocks = [...displayStocks].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortCol === "price") return mul * (a.ltp - b.ltp);
      if (sortCol === "change") return mul * ((a.ltp - a.close) - (b.ltp - b.close));
      if (sortCol === "volume") return mul * ((a.volume || 0) - (b.volume || 0));
      return 0;
    });
  }

  const noResults = !loading && displayStocks.length === 0 && !error;

  return (
    <div className="font-[Nunito_Sans,Segoe_UI,sans-serif] bg-white min-h-screen flex flex-col">
      {/* Navbar */}
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

      {/* Page */}
      <div className="max-w-[1280px] mx-auto px-8 py-7 flex-1 w-full">
        {/* Title */}
        <div className="flex items-center gap-2 mb-5">
          <h1 className="text-[22px] font-bold text-gray-800 m-0">Intraday Stocks Screener</h1>
          <button onClick={handleRefresh} title="Refresh"
            className={`bg-transparent border-none cursor-pointer text-[20px] text-gray-500 leading-none p-0.5 hover:text-gray-800 transition-colors ${spinning ? "animate-spin" : ""}`}>
            ↺
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2 items-center mb-6 flex-wrap">
          {/* Gear button */}
          <div className="relative">
            <button onClick={() => openPanel("price_change")}
              className="w-9 h-9 rounded-full border border-gray-300 bg-white cursor-pointer flex items-center justify-center hover:border-gray-400 transition-colors">
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                <line x1="1" y1="2" x2="15" y2="2" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="7" x2="13" y2="7" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="11" y2="12" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full w-[18px] h-[18px] text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>

          {/* Chip filters */}
          {["price_change","w52","rsi","macd"].map(key => (
            <FilterChip key={key} filterKey={key} filterState={filterState} setFilterState={setFilterState} />
          ))}

          {/* Clear all */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowClearTooltip(true)}
              onMouseLeave={() => setShowClearTooltip(false)}
              onClick={handleClearAll}
              className="bg-transparent border-none text-[13px] text-gray-400 cursor-pointer px-1 py-1.5 font-[inherit] underline decoration-dashed underline-offset-2"
            >
              Clear all
            </button>
            {showClearTooltip && (
              <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap z-50 pointer-events-none shadow-lg">
                Clear all will remove all the applied filters
              </div>
            )}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-sm text-amber-700 flex items-center gap-2">
            <span>⚠</span> Could not reach API ({error}). Showing empty list.
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_8px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* ── Header ── */}
          <div
            className="grid items-center px-6 py-3 bg-gray-50 border-b border-gray-100"
            style={{ gridTemplateColumns: GRID_COLS }}
          >
            <div />
            {/* Company header — no sparkline space needed, just text */}
            <div className="text-[12.5px] text-gray-500 font-medium">Company</div>
            <div className="text-[12.5px] text-gray-500 font-medium cursor-pointer select-none" onClick={() => handleSort("price")}>
              Market price <SortIcon dir={sortCol === "price" ? sortDir : null}/>
            </div>
            <div className="text-[12.5px] text-gray-500 font-medium cursor-pointer select-none" onClick={() => handleSort("change")}>
              1D price change <SortIcon dir={sortCol === "change" ? sortDir : null}/>
            </div>
            <div className="text-[12.5px] text-gray-500 font-medium cursor-pointer select-none" onClick={() => handleSort("volume")}>
              1D volume
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="inline ml-1 opacity-60"><path d="M1 1L5 5L9 1" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="text-[12.5px] text-gray-500 font-medium">1W avg vol diff</div>
            <div className="text-[12.5px] text-gray-500 font-medium">52W performance</div>
          </div>

          {/* Loading skeleton */}
          {loading && Array.from({length: 8}).map((_, i) => <SkeletonRow key={i}/>)}

          {/* Empty state */}
          {noResults && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" fill="#f0f0ff" stroke="#e0e0ff" strokeWidth="2"/>
                <ellipse cx="40" cy="70" rx="20" ry="4" fill="#e8e8ff" opacity="0.6"/>
                <rect x="15" y="32" width="22" height="16" rx="4" fill="#8888dd" opacity="0.8"/>
                <rect x="15" y="32" width="22" height="16" rx="4" fill="none" stroke="#6666bb" strokeWidth="1.5"/>
                <circle cx="19" cy="40" r="5" fill="white" opacity="0.9"/>
                <circle cx="29" cy="40" r="5" fill="white" opacity="0.9"/>
                <circle cx="19" cy="40" r="3" fill="#8888dd"/>
                <circle cx="29" cy="40" r="3" fill="#8888dd"/>
                <rect x="43" y="32" width="22" height="16" rx="4" fill="#8888dd" opacity="0.8"/>
                <rect x="43" y="32" width="22" height="16" rx="4" fill="none" stroke="#6666bb" strokeWidth="1.5"/>
                <circle cx="47" cy="40" r="5" fill="white" opacity="0.9"/>
                <circle cx="57" cy="40" r="5" fill="white" opacity="0.9"/>
                <circle cx="47" cy="40" r="3" fill="#8888dd"/>
                <circle cx="57" cy="40" r="3" fill="#8888dd"/>
                <line x1="36" y1="44" x2="44" y2="44" stroke="#6666bb" strokeWidth="2"/>
                <text x="40" y="28" textAnchor="middle" fontSize="8" fill="#aaaacc" fontFamily="sans-serif">✦</text>
                <text x="16" y="28" textAnchor="middle" fontSize="6" fill="#aaaacc" fontFamily="sans-serif">✦</text>
                <text x="64" y="28" textAnchor="middle" fontSize="6" fill="#aaaacc" fontFamily="sans-serif">✦</text>
              </svg>
              <div className="text-center">
                <p className="text-[15px] text-gray-700 font-medium">No results found for the selected filter.</p>
                <p className="text-[15px] text-gray-700 font-medium">Try removing some filters.</p>
              </div>
              <button onClick={() => openPanel("price_change")} className="text-[#00b386] text-[14px] font-semibold bg-transparent border-none cursor-pointer hover:underline font-[inherit]">
                Modify filters
              </button>
            </div>
          )}

          {/* ── Rows ── */}
          {!loading && displayStocks.map(stock => {
            const isHovered = hoveredRow === stock.gsin;
            const ltp = stock.ltp ?? 0;
            const close = stock.close ?? ltp;
            const priceChange = ltp - close;
            const pricePct = close !== 0 ? (priceChange / close) * 100 : 0;
            const isPositive = priceChange >= 0;
            const sparkColor = isPositive ? "#00b386" : "#e05d5d";
            const sparkPoints = generateSparkPoints(ltp, close, stock.yearLow, stock.yearHigh);
            const volDiff = stock.volumeWeekAvg ? ((stock.volume - stock.volumeWeekAvg) / stock.volumeWeekAvg * 100) : null;
            const name = stock.companyData?.shortName ?? stock.nseScriptCode ?? "—";
            const truncName = name.length > 18 ? name.slice(0, 16) + "..." : name;
            const logoUrl = stock.companyData?.logoUrl;

            return (
              <div
                key={stock.gsin}
                onMouseEnter={() => setHoveredRow(stock.gsin)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`grid items-center px-6 py-[11px] border-b border-gray-50 cursor-pointer transition-colors duration-100 ${isHovered ? "bg-[#fafff9]" : "bg-white"}`}
                style={{ gridTemplateColumns: GRID_COLS }}
              >
                {/* ── Logo ── */}
                <div className="w-9 h-9 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 relative bg-gray-50">
                  {logoUrl && (
                    <img
                      src={logoUrl}
                      alt={name}
                      className="w-full h-full object-contain"
                      onError={e => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                      }}
                    />
                  )}
                  <div
                    className="w-full h-full items-center justify-center text-[11px] font-bold text-gray-500 bg-gray-100 absolute inset-0"
                    style={{ display: logoUrl ? "none" : "flex" }}
                  >
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* ── Company name + sparkline (inline, right-aligned) ── */}
                <div className="pl-2 flex items-center justify-between min-w-0 gap-3 overflow-hidden">
                  <div className="min-w-0">
                    <div className="font-semibold text-[13.5px] text-gray-900 leading-tight truncate">{truncName}</div>
                    {stock.tag && <div className="text-[11px] text-[#00b386] font-medium mt-0.5">{stock.tag}</div>}
                  </div>
                  {/* Sparkline lives here — inside Company column, right side */}
                  <SparkLine points={sparkPoints} color={sparkColor} />
                </div>

                {/* ── Market price — text only, no sparkline ── */}
                <div className="font-semibold text-[13.5px] text-gray-900">
                  ₹{ltp.toFixed(2)}
                </div>

                {/* ── 1D price change ── */}
                <div className={`text-[13px] font-semibold ${isPositive ? "text-[#00b386]" : "text-[#e05d5d]"}`}>
                  {isPositive ? "+" : ""}{priceChange.toFixed(2)} ({Math.abs(pricePct).toFixed(2)}%)
                </div>

                {/* ── Volume / action buttons on hover ── */}
                <div className="text-[13px] text-gray-700">
                  {isHovered ? <ActionButtons /> : formatIndianNumber(stock.volume)}
                </div>

                {/* ── 1W avg vol diff ── */}
                <div>
                  {volDiff !== null
                    ? <span className={`text-[13px] font-semibold ${volDiff >= 0 ? "text-[#00b386]" : "text-[#e05d5d]"}`}>
                        {volDiff >= 0 ? "+" : ""}{volDiff.toFixed(2)}%
                      </span>
                    : <span className="text-gray-400 text-[13px]">—</span>
                  }
                </div>

                {/* ── 52W range bar ── */}
                <div>
                  <WeekRange52 low={stock.yearLow} high={stock.yearHigh} current={ltp} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer breadcrumb */}
      <div className="bg-gray-50 border-t border-gray-100 mt-auto">
        <div className="max-w-[1280px] mx-auto px-8 py-4 flex items-center gap-2 text-[13px] text-gray-400">
          <span className="hover:text-gray-600 cursor-pointer">Home</span>
          <span>›</span>
          <span className="text-gray-600">Intraday stocks screener</span>
        </div>
      </div>

      {/* Filter panel (full sidebar) */}
      {showPanel && (
        <FilterPanel
          onClose={() => setShowPanel(false)}
          initSection={panelInitSection}
          filterState={filterState}
          setFilterState={setFilterState}
        />
      )}
    </div>
  );
}
