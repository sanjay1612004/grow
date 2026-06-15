import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { Link2, Bell, Bookmark, ChevronRight, Calendar, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserBalance } from "../../App";
import { buyStockApi, sellStockApi } from "../../utils/stockApi";
import axios from "axios";

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

export default function StockDashboard({sname,lname,logo,bname}) {
  const [activeTab, setActiveTab] = useState("1D");
  const [exchange, setExchange] = useState("NSE");
  const [chartData, setChartData] = useState([]);
  const [closingPrice, setClosingPrice] = useState(null);
  const [changeValue, setChangeValue] = useState(null);
  const [changePerc, setChangePerc] = useState(null);
  const [basePrice, setBasePrice] = useState(null);   // first candle price for % calc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const[SE,setSE]=useState("NSE")
  const navigate=useNavigate()
  const { balance, setBalance } = useContext(UserBalance);
  const [orderSide, setOrderSide] = useState("BUY");
  const [quantity, setQuantity] = useState("");
  const [priceMode, setPriceMode] = useState("Market");
  const [limitPrice, setLimitPrice] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [kycStatus, setKycStatus] = useState(null);
  const [loadingKyc, setLoadingKyc] = useState(true);

  console.log(SE)

  const symbol = exchange === "NSE" ? sname : bname;
  const PERIOD_API = {
  "1D":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/${exchange}/segment/CASH/${symbol}/daily?intervalInMinutes=1&minimal=true`,
  "1W":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/${exchange}/segment/CASH/${symbol}/weekly?intervalInMinutes=5&minimal=true`,
  "1M":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/${exchange}/segment/CASH/${symbol}/monthly?/v2?months=1&minimal=true`,
  "3M":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/${exchange}/segment/CASH/${symbol}/monthly?/v2?months=3&minimal=true`,
  "6M":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/${exchange}/segment/CASH/${symbol}/monthly?/v2?months=6&minimal=true`,
  "1Y":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/${exchange}/segment/CASH/${symbol}/1y?intervalInDays=1&minimal=true`,
  "3Y":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/${exchange}/segment/CASH/${symbol}/3y?intervalInDays=1&minimal=true`,
  "5Y":  `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/${exchange}/segment/CASH/${symbol}/5y?intervalInDays=1&minimal=true`,
  "All": `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/${exchange}/segment/CASH/${symbol}/all?noOfCandles=300`,
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
  }, [exchange,sname]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData,exchange]);

  // ── Fetch KYC status ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          setLoadingKyc(false);
          return;
        }
        const res = await axios.get(
          `https://j9cw5kv2-5000.inc1.devtunnels.ms/api/kyc/me?userId=${storedUserId}`
        );
        const kycDetails = res.data?.message || res.data?.data || res.data;
        const status = (kycDetails?.kycStatus || kycDetails?.status || "").toString().toUpperCase();
        setKycStatus(status);
      } catch (err) {
        console.error("KYC status fetch error:", err);
      } finally {
        setLoadingKyc(false);
      }
    };
    fetchKycStatus();
  }, []);

  // ─── Derived values ─────────────────────────────────────────────────────────
  const latestPrice = chartData.length > 0 ? chartData[chartData.length - 1][1] : 0;
  const displayPrice = hoveredPoint ? hoveredPoint.price : latestPrice;
  const orderPrice = priceMode === "Market" ? Number(displayPrice || 0) : Number(limitPrice || 0);
  const approxRequired = Number(quantity || 0) * Number(orderPrice || 0);
  const hasEnoughBalance = orderSide === "SELL" || Number(balance || 0) >= approxRequired;

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

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setOrderMessage("Please login to continue");
      return;
    }

    if (!symbol || !lname) {
      setOrderMessage("Stock details are not available");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setOrderMessage("Enter quantity");
      return;
    }

    if (!orderPrice || Number(orderPrice) <= 0) {
      setOrderMessage("Price is not available");
      return;
    }

    if (orderSide === "BUY" && !hasEnoughBalance) {
      setOrderMessage("Available amount is not enough");
      return;
    }

    try {
      setOrderLoading(true);
      setOrderMessage("");

      const payload = {
        userId,
        symbol,
        companyName: lname,
        quantity: Number(quantity),
        price: Number(orderPrice),
      };

      const result = orderSide === "BUY"
        ? await buyStockApi(payload)
        : await sellStockApi(payload);

      if (result.success) {
        setOrderMessage(orderSide === "BUY" ? "Stock bought successfully" : "Stock sold successfully");
        setQuantity("");

        if (result.data?.walletBalance !== undefined) {
          setBalance(result.data.walletBalance);
        }
      } else {
        setOrderMessage(result.message || "Order failed");
      }
    } catch (err) {
      setOrderMessage(err.response?.data?.message || "Order failed");
    } finally {
      setOrderLoading(false);
    }
  };

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
                      src={logo}
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
                          <path d="M5 1L2 4h6L5 1z" fill="currentColor" />
                          <path d="M5 13L8 10H2l3 3z" fill="currentColor" />
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
            <div className="relative mt-24">
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
            <div className="mb-5 border border-gray-300 px-2 rounded-md">
              <button className="w-full flex items-center justify-between py-4 group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-gray-300">
                    <Calendar size={24} className="text-[#00b386]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="text-[16px] font-semibold text-gray-800 leading-none">
                      Create Stock SIP
                    </h3>

                    <p className="text-[14px] text-gray-500 mt-2">
                      Automate your investments in this Stock
                    </p>
                  </div>

                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* ── RIGHT: Order Ticket (KYC approved) or Unlock Stocks card ── */}
          {loadingKyc ? (
            <aside className="min-h-[540px] rounded-sm border border-gray-200 bg-white lg:sticky lg:top-20 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Loading...</p>
            </aside>
          ) : kycStatus === "APPROVED" ? (
          <aside className="min-h-[540px] rounded-sm border border-gray-200 bg-white lg:sticky lg:top-20">
            <div className="px-4 pb-3 pt-4">
              <h2 className="text-[15px] font-bold text-[#444b64]">{lname || symbol}</h2>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-[#6d7487]">
                <span>NSE ₹{Number(displayPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span>BSE ₹{Number(displayPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <button className="border-b border-[#444b64] font-semibold text-[#444b64]">Depth</button>
              </div>
            </div>

            <div className="grid grid-cols-2 border-y border-gray-200">
              {["BUY", "SELL"].map((side) => (
                <button
                  key={side}
                  onClick={() => {
                    setOrderSide(side);
                    setOrderMessage("");
                  }}
                  className={`relative h-12 text-[13px] font-bold ${
                    orderSide === side ? "text-[#00b386]" : "text-[#444b64]"
                  }`}
                >
                  {side}
                  {orderSide === side && (
                    <span className="absolute bottom-0 left-4 right-4 h-[3px] rounded-t bg-[#00b386]" />
                  )}
                </button>
              ))}
            </div>

            <div className="px-4 py-5">
              <div className="flex items-center gap-2">
                {["Delivery", "Intraday", "MTF 2.76x"].map((item, index) => (
                  <button
                    key={item}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                      index === 0
                        ? "border-[#444b64] text-[#444b64]"
                        : "border-gray-200 bg-gray-50 text-[#6d7487]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <button className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#6d7487]">
                  <Settings size={15} />
                </button>
              </div>

              <div className="mt-9 space-y-5">
                <div className="grid grid-cols-[1fr_126px] items-center gap-4">
                  <label className="text-[13px] font-medium text-[#444b64]">
                    Qty {exchange}
                    <span className="ml-1 text-[#6d7487]">↕</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-8 rounded-sm border border-[#444b64] bg-white px-2 text-right text-[14px] font-semibold text-[#444b64] outline-none focus:border-[#f2c94c] focus:ring-1 focus:ring-[#f2c94c]"
                  />
                </div>

                <div className="grid grid-cols-[1fr_126px] items-center gap-4">
                  <button
                    onClick={() => {
                      setPriceMode((mode) => mode === "Market" ? "Limit" : "Market");
                      setLimitPrice(displayPrice ? Number(displayPrice).toFixed(2) : "");
                      setOrderMessage("");
                    }}
                    className="text-left text-[13px] font-medium text-[#444b64]"
                  >
                    Price {priceMode}
                    <span className="ml-1 text-[#6d7487]">↕</span>
                  </button>

                  {priceMode === "Market" ? (
                    <div className="flex h-8 items-center justify-end rounded-sm border border-gray-100 bg-gray-50 px-2 text-[13px] font-semibold text-[#444b64]">
                      At market
                    </div>
                  ) : (
                    <input
                      type="number"
                      min="1"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      className="h-8 rounded-sm border border-[#444b64] bg-white px-2 text-right text-[14px] font-semibold text-[#444b64] outline-none focus:border-[#f2c94c] focus:ring-1 focus:ring-[#f2c94c]"
                    />
                  )}
                </div>
              </div>

              <div className="mt-36">
                {orderMessage && (
                  <div className={`mb-4 rounded-sm px-3 py-3 text-center text-xs ${
                    orderMessage.includes("successfully")
                      ? "bg-[#e6f7f3] text-[#00b386]"
                      : "bg-[#faf2de] text-[#444b64]"
                  }`}>
                    {orderMessage}
                  </div>
                )}

                {!hasEnoughBalance && orderSide === "BUY" && !orderMessage && (
                  <div className="mb-4 rounded-sm bg-[#faf2de] px-3 py-3 text-center text-xs text-[#444b64]">
                    Available amount is not enough
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-[#6d7487]">
                  <span>Balance : ₹{Number(balance || 0).toLocaleString("en-IN")}</span>
                  <span>Approx req. : ₹{Number(approxRequired || 0).toLocaleString("en-IN")}</span>
                </div>

                <button
                  onClick={hasEnoughBalance || orderSide === "SELL" ? handlePlaceOrder : () => navigate("/user/balance/inr")}
                  disabled={orderLoading}
                  className="mt-4 h-11 w-full rounded-md bg-[#00b386] text-[15px] font-bold text-white transition-colors hover:bg-[#009973] disabled:bg-gray-300"
                >
                  {orderLoading ? "Processing..." : !hasEnoughBalance && orderSide === "BUY" ? "Add money" : orderSide === "BUY" ? "Buy" : "Sell"}
                </button>
              </div>
            </div>
          </aside>
          ) : (
            <aside className="lg:sticky lg:top-20 flex items-center justify-center">
              <div className="rounded-xl border border-gray-200 bg-white px-8 py-10 flex flex-col items-center text-center shadow-sm max-w-[400px] w-full">
                <img
                  src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/default.b40891fd.svg"
                  alt="Invest in Stocks"
                  className="w-46 h-46 mb-6"
                />
                <h3 className="text-[17px] font-bold text-gray-800 mb-2">Looking to invest in Stocks?</h3>
                <p className="text-[13px] text-gray-500 mb-6">Create your demat account on Groww in 2 minutes</p>
                <button
                  onClick={() => navigate('/kyc')}
                  className="w-full h-11 rounded-lg bg-[#00b386] text-[15px] font-bold text-white transition-colors hover:bg-[#009973] uppercase tracking-wide"
                >
                  Unlock Stocks
                </button>
              </div>
            </aside>
          )}

        </div>
      </div>
    </div>
  );
}
