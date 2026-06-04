import { useState } from "react";


const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";

const reportGroups = [
  {
    icon: "📊",
    color: "#e8f4fd",
    iconColor: "#3b82f6",
    title: "Profit & Loss",
    items: ["Stocks P&L", "Dividend report"],
  },
  {
    icon: "🧾",
    color: "#f0fdf4",
    iconColor: "#22c55e",
    title: "Tax",
    items: [
      "Mutual Funds - ELSS statement",
      "Mutual Funds - Capital gains",
      "Stocks - Capital gains",
      "F&O - Tax report",
      "Commodities - Tax report",
      "GST invoice",
    ],
  },
];

function ReportItem({ label, onSelect, active }) {
  return (
    <button
      onClick={() => onSelect(label)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "14px 16px",
        background: active ? BG_ACTIVE : "transparent",
        border: "none",
        borderBottom: `1px solid ${BORDER}`,
        cursor: "pointer",
        textAlign: "left",
        fontSize: 14,
        color: TEXT_PRIMARY,
        transition: "background 0.15s",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = BG_HOVER; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <span>{label}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

export default function Reports() {
  const [selected, setSelected] = useState(null);
  const [fy, setFy] = useState("Apr 2026 - Mar 2027");

  const fyOptions = [
    "Apr 2026 - Mar 2027",
    "Apr 2025 - Mar 2026",
    "Apr 2024 - Mar 2025",
    "Apr 2023 - Mar 2024",
  ];

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {/* Report list */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {reportGroups.map((group) => (
          <div key={group.title} style={{
            background: "#fff",
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            overflow: "hidden",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 16px",
              borderBottom: `1px solid ${BORDER}`,
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: group.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}>
                {group.icon}
              </div>
              <span style={{ fontWeight: 600, fontSize: 15, color: TEXT_PRIMARY }}>{group.title}</span>
            </div>
            {group.items.map((item) => (
              <ReportItem
                key={item}
                label={item}
                onSelect={setSelected}
                active={selected === item}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div style={{
        width: 300,
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: 20,
        height: "fit-content",
      }}>
        {selected ? (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, margin: "0 0 16px" }}>{selected}</h3>
            <div style={{ marginBottom: 6 }}>
              <label style={{ fontSize: 12, color: TEXT_MUTED, display: "block", marginBottom: 6 }}>
                Choose financial year
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={fy}
                  onChange={e => setFy(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 36px 10px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 6,
                    fontSize: 14,
                    color: TEXT_PRIMARY,
                    background: "#fff",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  {fyOptions.map(o => <option key={o}>{o}</option>)}
                </select>
                <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            <div style={{ marginTop: 200 }}>
              <button style={{
                width: "100%",
                padding: "12px",
                background: TEAL,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}>
                Download
              </button>
            </div>
          </>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 200,
            gap: 12,
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 6,
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="8" y1="9" x2="16" y2="9" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="12" y2="17" />
              </svg>
            </div>
            <p style={{ fontSize: 14, color: TEXT_SECONDARY, margin: 0 }}>Select a report to get started</p>
          </div>
        )}

        {/* Need help */}
        <div style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT_SECONDARY} strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span style={{ fontSize: 14, color: TEXT_SECONDARY }}>Need help?</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

