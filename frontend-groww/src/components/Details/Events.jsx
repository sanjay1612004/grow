import { useState, useEffect } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseDate(iso) {
  const d = new Date(iso);
  return { day: d.getDate(), month: MONTH_SHORT[d.getMonth()], year: d.getFullYear() };
}

function groupByYear(events) {
  return events.reduce((acc, ev) => {
    const year = parseDate(ev.primaryDate).year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(ev);
    return acc;
  }, {});
}

// sort years descending
function sortedYears(grouped) {
  return Object.keys(grouped).map(Number).sort((a, b) => b - a);
}

// ── sub-components ────────────────────────────────────────────────────────────

function DateBadge({ iso }) {
  const { day, month } = parseDate(iso);
  return (
    <div className="flex flex-col items-center justify-center w-12 h-12 border border-gray-200 rounded-md shrink-0">
      <span className="text-[15px] font-semibold text-gray-800 leading-none">{day}</span>
      <span className="text-[11px] text-gray-500 mt-0.5 leading-none">{month}</span>
    </div>
  );
}

function ResultCard({ event }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border border-gray-200 rounded-xl bg-white">
      <div className="flex items-center gap-3">
        <DateBadge iso={event.primaryDate} />
        <div>
          <p className="text-[14px] font-medium text-gray-800">{event.eventTitle}</p>
          <p className="text-[12px] text-gray-400 mt-0.5">{event.eventType}</p>
        </div>
      </div>
      <button className="text-[13px] text-gray-600 border-b border-dashed border-gray-400 pb-0.5 flex items-center gap-0.5 hover:text-gray-900 transition-colors whitespace-nowrap ml-4">
        Check latest financial
        <svg className="w-3.5 h-3.5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function DividendCard({ event }) {
  const { value, description } = event.eventDetail ?? {};
  const meta = event.eventMetadata ?? {};

  return (
    <div className="flex items-center justify-between px-4 py-4 border border-gray-200 rounded-xl bg-white">
      <div className="flex items-center gap-3">
        <DateBadge iso={event.primaryDate} />
        <div>
          <p className="text-[14px] font-medium text-gray-800">{event.eventTitle}</p>
          <p className="text-[12px] text-gray-400 mt-0.5">{event.eventType}</p>
        </div>
      </div>
      {value && (
        <div className="ml-4 text-right shrink-0">
          <p className="text-[15px] font-semibold text-gray-800">{value}</p>
          <p className="text-[11px] text-gray-400">{description}</p>
          {meta.dividendType && (
            <p className="text-[11px] text-gray-400">{meta.dividendType}</p>
          )}
        </div>
      )}
    </div>
  );
}

function EventCard({ event }) {
  if (event.corporateEventFilter === "RESULTS") return <ResultCard event={event} />;
  if (event.corporateEventFilter === "DIVIDEND") return <DividendCard event={event} />;
  // fallback generic
  return <ResultCard event={event} />;
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border border-gray-200 rounded-xl animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-md shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────────

export default function Events({ growwCompanyId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const fetchEvents = async () => {
    if (!growwCompanyId) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://groww.in/v1/api/stocks_data/equity_feature/v2/company/corporate_action/event?gsin=${growwCompanyId}`,
        { headers: { Accept: "application/json" } }
      );

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      const items = Array.isArray(data?.events) ? data.events : [];
      setEvents(items);
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [growwCompanyId]);

  // group & sort
  const grouped = groupByYear(events);
  const years = sortedYears(grouped);

  // collapsed: show only the most recent year (2 events max)
  // expanded: show all years and all events
  const visibleYears = expanded ? years : years.slice(0, 1);
  const COLLAPSED_LIMIT = 2;

  return (
    <div className="max-w-4xl ml-0">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── loading ── */}
        {loading && (
          <div className="space-y-3">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* ── error ── */}
        {!loading && error && (
          <div className="p-8 flex flex-col items-center gap-3">
            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-[13px] text-gray-400 text-center">Could not load events: {error}</p>
            <button onClick={fetchEvents} className="text-[13px] text-blue-500 hover:text-blue-600 font-medium">
              Try again
            </button>
          </div>
        )}

        {/* ── events by year ── */}
        {!loading && !error && visibleYears.map((year) => {
          const yearEvents = grouped[year];
          const visibleEvents = expanded ? yearEvents : yearEvents.slice(0, COLLAPSED_LIMIT);

          return (
            <div key={year} className="space-y-3">
              <h3 className="text-[15px] font-semibold text-gray-700">{year}</h3>
              <div className="space-y-3">
                {visibleEvents.map((ev, idx) => (
                  <EventCard key={`${ev.primaryDate}-${ev.eventTitle}-${idx}`} event={ev} />
                ))}
              </div>
            </div>
          );
        })}

        {/* ── view more / view less ── */}
        {!loading && !error && events.length > 0 && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-[14px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {expanded ? "View less" : "View more"}
          </button>
        )}

        {/* ── events calendar banner ── */}
        {!loading && !error && (
          <div className="flex items-center justify-between px-4 py-4 border border-gray-200 rounded-xl bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              {/* calendar emoji icon matching Groww's green calendar icon */}
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  <rect x="2" y="6" width="36" height="30" rx="4" fill="#e6f7f1" />
                  <rect x="2" y="6" width="36" height="10" rx="4" fill="#00b386" />
                  <rect x="10" y="2" width="4" height="8" rx="2" fill="#00b386" />
                  <rect x="26" y="2" width="4" height="8" rx="2" fill="#00b386" />
                  <rect x="8" y="22" width="5" height="5" rx="1" fill="#00b386" />
                  <rect x="18" y="22" width="5" height="5" rx="1" fill="#00b386" />
                  <rect x="28" y="22" width="5" height="5" rx="1" fill="#00b386" />
                  <rect x="8" y="30" width="5" height="4" rx="1" fill="#00b386" />
                  <rect x="18" y="30" width="5" height="4" rx="1" fill="#00b386" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Events calendar</p>
                <p className="text-[14px] font-medium text-gray-800">View upcoming events in other stocks</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}

      </div>
    </div>
  );
}