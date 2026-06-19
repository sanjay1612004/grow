import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const SEARCH_API = "https://groww.in/v1/api/search/v3/query/global/st_query";
const CATEGORIES = ["All", "Stocks", "F&O", "Mutual Funds", "ETF", "FAQs"];
const ENTITY_TYPES = {
  Stocks: "stocks",
  "F&O": "fno",
  "Mutual Funds": "scheme",
  ETF: "etf",
  FAQs: "help",
};

export default function StockSearch() {
  const navigate = useNavigate();
  const modalInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("growwRecentSearches")) ?? [];
    } catch {
      return [];
    }
  });

  const openSearch = () => setIsOpen(true);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) modalInputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          from: "0",
          query: query.trim(),
          size: "7",
          web: "true",
        });
        const entityType = ENTITY_TYPES[activeCategory];
        if (entityType) params.set("entity_type", entityType);

        const response = await fetch(`${SEARCH_API}?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search failed");
        const json = await response.json();
        setResults(json?.data?.content ?? []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setResults([]);
          setError("Unable to load stocks. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query ? 250 : 0);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [activeCategory, isOpen, query]);

  const selectStock = async (result) => {
    const searchId = result.search_id || result.id;
    if (!searchId || selectedId) return;

    setSelectedId(searchId);
    const updatedRecentSearches = [
      result,
      ...recentSearches.filter((item) => (item.search_id || item.id) !== searchId),
    ].slice(0, 5);
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem("growwRecentSearches", JSON.stringify(updatedRecentSearches));
    let routeState = {
      searchId,
      nse: result.nse_scrip_code,
      bse: result.bse_scrip_code,
      company: result.company_short_name || result.title,
      name: result.title,
    };

    try {
      const response = await fetch(
        `https://groww.in/v1/api/stocks_data/v1/company/search_id/${encodeURIComponent(searchId)}?page=0&size=10`
      );
      if (!response.ok) throw new Error("Details failed");
      const details = await response.json();
      routeState = {
        ...routeState,
        nse: details?.header?.nseScriptCode || routeState.nse,
        bse: details?.header?.bseScriptCode || routeState.bse,
        company: details?.header?.shortName || routeState.company,
        name: details?.header?.displayName || routeState.name,
        logo: details?.header?.logoUrl,
      };
    } catch (requestError) {
      console.error("Could not preload stock details:", requestError);
    }

    setSelectedId("");
    setIsOpen(false);
    setQuery("");
    navigate(`/stocks/${searchId}`, { state: routeState });
  };

  return (
    <div className="relative ml-auto mr-3 w-full max-w-xs">
      <button
        type="button"
        onClick={openSearch}
        className="flex h-9 w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 text-left transition-colors hover:border-gray-300 hover:bg-white"
      >
        <SearchIcon size={14} color="#9ca3af" />
        <span className="min-w-0 flex-1 text-sm text-gray-400">Search Groww....</span>
        <span className="flex-shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-400">Ctrl+K</span>
      </button>

      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[10000] bg-black/25"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section className="absolute left-1/2 top-[143px] w-[min(600px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex h-[50px] items-center gap-3 border-b border-gray-200 px-4">
              <SearchIcon size={19} color="#6b7280" />
              <input
                ref={modalInputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Groww..."
                autoComplete="off"
                className="min-w-0 flex-1 border-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-xl text-gray-400" aria-label="Clear search">
                  ×
                </button>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto border-b border-gray-100 px-4 py-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium ${
                    category === activeCategory
                      ? "border-gray-700 bg-gray-50 text-gray-800"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div role="listbox" className="max-h-[465px] overflow-y-auto pb-2">
              {!query.trim() && recentSearches.length > 0 && activeCategory === "All" && (
                <div className="pt-3">
                  {recentSearches.map((result) => (
                    <ResultRow
                      key={`recent-${result.search_id || result.id}`}
                      result={result}
                      icon="recent"
                      selectedId={selectedId}
                      onSelect={selectStock}
                    />
                  ))}
                </div>
              )}

              <h2 className="px-4 pb-2 pt-3 text-sm font-semibold text-gray-600">
                {query.trim() ? "Search results" : "Trending Searches"}
              </h2>

              {loading && results.length === 0 && <LoadingRows />}
              {!loading && error && <p className="px-4 py-8 text-center text-sm text-red-500">{error}</p>}
              {!loading && !error && results.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-gray-500">No stocks found for “{query}”</p>
              )}

              {results.map((result) => (
                <ResultRow
                  key={`${result.entity_type}-${result.search_id || result.id}`}
                  result={result}
                  icon="trend"
                  selectedId={selectedId}
                  onSelect={selectStock}
                />
              ))}
            </div>
          </section>
        </div>,
        document.body
      )}
    </div>
  );
}

function SearchIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <path d="M20 20l-3-3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m4 16 5-5 4 3 7-8" />
      <path d="M15 6h5v5" />
    </svg>
  );
}

function RecentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12a8 8 0 1 0 2.34-5.66L4 8.68" />
      <path d="M4 4v4.68h4.68M12 8v5l3 2" />
    </svg>
  );
}

function ResultRow({ result, icon, selectedId, onSelect }) {
  const searchId = result.search_id || result.id;
  const symbol = result.nse_scrip_code || result.bse_scrip_code || result.entity_type;

  return (
    <button
      type="button"
      role="option"
      disabled={Boolean(selectedId)}
      onClick={() => onSelect(result)}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 disabled:cursor-wait"
    >
      <span className="flex h-7 w-7 items-center justify-center text-gray-500">
        {icon === "recent" ? <RecentIcon /> : <TrendIcon />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-[#34405c]">{result.title}</span>
        {icon !== "recent" && (
          <span className="mt-0.5 block text-xs text-gray-400">{symbol} · {result.entity_type}</span>
        )}
      </span>
      {selectedId === searchId && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-[#00b386]" />
      )}
    </button>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3 px-4 py-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex animate-pulse items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-gray-100" />
            <div className="h-2 w-1/3 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
