import { useState,useEffect } from "react";


export default function ShareholdingSection({ shareHoldingPattern }) {
  const quarters = Object.keys(shareHoldingPattern ?? {});
  const [sel, setSel] = useState(quarters.at(-1) ?? "");

  useEffect(() => {
    if (quarters.length) setSel(quarters.at(-1));
  }, [shareHoldingPattern]);

  if (!quarters.length) return null;
  const current = shareHoldingPattern[sel];

  const cats = [
    { key: "promoters",   label: "Promoters",            getValue: (d) => (d?.promoters?.individual?.percent ?? 0) + (d?.promoters?.corporation?.percent ?? 0) },
    { key: "fii",         label: "Foreign Institutions",  getValue: (d) => d?.foreignInstitutions?.percent ?? 0 },
    { key: "retail",      label: "Retail And Others",     getValue: (d) => d?.retailAndOthers?.percent ?? 0 },
    { key: "mf",          label: "Mutual Funds",          getValue: (d) => d?.mutualFunds?.percent ?? 0 },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-4">Shareholding Pattern</h2>
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex gap-4 mb-5 text-[12px]">
          {quarters.map((q) => (
            <button
              key={q}
              onClick={() => setSel(q)}
              className={`px-2 py-0.5 rounded-full font-medium transition-all ${sel === q ? "bg-[#44c5a6]/15 text-[#44c5a6] font-semibold" : "text-gray-500"}`}
            >{q}</button>
          ))}
        </div>
        <div className="space-y-4">
          {cats.map((c) => {
            const pct = c.getValue(current);
            return (
              <div key={c.key}>
                <p className="text-[12px] text-gray-700 mb-1.5">{c.label}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: "#44c5a6" }} />
                  </div>
                  <span className="text-[12px] font-semibold text-gray-700 w-14 text-right">{pct.toFixed(2)}%</span>
                </div>
              </div>
            );
          })}
        </div>
        <button className="mt-4 text-[12px] text-[#44c5a6] font-semibold">See More</button>
      </div>
    </div>
  );
}