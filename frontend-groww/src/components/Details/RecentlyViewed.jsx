import { useEffect, useState } from "react";

function StockLogo({ symbol }) {
  const [imgError, setImgError] = useState(false);
//   const src =  `https://assets.tickerlogos.com/logos/${symbol.toUpperCase()}.png`;
  const src=`https://assets-netstorage.groww.in/stock-assets/logos2/${symbol.toUpperCase()}.webp`


  if (imgError) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 select-none">
        {symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={symbol}
      className="w-12 h-12 rounded-full object-cover"
      onError={() => setImgError(true)}
    />
  );
}

function StockChip({ symbol, dayChangePerc }) {
  const isPositive = dayChangePerc >= 0;
  const sign = isPositive ? "+" : "";
  const changeStr = `${sign}${dayChangePerc.toFixed(2)}%`;

  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow duration-150">
        <StockLogo symbol={symbol} />
      </div>
      <span className="text-[11px] font-medium text-gray-700 tracking-wide">
        {symbol}
      </span>
      <span className={`text-[11px] font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}>
        {changeStr}
      </span>
    </div>
  );
}

export default function RecentlyViewed({sname}) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/recently_viewed")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const nseMap = data?.exchangeAggRespMap?.NSE?.priceLivePointsMap ?? {};
        const bseMap = data?.exchangeAggRespMap?.BSE?.priceLivePointsMap ?? {};
        // NSE takes precedence over BSE for same symbol
        const merged = { ...bseMap, ...nseMap };

        const list = Object.values(merged).map((item) => ({
          symbol: item.symbol,
          ltp: item.ltp,
          dayChangePerc: item.dayChangePerc,
          dayChange: item.dayChange,
        }));

        setStocks(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl px-5 py-4">
        <p className="text-md font-semibold text-gray-600 mb-4">Recently viewed</p>
        <div className="flex gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-14 h-2.5 rounded bg-gray-200 animate-pulse" />
              <div className="w-10 h-2.5 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl px-5 py-4">
        <p className="text-sm font-semibold text-gray-800 mb-2">Recently viewed</p>
        <p className="text-xs text-red-500">Failed to load: {error}</p>
      </div>
    );
  }

  if (!stocks.length) return null;

  return (
    <div className="bg-white rounded-xl px-5 py-4">
      <p className="text-lg font-semibold text-gray-700 mb-4">Recently viewed</p>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-1">
        {stocks.map((stock) => (
          <StockChip
            key={stock.symbol}
            symbol={stock.symbol}
            dayChangePerc={stock.dayChangePerc}
          />
        ))}
      </div>
    </div>
  );
}