import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { Link2, Bell, Bookmark, SlidersHorizontal, ChevronRight, Calendar } from "lucide-react";

// ─── Backend proxy API map (routes through localhost:8000 to avoid CORS) ──────
// Express proxy must spoof Groww headers: x-app-id, x-device-type, x-platform, Origin, Referer


// For "All" period the candle format is [ts, open, high, low, close, volume]
// For all others: [ts, price]
const TABS = ["1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "5Y", "All"];

// ─── Exchange toggle ──────────────────────────────────────────────────────────
const EXCHANGES = ["NSE", "BSE"];

// ─── Tooltip date formatters per period ──────────────────────────────────────
function formatTooltipDate(ts, period) {
  const d = new Date(ts);
  if (period === "1D") {
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  if (["1W", "1M"].includes(period)) {
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
      ", " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function StockDashboard({sname,lname}) {
  const [activeTab, setActiveTab] = useState("1D");
  const [exchange, setExchange] = useState("NSE");
  const [chartData, setChartData] = useState([]);
  const [closingPrice, setClosingPrice] = useState(null);
  const [changeValue, setChangeValue] = useState(null);
  const [changePerc, setChangePerc] = useState(null);
  const [basePrice, setBasePrice] = useState(null);   // first candle price for % calc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  const PERIOD_API = {
  "1D":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/${sname}/daily?intervalInMinutes=5&minimal=true`,
  "1W":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/${sname}/weekly?intervalInMinutes=5&minimal=true`,
  "1M":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/${sname}/monthly?/v2?months=1&minimal=true`,
  "3M":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/${sname}/monthly?/v2?months=3&minimal=true`,
  "6M":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/${sname}/monthly?/v2?months=6&minimal=true`,
  "1Y":  "https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/BSE/1y?intervalInDays=1&minimal=true",
  "3Y":  "https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/BSE/3y?intervalInDays=1&minimal=true",
  "5Y":  "https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/BSE/5y?intervalInDays=1&minimal=true",
  "All": "https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/BSE/all?noOfCandles=300",
};

  // Hover state for crosshair tooltip
  const [hoveredPoint, setHoveredPoint] = useState(null); // { price, ts }

  // ─── Fetch chart data ───────────────────────────────────────────────────────
  const fetchData = useCallback(async (tab) => {
    setLoading(true);
    setError(false);
    setHoveredPoint(null);
    try {
      const res = await fetch(PERIOD_API[tab]);
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();

      const raw = json.candles || [];
      let formatted;

      // "All" endpoint returns OHLCV: [ts, open, high, low, close, vol]
      if (tab === "All" && raw.length > 0 && raw[0].length >= 5) {
        formatted = raw.map(c => [c[0] * 1000, c[4]]); // use close price
      } else {
        formatted = raw.map(c => [c[0] * 1000, c[1]]);
      }

      setChartData(formatted);
      setClosingPrice(json.closingPrice ?? null);
      setChangeValue(json.changeValue ?? null);
      setChangePerc(json.changePerc ?? null);
      setBasePrice(formatted.length > 0 ? formatted[0][1] : null);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  // ─── Derived values ─────────────────────────────────────────────────────────
  const latestPrice = chartData.length > 0 ? chartData[chartData.length - 1][1] : 0;
  const displayPrice = hoveredPoint ? hoveredPoint.price : latestPrice;

  // Compute change from first candle to current displayed point
  const computedChange = (() => {
    if (!basePrice || basePrice === 0) return { val: changeValue, perc: changePerc };
    const ref = hoveredPoint ? hoveredPoint.price : latestPrice;
    const val = ref - basePrice;
    const perc = (val / basePrice) * 100;
    return { val, perc };
  })();

  const isPositive = (computedChange.val ?? 0) >= 0;
  const themeColor = isPositive ? "#00b386" : "#eb5b3c";

  // ─── ApexCharts config ──────────────────────────────────────────────────────
  const chartOptions = {
    chart: {
      id: "groww-chart-" + activeTab,
      type: "area",
      background: "#fff",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 350,
        dynamicAnimation: { enabled: true, speed: 350 },
      },
      parentHeightOffset: 0,
      events: {
        // mouseMove: (_e, _ctx, config) => {
        //   if (
        //     config.dataPointIndex >= 0 &&
        //     config.dataPointIndex < chartData.length
        //   ) {
        //     const pt = chartData[config.dataPointIndex];
        //     setHoveredPoint({ price: pt[1], ts: pt[0] });
        //   }
        // },
        mouseLeave: () => setHoveredPoint(null),
      },
    },
    colors: [themeColor],
    stroke: {
  curve: "smooth",
  width: 2.5,
},

fill: {
  type: "gradient",
  gradient: {
    shadeIntensity: 1,
    opacityFrom: 0.18,
    opacityTo: 0,
    stops: [0, 90, 100],
  },
},
    xaxis: {
      type: "datetime",
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      
      tooltip: { enabled: false },
    },
    yaxis: {
      show: false,
      min: (min) => min * 0.9985,
      max: (max) => max * 1.0015,
    },
    grid: {
  show: false,
},
    dataLabels: { enabled: false },
    markers: {
      size: 0,
      hover: {
        size: 5,
        sizeOffset: 2,
        fillColor: themeColor,
        strokeColor: "#fff",
        strokeWidth: 2,
      },
    },
    tooltip: {
      enabled: true,
      followCursor: false,
      intersect: false,
      shared: false,
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const val = series[seriesIndex][dataPointIndex];
        if (val == null) return "";
        const ts = chartData[dataPointIndex]?.[0];
        const dateStr = ts ? formatTooltipDate(ts, activeTab) : "";
        return `
          <div style="
            background:#fff;
            border:none;
            padding:0;
            font-family:inherit;
            font-size:12px;
            color:#444;
            white-space:nowrap;
            box-shadow:none;
            pointer-events:none;
          ">
            <span style="font-weight:600;color:#111">₹${Number(val).toFixed(2)}</span>
            <span style="color:#888;margin-left:6px">| ${dateStr}</span>
          </div>`;
      },
      x: { show: false },
      marker: { show: false },
    },
    annotations: {
      yaxis: closingPrice
        ? [
            {
              y: closingPrice,
              borderColor: "#bbb",
              strokeDashArray: 5,
              borderWidth: 1,
              label: { show: false },
            },
          ]
        : [],
    },
    legend: { show: false },
  };

  const chartSeries = [{ name: "Price", data: chartData }];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white font-sans">
      {/* ── Main layout ── */}
      <div className="mx-auto w-full max-w-[1230px] px-4 py-7 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[800px_384px] lg:gap-16">

          {/* ── LEFT: Chart Panel ── */}
          <div className="min-w-0 bg-white">
            
            {/* Stock header row */}
            <div className="pt-3">
              <div className="flex items-start justify-between">

                {/* Left: logo + info + price */}
                <div>
                  {/* Logo */}
                  <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <img
                      src={`https://assets-netstorage.groww.in/stock-assets/logos2/${sname}.webp`}
                      alt="BSE"
                      className="h-full w-full object-cover"
                      onError={e => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML =
                          '<span class="text-amber-700 font-bold text-lg">B</span>';
                      }}
                    />
                  </div>

                  <div>
                    {/* Ticker + exchange switcher */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm font-medium uppercase text-[#6d7487]">
                        {sname}
                      </span>
                      <span className="text-sm text-[#6d7487]">•</span>
                      {/* Exchange toggle */}
                      <button
                        onClick={() => setExchange(ex => ex === "NSE" ? "BSE" : "NSE")}
                        className="flex items-center gap-0.5 group"
                      >
                        <span className="text-sm font-medium text-[#6d7487] transition-colors group-hover:text-gray-700">
                          {exchange}
                        </span>
                        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className="text-gray-400 group-hover:text-gray-600 transition-colors mt-px">
                          <path d="M5 1L2 4h6L5 1z" fill="currentColor"/>
                          <path d="M5 13L8 10H2l3 3z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>

                    {/* Company name */}
                    <h1 className="mt-2 text-[22px] font-semibold leading-tight text-[#2f3447]">{lname}</h1>

                    {/* Price + change */}
                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className="text-[24px] font-semibold tracking-tight text-[#2f3447]">
                        ₹{displayPrice > 0 ? Number(displayPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
                      </span>
                      {computedChange.val != null && (
                        <span className={`text-sm font-medium ${isPositive ? "text-[#00b386]" : "text-[#eb5b3c]"}`}>
                          {isPositive ? "+" : ""}
                          {Number(computedChange.val).toFixed(2)}
                          {" "}
                          ({isPositive ? "+" : ""}{Number(computedChange.perc).toFixed(2)}%)
                          {" "}
                          <span className="font-normal text-[#6d7487]">{activeTab}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: action buttons */}
                <div className="mt-1 flex items-center gap-4">
                  {[
                    { Icon: Link2, label: "Copy link" },
                    { Icon: Bell, label: "Alert" },
                    { Icon: Bookmark, label: "Watchlist" },
                  ].map(({ Icon, label }) => (
                    <button
                      key={label}
                      title={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-[#444b64] transition-all hover:border-gray-300 hover:bg-gray-50"
                    >
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="relative mt-24 ">
              {loading ? (
                <div className="flex h-[340px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: `${themeColor} transparent transparent transparent` }}
                    />
                    <span className="text-xs text-gray-400">Loading chart...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex h-[340px] items-center justify-center text-sm text-gray-400">
                  Failed to load chart.{" "}
                  <button
                    onClick={() => fetchData(activeTab)}
                    className="ml-1 text-[#00b386] underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type="area"
                  height={340}
                />
              )}
            </div>

            {/* Period tabs row */}
            <div className="flex items-center justify-between border-t border-gray-50 pb-4 pt-1">
              {/* Period pills */}
              <div className="flex items-center gap-1">
                {TABS.map(tab => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-150
                        ${isActive
                          ? "bg-white border-gray-400 text-gray-900 shadow-sm"
                          : "bg-transparent border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50"
                        }
                      `}
                    >
                      {tab}
                    </button>
                  );
                })}

                {/* Candlestick / bar chart icon */}
                <button
                  className="ml-1 px-2.5 py-1.5 rounded-full text-[12px] font-semibold border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1"
                  title="Chart type"
                >
                  {/* Candlestick icon (3 bars) */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="2" y="4" width="2" height="7" rx="0.5" fill="currentColor"/>
                    <rect x="1" y="5.5" width="4" height="1" rx="0.5" fill="currentColor"/>
                    <rect x="6" y="2" width="2" height="9" rx="0.5" fill="currentColor"/>
                    <rect x="5" y="4" width="4" height="1" rx="0.5" fill="currentColor"/>
                    <rect x="10" y="5" width="2" height="6" rx="0.5" fill="currentColor"/>
                    <rect x="9" y="7" width="4" height="1" rx="0.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>

              {/* Terminal button */}
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                Terminal
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 2L4 5h5L6.5 2z" fill="currentColor"/>
                  <path d="M6.5 11L9 8H4l2.5 3z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            {/* Create Stock SIP row */}
            <div className="mb-5 border-t border-gray-100">
              <button className="w-full flex items-center justify-between py-4 group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-[#00b386]" />
                  </div>
                  <span className="text-[14px] font-semibold text-gray-800">Create Stock SIP</span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* ── RIGHT: CTA Panel ── */}
          <aside className="rounded-lg border border-gray-200 bg-white px-5 pb-5 pt-4 lg:mt-0">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/newToStocks.b40891fd.svg"
                alt=""
                className="mb-5 h-[92px] w-[132px] object-contain"
              />
              <h2 className="text-base font-semibold text-[#2f3447]">
                Looking to invest in Stocks?
              </h2>
              <p className="mt-6 text-sm text-[#6d7487]">
                Create your demat account on Groww in 2 minutes
              </p>
              <button className="mt-6 h-10 w-full rounded-md bg-[#00b386] text-xs font-bold text-white transition-colors hover:bg-[#009973]">
                UNLOCK STOCKS
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
