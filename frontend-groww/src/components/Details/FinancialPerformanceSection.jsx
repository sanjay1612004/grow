import { useState, useEffect, useMemo } from "react";

function fmt(n) {
  return Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function fmtAxis(v) {
  if (Math.abs(v) >= 1_00_000) return `${(v / 1_00_000).toFixed(0)}L`;
  if (Math.abs(v) >= 1_000)   return `${(v / 1_000).toFixed(0)}k`;
  return v.toFixed(0);
}

export default function FinancialPerformanceSection({ financialStatement }) {
  const [tab, setTab] = useState("Quarterly");

  const revenueEntry = financialStatement?.find((f) => f.title === "Revenue");
  const profitEntry  = financialStatement?.find((f) => f.title === "Profit");

  // Memoised so useEffect dep is stable
  const data = useMemo(() => {
    const src    = tab === "Quarterly" ? "quarterly" : "yearly";
    const revMap = revenueEntry?.[src] ?? {};
    const profMap = profitEntry?.[src]  ?? {};
    const keys   = Object.keys(revMap);
    const result = {};
    keys.forEach((k) => {
      result[k] = { revenue: revMap[k] ?? 0, profit: profMap[k] ?? 0 };
    });
    return result;
  }, [tab, revenueEntry, profitEntry]);

  const entries = useMemo(() => Object.entries(data), [data]);

  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    setHoveredBar(entries.at(-1)?.[0] ?? null);
  }, [entries]);

  if (!entries.length) return null;

  const activeKey  = hoveredBar ?? entries.at(-1)[0];
  const hovered    = data[activeKey] ?? entries.at(-1)[1];
  const hIdx       = entries.findIndex(([k]) => k === activeKey);
  const prevRev    = hIdx > 0 ? entries[hIdx - 1][1].revenue : null;
  const prevProf   = hIdx > 0 ? entries[hIdx - 1][1].profit  : null;
  const revDiff    = prevRev  ? (((hovered.revenue - prevRev)  / Math.abs(prevRev))  * 100).toFixed(2) : null;
  const profDiff   = prevProf ? (((hovered.profit  - prevProf) / Math.abs(prevProf)) * 100).toFixed(2) : null;

  // Scale: use max of absolute values so negative bars render upward correctly
  const allRevs  = entries.map(([, v]) => v.revenue);
  const allProfs = entries.map(([, v]) => v.profit);
  const maxAbs   = Math.max(...allRevs.map(Math.abs), ...allProfs.map(Math.abs), 1);

  const CHART_H  = 120; // px of drawable bar area

  // Height in px, clamped to 0 minimum, direction handled by flex-end alignment
  const barH = (val) => Math.max(0, (Math.abs(val) / maxAbs) * CHART_H);

  // CAGR
  const revCagr  = revenueEntry?.cagr;
  const profCagr = profitEntry?.cagr;
  const fmtCagr  = (v) => v == null ? "—" : `${v >= 0 ? "+" : ""}${(v * 100).toFixed(0)}%`;
  const cagrColor = (v) =>
    v == null ? "text-gray-500" : v >= 0 ? "text-green-500" : "text-red-500";

  // Y-axis ticks
  const yTicks = [maxAbs, maxAbs * 0.75, maxAbs * 0.5, maxAbs * 0.25, 0];

  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-3">
        Financial performance
      </h2>

      {/* Tab row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {["Quarterly", "Yearly"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[12px] px-3 py-1 rounded-full border font-medium transition-all ${
                tab === t
                  ? "bg-white border-gray-400 text-gray-800 font-semibold"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <a
          href="#"
          className="text-[12px] text-[#44c5a6] font-medium flex items-center gap-0.5"
        >
          All Financials <span className="text-base leading-none">›</span>
        </a>
      </div>

      {/* Chart card */}
      <div className="border border-gray-200 rounded-xl p-4">
        {/* Summary header */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1">
            {activeKey}
          </p>
          <div className="flex items-center gap-6 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gray-400 inline-block" />
              <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                Revenue (CR)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#44c5a6] inline-block" />
              <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                Profit (CR)
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-6">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-bold text-gray-800">
                ₹{fmt(hovered.revenue)}
              </span>
              {revDiff && (
                <span
                  className={`text-[12px] font-semibold ${
                    parseFloat(revDiff) >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {parseFloat(revDiff) >= 0 ? "+" : ""}
                  {revDiff}%
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-bold text-gray-800">
                ₹{fmt(hovered.profit)}
              </span>
              {profDiff && (
                <span
                  className={`text-[12px] font-semibold ${
                    parseFloat(profDiff) >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {parseFloat(profDiff) >= 0 ? "+" : ""}
                  {profDiff}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bar chart + y-axis */}
        <div className="flex gap-2">
          {/* Bars + x-labels */}
          <div className="flex-1 min-w-0">
            {/* Bar area */}
            <div
              className="flex items-end border-b border-dashed border-gray-200"
              style={{ height: CHART_H + 4, gap: 6 }}  // ← smaller gap between groups
            >
              {entries.map(([label, val]) => {
                const isActive = activeKey === label;
                const rh = barH(val.revenue);
                const ph = barH(val.profit);
                return (
                  <div
                    key={label}
                    className="flex-1 flex items-end justify-center cursor-pointer"
                    style={{ height: CHART_H, gap: 2 }}  // ← tight gap between rev+profit pair
                    onMouseEnter={() => setHoveredBar(label)}
                  >
                    {/* Revenue bar — wide */}
                    <div
                      className="rounded-t-sm transition-colors duration-150"
                      style={{
                        height: rh,
                        flex: "0 0 24%",              // ← 60% of the column
                        backgroundColor: isActive ? "#4a5568" : "#c5cdd9",
                        minHeight: rh > 0 ? 2 : 0,
                      }}
                    />
                    {/* Profit bar — half width */}
                    <div
                      className="rounded-t-sm"
                      style={{
                        height: ph,
                        flex: "0 0 28%",              // ← 28% of the column
                        backgroundColor: isActive
                          ? "#38b394"
                          : val.profit < 0 ? "#f87171" : "#44c5a6",  // ← red if negative profit
                        minHeight: ph > 0 ? 2 : 0,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-axis labels — truncate if too many */}
            <div className="flex gap-1 mt-1">
              {entries.map(([label]) => (
                <div key={label} className="flex-1 min-w-0 text-center overflow-hidden">
                  <span
                    className={`block truncate text-[9px] leading-tight ${
                      activeKey === label
                        ? "font-semibold text-gray-700"
                        : "text-gray-400"
                    }`}
                    title={label}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Y-axis ticks */}
          <div
            className="flex flex-col justify-between pb-4 shrink-0"
            style={{ height: CHART_H + 4 }}
          >
            {yTicks.map((v, i) => (
              <span key={i} className="text-[10px] text-gray-400 text-right leading-none">
                {fmtAxis(v)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CAGR table */}
      <div className="grid grid-cols-2 gap-0 mt-3 border border-gray-100 rounded-lg overflow-hidden">
        <div className="border-r border-gray-100">
          <div className="flex justify-between px-4 py-2 bg-gray-50">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Revenue Growth
            </span>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Value
            </span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-t border-gray-100">
            <span className="text-[12px] text-gray-600">1Y (TTM)</span>
            <span className={`text-[12px] font-semibold ${cagrColor(revCagr?.oneYearTtm)}`}>
              {fmtCagr(revCagr?.oneYearTtm)}
            </span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-t border-gray-100">
            <span className="text-[12px] text-gray-600">3Y CAGR</span>
            <span className={`text-[12px] font-semibold ${cagrColor(revCagr?.threeYearCagr)}`}>
              {fmtCagr(revCagr?.threeYearCagr)}
            </span>
          </div>
        </div>
        <div>
          <div className="flex justify-between px-4 py-2 bg-gray-50">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Profit Growth
            </span>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Value
            </span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-t border-gray-100">
            <span className="text-[12px] text-gray-600">1Y (TTM)</span>
            <span className={`text-[12px] font-semibold ${cagrColor(profCagr?.oneYearTtm)}`}>
              {fmtCagr(profCagr?.oneYearTtm)}
            </span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-t border-gray-100">
            <span className="text-[12px] text-gray-600">3Y CAGR</span>
            <span className={`text-[12px] font-semibold ${cagrColor(profCagr?.threeYearCagr)}`}>
              {fmtCagr(profCagr?.threeYearCagr)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}