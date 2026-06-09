import { useState, useEffect } from "react";

const TABS = [
  { label: "Daily",   value: "DAILY"   },
  { label: "Weekly",  value: "WEEKLY"  },
  { label: "Monthly", value: "MONTHLY" },
];

const PERIOD_LABEL = {
  DAILY:   "LAST 5 DAYS",
  WEEKLY:  "LAST 5 WEEKS",
  MONTHLY: "LAST 5 MONTHS",
};

function formatIndian(num) {
  if (num === null || num === undefined || isNaN(num)) return "—";
  const n = Math.round(Number(num));
  const str = String(n);
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  if (!rest) return lastThree;
  const groups = [];
  let i = rest.length;
  while (i > 0) {
    groups.unshift(rest.slice(Math.max(0, i - 2), i));
    i -= 2;
  }
  return groups.join(",") + "," + lastThree;
}

function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k];
  }
  return null;
}

const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun",
                     "Jul","Aug","Sep","Oct","Nov","Dec"];

function formatBarLabel(dateStr, periodType) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  if (periodType === "MONTHLY") return MONTH_SHORT[d.getMonth()];
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

function BarChart({ data }) {
  if (!data?.length) return null;
  const maxVal = Math.max(...data.map((d) => d.total), 1);
  const CHART_H = 90;
  const BAR_W = 14;

  return (
    <div className="flex items-end gap-3" style={{ height: CHART_H + 28 }}>
      {data.map((d, i) => {
        const totalH = Math.max(4, (d.total    / maxVal) * CHART_H);
        const delivH = Math.max(4, (d.delivery / maxVal) * CHART_H);
        return (
          <div key={i} className="flex flex-col items-center gap-0">
            <div className="flex items-end gap-[3px]">
              <div className="rounded-sm" style={{ width: BAR_W, height: totalH, background: "#7b80e8" }} />
              <div className="rounded-sm" style={{ width: BAR_W, height: delivH, background: "#6ecff6" }} />
            </div>
            <span className="text-[10px] text-gray-400 mt-1.5 whitespace-nowrap">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-2 mb-5">
        {[1,2,3].map(i => <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"/>)}
      </div>
      <div className="border border-gray-200 rounded-xl p-5 space-y-5">
        <div className="h-3 w-24 bg-gray-200 rounded"/>
        <div className="flex justify-between items-end">
          <div className="space-y-3 w-48">
            <div className="h-3 bg-gray-200 rounded"/>
            <div className="h-3 bg-gray-200 rounded"/>
            <div className="h-3 bg-gray-200 rounded w-3/4"/>
          </div>
          <div className="flex items-end gap-3 pr-4">
            {[40,55,70,50,45].map((h,i) => (
              <div key={i} className="flex items-end gap-[3px]">
                <div className="w-3 bg-gray-200 rounded-sm" style={{height: h}}/>
                <div className="w-3 bg-gray-200 rounded-sm" style={{height: h*0.4}}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DebugPanel({ raw }) {
  const [open, setOpen] = useState(false);
  if (!raw) return null;
  return (
    <div className="mt-3 border border-yellow-200 rounded-lg bg-yellow-50">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full text-left px-3 py-2 text-[11px] font-mono text-yellow-700 flex justify-between"
      >
        <span>🔍 Raw API response (debug)</span>
        <span>{open ? "▲ hide" : "▼ show"}</span>
      </button>
      {open && (
        <pre className="px-3 pb-3 text-[10px] font-mono text-yellow-800 overflow-auto max-h-64 whitespace-pre-wrap break-all">
          {JSON.stringify(raw, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function Technicals({ searchId }) {
  const [periodType, setPeriodType] = useState("DAILY");
  const [rawData,    setRawData]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const fetchData = async (period) => {
    if (!searchId) {
      setError("No searchId provided");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setRawData(null);

      const params = new URLSearchParams({ periodType: period, size: 5 });
      // Must go through local proxy — Groww requires X-APP-ID etc. headers
      // which trigger CORS preflight if sent from the browser directly.
      const url = `http://localhost:8000/api/volume/${searchId}?${params}`;

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }

      const json = await res.json();
      console.log("[DeliveryVolume] raw response:", json);
      setRawData(json);
    } catch (err) {
      console.error("[DeliveryVolume] fetch error:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(periodType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchId, periodType]);
  const barsRaw = rawData?.data ?? [];

const latest = barsRaw[0] ?? {};

const totalTraded = barsRaw.reduce(
  (sum, item) => sum + Number(item.totalVolume || 0),
  0
);

const deliveryVol = barsRaw.reduce(
  (sum, item) => sum + Number(item.deliveryVolume || 0),
  0
);

const deliveryPctDisplay =
  totalTraded > 0
    ? ((deliveryVol / totalTraded) * 100).toFixed(2) + "%"
    : "—";
const insights = rawData?.insights ?? [];

const chartData = barsRaw.map((item) => ({
  label: formatBarLabel(item.startDate, periodType),
  total: Number(item.totalVolume ?? 0),
  delivery: Number(item.deliveryVolume ?? 0),
}));

const showDebug = false;
  return (
    <div className="max-w-4xl ml-0">

      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[16px] font-semibold text-gray-900">Delivery volume percentage</h2>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
          </svg>
        </button>
      </div>

      {loading ? (
        <Skeleton />
      ) : error ? (
        <div className="p-6 flex flex-col items-center gap-3 border border-gray-200 rounded-xl">
          <p className="text-[13px] text-red-400 text-center">{error}</p>
          <button onClick={() => fetchData(periodType)} className="text-[13px] text-blue-500 hover:text-blue-600 font-medium">
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-5">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setPeriodType(tab.value)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-all
                  ${periodType === tab.value
                    ? "border-gray-800 text-gray-900 bg-white"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                {PERIOD_LABEL[periodType]}
              </span>
            </div>

            <div className="px-5 pb-4 flex items-end justify-between gap-6">
              <div className="min-w-0 flex-shrink-0">
                <div className="flex items-center gap-2 py-2 border-b border-dashed border-gray-200">
                  <span className="w-2 h-2 rounded-full bg-[#7b80e8] shrink-0" />
                  <span className="text-[13px] text-gray-600 w-36">Total traded volume</span>
                  <span className="text-[13px] font-medium text-gray-800 tabular-nums">{formatIndian(totalTraded)}</span>
                </div>
                <div className="flex items-center gap-2 py-2 border-b border-dashed border-gray-200">
                  <span className="w-2 h-2 rounded-full bg-[#6ecff6] shrink-0" />
                  <span className="text-[13px] text-gray-600 w-36">Delivery volume</span>
                  <span className="text-[13px] font-medium text-gray-800 tabular-nums">{formatIndian(deliveryVol)}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="w-2 h-2 rounded-full opacity-0 shrink-0" />
                  <span className="text-[13px] text-gray-600 w-36">Delivery percentage</span>
                  <span className="text-[13px] font-medium text-gray-800 tabular-nums">{deliveryPctDisplay}</span>
                </div>
              </div>

              {chartData.length > 0 && <BarChart data={chartData} />}
            </div>

            {insights.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
                  </svg>
                  <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">Insights</span>
                </div>
                <ul className="space-y-2">
                  {insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span className="text-[13px] text-gray-700 leading-[1.55]">
                        {typeof insight === "string" ? insight : insight?.description ?? insight?.text ?? insight?.message ?? JSON.stringify(insight)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {showDebug && <DebugPanel raw={rawData} />}
        </>
      )}
    </div>
  );
}