import { useState } from "react";

export default function AboutSection({ details, header }) {
  const [expanded, setExpanded] = useState(false);
  if (!details) return null;
  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-3">About</h2>
      <p className={`text-[13px] text-gray-600 leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
        {details.businessSummary}
      </p>
      {!expanded && (
        <button onClick={() => setExpanded(true)} className="text-[13px] text-[#44c5a6] font-medium">...Read more</button>
      )}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          { label: "CEO/MD",     val: details.ceo || details.managingDirector || "—" },
          { label: "Founded in", val: details.foundedYear ?? "—" },
          { label: "NSE symbol", val: header?.nseScriptCode || "—" },
        ].map(({ label, val }) => (
          <div key={label}>
            <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
            <p className="text-[13px] font-semibold text-gray-800">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}