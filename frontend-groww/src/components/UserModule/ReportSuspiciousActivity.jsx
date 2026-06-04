import { useState } from "react";

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";


export default function ReportSuspiciousActivity() {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "60px 32px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>
        {/* Illustration */}
        <div style={{ marginBottom: 24, fontSize: 64 }}>🔐</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 8 }}>
          Found suspicious activity in your account?
        </h2>
        <p style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 32, maxWidth: 400 }}>
          You can protect your account by using any of these safety measures.
        </p>
      </div>

      <div style={{ padding: "0 32px 32px" }}>
        {[
          { icon: "↪", label: "Logout of all devices" },
          { icon: "🔑", label: "Change Groww Pin" },
          { icon: "✉️", label: "Change password" },
        ].map(item => (
          <button
            key={item.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "16px 20px",
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              marginBottom: 12,
              cursor: "pointer",
              textAlign: "left",
              fontSize: 14,
              color: TEXT_PRIMARY,
              fontWeight: 500,
            }}
            onMouseEnter={e => e.currentTarget.style.background = BG_HOVER}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

