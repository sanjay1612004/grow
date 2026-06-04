import { useState } from "react";

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";


export default function TradingControls() {
  const [paused, setPaused] = useState(false);

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>Trading Controls</h2>
      </div>
      <button
        onClick={() => setPaused(v => !v)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "18px 24px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        onMouseEnter={e => e.currentTarget.style.background = BG_HOVER}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: TEXT_PRIMARY, marginBottom: 4 }}>F&O Pause</div>
          <div style={{ fontSize: 13, color: TEXT_SECONDARY }}>Reduce overtrading by pausing F&O</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {paused && (
            <span style={{
              fontSize: 12, fontWeight: 600, color: "#dc2626",
              background: "#fef2f2", padding: "3px 10px", borderRadius: 20,
            }}>Paused</span>
          )}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>
    </div>
  );
}

