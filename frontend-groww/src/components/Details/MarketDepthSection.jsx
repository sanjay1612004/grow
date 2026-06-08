export default function MarketDepthSection({ bidOrders, askOrders }) {
  if (!bidOrders || !askOrders) return null;
  const totalBid = bidOrders.reduce((s, o) => s + o.qty, 0);
  const totalAsk = askOrders.reduce((s, o) => s + o.qty, 0);
  const total    = totalBid + totalAsk;
  const buyPct   = total > 0 ? ((totalBid / total) * 100).toFixed(2) : 0;
  const sellPct  = total > 0 ? ((totalAsk / total) * 100).toFixed(2) : 0;
  const maxBidQty = Math.max(...bidOrders.map(o => o.qty));
  const maxAskQty = Math.max(...askOrders.map(o => o.qty));
  const totalBidQty = bidOrders.reduce((s, o) => s + o.qty, 0).toLocaleString("en-IN");
  const totalAskQty = askOrders.reduce((s, o) => s + o.qty, 0).toLocaleString("en-IN");

  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-4">Market depth</h2>
      <div className="flex justify-between text-xs mb-1">
        <div>
          <span className="text-gray-500">Buy orders</span>
          <p className="text-[13px] font-semibold text-green-600">{buyPct}%</p>
        </div>
        <div className="text-right">
          <span className="text-gray-500">Sell orders</span>
          <p className="text-[13px] font-semibold text-red-500">{sellPct}%</p>
        </div>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden mb-5">
        <div className="bg-green-500 rounded-l-full" style={{ width: `${buyPct}%` }} />
        <div className="bg-red-400 rounded-r-full flex-1" />
      </div>
      <div className="grid grid-cols-2 gap-0 text-[12px]">
        <div className="flex justify-between text-gray-400 pb-2 border-b border-gray-100 pr-4"><span>Bid Price</span><span>Qty</span></div>
        <div className="flex justify-between text-gray-400 pb-2 border-b border-gray-100 pl-4"><span>Ask Price</span><span>Qty</span></div>
        {bidOrders.map((o, i) => (
          <>
            <div key={`bid-${i}`} className="flex justify-between items-center py-1.5 pr-4 border-b border-gray-50">
              <span className="text-gray-700">{Number(o.price).toFixed(2)}</span>
              <div className="relative flex items-center justify-end">
                <div className="absolute right-0 h-5 rounded-sm opacity-20 bg-green-500" style={{ width: `${(o.qty / maxBidQty) * 60}px` }} />
                <span className="relative text-green-600 font-medium">{o.qty.toLocaleString()}</span>
              </div>
            </div>
            <div key={`ask-${i}`} className="flex justify-between items-center py-1.5 pl-4 border-b border-gray-50">
              <span className="text-gray-700">{Number(askOrders[i].price).toFixed(2)}</span>
              <div className="relative flex items-center justify-end">
                <div className="absolute right-0 h-5 rounded-sm opacity-20 bg-red-400" style={{ width: `${(askOrders[i].qty / maxAskQty) * 60}px` }} />
                <span className="relative text-red-500 font-medium">{askOrders[i].qty.toLocaleString()}</span>
              </div>
            </div>
          </>
        ))}
        <div className="flex justify-between py-2 pr-4 font-semibold text-[12px]">
          <span className="text-gray-700">Bid Total</span><span className="text-gray-700">{totalBidQty}</span>
        </div>
        <div className="flex justify-between py-2 pl-4 font-semibold text-[12px]">
          <span className="text-gray-700">Ask Total</span><span className="text-gray-700">{totalAskQty}</span>
        </div>
      </div>
    </div>
  );
}