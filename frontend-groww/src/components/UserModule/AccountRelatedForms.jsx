import { useState } from "react";

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";


const forms = [
  { label: "Modification of email id or mobile number", icon: "✉️" },
  { label: "Modification of bank account details", icon: "🏦" },
  { label: "Modification of address", icon: "📍" },
  { label: "Demat account closure", icon: "📄" },
];

export default function AccountRelatedForms() {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>Account Related Forms</h2>
        <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 6, marginBottom: 0 }}>
          Download forms for account modifications
        </p>
      </div>
      {forms.map((form, i) => (
        <button
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "16px 24px",
            background: "transparent",
            border: "none",
            borderBottom: i < forms.length - 1 ? `1px solid ${BORDER}` : "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = BG_HOVER}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>{form.icon}</span>
            <span style={{ fontSize: 14, color: TEXT_PRIMARY }}>{form.label}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      ))}
    </div>
  );
}

