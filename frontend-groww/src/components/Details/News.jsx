import { useState, useEffect } from "react";

// Utility: relative time from ISO date string
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths >= 1) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  if (diffWeeks >= 1)  return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  if (diffDays >= 1)   return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours >= 1)  return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMins >= 1)   return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  return "just now";
}

function NewsCard({ item }) {
  const handleClick = () => {
    if (item.url) window.open(item.url, "_blank", "noopener noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-4 border-b border-gray-100 last:border-b-0 ${
        item.url ? "cursor-pointer hover:bg-gray-50" : ""
      } transition-colors duration-100`}
    >
      <div className="flex items-center gap-1 mb-1.5">
        <span className="text-[13px] text-gray-500 font-normal">{item.source}</span>
        <span className="text-gray-400 text-[13px]">·</span>
        <span className="text-[13px] text-gray-400">{timeAgo(item.pubDate)}</span>
      </div>
      <p className="text-[14px] text-gray-800 leading-[1.55] font-normal">
        {item.title}
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="px-4 py-4 border-b border-gray-200 animate-pulse">
      <div className="flex gap-2 mb-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-14 bg-gray-200 rounded" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-4/5 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="p-8 flex flex-col items-center gap-3">
      <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <p className="text-[13px] text-gray-400 text-center">{message}</p>
      <button
        onClick={onRetry}
        className="text-[13px] text-blue-500 hover:text-blue-600 font-medium"
      >
        Try again
      </button>
    </div>
  );
}

export default function News({ growwCompanyId }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    if (!growwCompanyId) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://groww.in/v1/api/groww-news/v2/stocks/news/${growwCompanyId}?page=0&size=10`,
        { headers: { Accept: "application/json" } }
      );

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();

      const items = Array.isArray(data)
        ? data
        : data?.results ?? data?.data ?? [];

      if (!Array.isArray(items)) throw new Error("Unexpected response format");

      const mapped = items.map((item) => ({
        id:      item.id       ?? item.newsId       ?? String(Math.random()),
        title:   item.title    ?? item.summary      ?? item.headline ?? "",
        url:     item.url      ?? item.link         ?? "",
        pubDate: item.pubDate  ?? item.publishedDate ?? item.date    ?? "",
        source:  item.source   ?? item.publisher    ?? "",
      }));

      setNews(mapped);
    } catch (err) {
      setError(err.message || "Failed to load news");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [growwCompanyId]);

  return (
    <div className="max-w-4xl ml-0">
      <div className="max-w-5xl mx-auto">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <ErrorState
              message={`Could not load news: ${error}`}
              onRetry={fetchNews}
            />
          ) : news.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No news available.
            </div>
          ) : (
            news.map((item) => <NewsCard key={item.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}