
function RangeBar({ low, high, current }) {
  const pct = Math.min(Math.max(((current - low) / (high - low)) * 100, 0), 100);
  return (
    <div className="relative h-1 bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 rounded-full">
      <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full shadow" style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }} />
    </div>
  );
}
export default function PerformanceSection({ priceData, exchange }) {
  const ex = exchange === "BSE" ? "bse" : "nse";
  const yearLow  = priceData?.[ex]?.yearLowPrice  ?? 0;
  const yearHigh = priceData?.[ex]?.yearHighPrice ?? 0;

  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-1.5">
        Performance
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={1.5} /><path d="M12 16v-4M12 8h.01" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </h2>
      {/* 52w range */}
      <div className="mb-5">
        <div className="flex justify-between text-[12px] mb-1">
          <div><span className="text-gray-400">52 week low</span><p className="font-semibold text-gray-800">{yearLow}</p></div>
          <div className="text-right"><span className="text-gray-400">52 week high</span><p className="font-semibold text-gray-800">{yearHigh}</p></div>
        </div>
        <RangeBar low={yearLow} high={yearHigh} current={(yearLow + yearHigh) / 2} />
        <div className="flex mt-1"><span className="text-[10px] text-gray-500">▲</span></div>
      </div>
    </div>
  );
}