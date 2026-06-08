function fmt(n) {
  return Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
export default function SimilarStocksSection({ similarAssets }) {
  const peers = similarAssets?.peerList ?? [];
  if (!peers.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-4">Similar stocks</h2>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_0.8fr] items-center px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500">
          <span>Stock</span>
          <span className="flex items-center gap-0.5">Mkt price <span>▼</span></span>
          <span>52 week performance</span>
          <span className="flex items-center gap-0.5">Market cap <span>▼</span></span>
          <span>P/E</span>
        </div>
        {peers.map((p, i) => {
          const low   = p.nseYearLow  ?? 0;
          const high  = p.nseYearHigh ?? 0;
          const ltp   = p.ltp ?? ((low + high) / 2);
          const pct   = high > low ? ((ltp - low) / (high - low)) * 100 : 50;
          const mcap  = p.marketCap ? `${(p.marketCap).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "—";
          const h     = p.companyHeader;
          return (
            <div key={i} className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_0.8fr] items-center px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <img src={h.logoUrl} alt={h.shortName} className="w-8 h-8 rounded-md object-contain bg-white border border-gray-100 flex-shrink-0" onError={(e) => { e.target.style.display = "none"; }} />
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">{h.displayName}</p>
                  <p className="text-[11px] text-gray-400">{h.nseScriptCode}</p>
                </div>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-800">{ltp ? `₹${fmt(ltp)}` : "—"}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <span>L</span>
                <div className="relative flex-1 h-0.5 bg-gray-300 rounded-full mx-1" style={{ minWidth: 60 }}>
                  <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-600 rounded-full" style={{ left: `${Math.min(Math.max(pct, 0), 100)}%`, transform: "translate(-50%,-50%)" }} />
                </div>
                <span className="mr-3">H</span>
              </div>
              <span className="text-[12px] text-gray-700">{mcap}</span>
              <span className="text-[12px] text-gray-700">{p.peRatio ?? "—"}</span>
            </div>
          );
        })}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="h-1 bg-gray-200 rounded-full"><div className="h-full w-4/5 bg-gray-400 rounded-full" /></div>
        </div>
        <div className="px-4 py-2">
          <a href="#" className="text-[12px] text-gray-700 font-semibold flex items-center gap-0.5 border-b-2 border-dashed border-gray-300 w-fit">See more <span className="text-base leading-none">›</span></a>
        </div>
      </div>
    </div>
  );
}