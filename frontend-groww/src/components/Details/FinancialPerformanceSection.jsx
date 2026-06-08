import { useState,useEffect } from "react";

function fmt(n) {
  return Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
export default function FinancialPerformanceSection({ financialStatement }) {
  const [tab, setTab] = useState("Quarterly");

  // Build data maps from API response
  const revenueEntry = financialStatement?.find(f => f.title === "Revenue");
  const profitEntry  = financialStatement?.find(f => f.title === "Profit");

  const buildData = (type) => {
    const src = type === "Quarterly" ? "quarterly" : "yearly";
    const revMap  = revenueEntry?.[src] ?? {};
    const profMap = profitEntry?.[src]  ?? {};
    const keys    = Object.keys(revMap);
    const result  = {};
    keys.forEach(k => { result[k] = { revenue: revMap[k] ?? 0, profit: profMap[k] ?? 0 }; });
    return result;
  };

  const data    = buildData(tab);
  const entries = Object.entries(data);

  const lastKey = entries.at(-1)?.[0];
  const [hoveredBar, setHoveredBar] = useState(lastKey);

  useEffect(() => {
    setHoveredBar(Object.keys(buildData(tab)).at(-1));
  }, [tab, financialStatement]);

  if (!entries.length) return null;

  const hovered  = data[hoveredBar] || entries.at(-1)[1];
  const hLabel   = hoveredBar && data[hoveredBar] ? hoveredBar : entries.at(-1)[0];
  const hIdx     = entries.findIndex(([k]) => k === hLabel);
  const prevRev  = hIdx > 0 ? entries[hIdx - 1][1].revenue : null;
  const prevProf = hIdx > 0 ? entries[hIdx - 1][1].profit  : null;
  const revDiff  = prevRev  ? (((hovered.revenue - prevRev)  / prevRev)  * 100).toFixed(2) : null;
  const profDiff = prevProf ? (((hovered.profit  - prevProf) / prevProf) * 100).toFixed(2) : null;
  const maxRev   = Math.max(...entries.map(([, v]) => v.revenue));

  // CAGR values from API
  const revCagr  = revenueEntry?.cagr;
  const profCagr = profitEntry?.cagr;
  const fmtCagr  = (v) => v == null ? "—" : `${v >= 0 ? "+" : ""}${(v * 100).toFixed(0)}%`;
  const cagrColor = (v) => (v == null ? "text-gray-500" : v >= 0 ? "text-green-500" : "text-red-500");

  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-3">Financial performance</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {["Quarterly", "Yearly"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[12px] px-3 py-1 rounded-full border font-medium transition-all ${tab === t ? "bg-white border-gray-400 text-gray-800 font-semibold" : "border-gray-200 text-gray-400"}`}
            >{t}</button>
          ))}
        </div>
        <a href="#" className="text-[12px] text-[#44c5a6] font-medium flex items-center gap-0.5">All Financials <span className="text-base leading-none">›</span></a>
      </div>

      <div className="border border-gray-200 rounded-xl p-4">
        <div className="mb-3">
          <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1">{hLabel}</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gray-400 inline-block" />
              <span className="text-[11px] text-gray-500 uppercase tracking-wide">Revenue (CR)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#44c5a6] inline-block" />
              <span className="text-[11px] text-gray-500 uppercase tracking-wide">Profit (CR)</span>
            </div>
          </div>
          <div className="flex items-baseline gap-6 mt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-bold text-gray-800">₹{fmt(hovered.revenue)}</span>
              {revDiff && <span className={`text-[12px] font-semibold ${parseFloat(revDiff) >= 0 ? "text-green-500" : "text-red-500"}`}>{parseFloat(revDiff) >= 0 ? "+" : ""}{revDiff}%</span>}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-bold text-gray-800">₹{fmt(hovered.profit)}</span>
              {profDiff && <span className={`text-[12px] font-semibold ${parseFloat(profDiff) >= 0 ? "text-green-500" : "text-red-500"}`}>{parseFloat(profDiff) >= 0 ? "+" : ""}{profDiff}%</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <div className="flex items-end gap-3 border-b border-dashed border-gray-200" style={{ height: 140 }}>
              {entries.map(([label, val]) => {
                const revH  = (val.revenue / maxRev) * 120;
                const profH = (val.profit  / maxRev) * 120;
                const isActive = hoveredBar === label;
                return (
                  <div key={label} className="flex flex-col items-end gap-0 flex-1 cursor-pointer" onMouseEnter={() => setHoveredBar(label)} style={{ height: 120, justifyContent: "flex-end" }}>
                    <div className="flex items-end gap-0.5 w-full justify-center">
                      <div className="rounded-t-sm transition-colors" style={{ height: revH, width: 18, backgroundColor: isActive ? "#4a5568" : "#c5cdd9" }} />
                      <div className="rounded-t-sm" style={{ height: profH, width: 10, backgroundColor: isActive ? "#38b394" : "#44c5a6" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 mt-1">
              {entries.map(([label]) => (
                <div key={label} className="flex-1 text-center">
                  <span className={`text-[10px] ${hoveredBar === label ? "font-semibold text-gray-700" : "text-gray-400"}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between" style={{ height: 140 }}>
            {[maxRev, maxRev * 0.75, maxRev * 0.5, maxRev * 0.25, 0].map((v, i) => (
              <span key={i} className="text-[10px] text-gray-400 text-right leading-none">
                {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-0 mt-3 border border-gray-100 rounded-lg overflow-hidden">
        <div className="border-r border-gray-100">
          <div className="flex justify-between px-4 py-2 bg-gray-50">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Revenue Growth</span>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Value</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-t border-gray-100">
            <span className="text-[12px] text-gray-600">1Y (TTM)</span>
            <span className={`text-[12px] font-semibold ${cagrColor(revCagr?.oneYearTtm)}`}>{fmtCagr(revCagr?.oneYearTtm)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-t border-gray-100">
            <span className="text-[12px] text-gray-600">3Y CAGR</span>
            <span className={`text-[12px] font-semibold ${cagrColor(revCagr?.threeYearCagr)}`}>{fmtCagr(revCagr?.threeYearCagr)}</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between px-4 py-2 bg-gray-50">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Profit Growth</span>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Value</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-t border-gray-100">
            <span className="text-[12px] text-gray-600">1Y (TTM)</span>
            <span className={`text-[12px] font-semibold ${cagrColor(profCagr?.oneYearTtm)}`}>{fmtCagr(profCagr?.oneYearTtm)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-t border-gray-100">
            <span className="text-[12px] text-gray-600">3Y CAGR</span>
            <span className={`text-[12px] font-semibold ${cagrColor(profCagr?.threeYearCagr)}`}>{fmtCagr(profCagr?.threeYearCagr)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}