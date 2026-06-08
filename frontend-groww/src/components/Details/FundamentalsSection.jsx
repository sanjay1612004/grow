export default function FundamentalsSection({ fundamentals }) {
  if (!fundamentals || fundamentals.length === 0) return null;

  // Pair them up in rows of 2
  const rows = [];
  for (let i = 0; i < fundamentals.length; i += 2) {
    rows.push([fundamentals[i], fundamentals[i + 1]].filter(Boolean));
  }

  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-1.5">
        Fundamentals
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={1.5} /><path d="M12 16v-4M12 8h.01" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </h2>
      <div className="divide-y divide-gray-100">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-0">
            {row.map((f, j) => (
              <div key={j} className={`flex justify-between py-2.5 ${j === 0 ? "pr-6 border-r border-gray-100" : "pl-6"}`}>
                <span className="text-[12px] text-gray-500">{f.shortName}</span>
                <span className="text-[12px] font-semibold text-gray-800">{f.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}