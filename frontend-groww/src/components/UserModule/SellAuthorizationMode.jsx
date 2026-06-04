import { useState } from "react";

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";


export default function SellAuthorisationMode() {
  const [mode, setMode] = useState("totp");
  const modes = [
    { key: "totp", label: "TOTP (Authenticator App)", desc: "Use Google/Microsoft Authenticator for OTP" },
    { key: "cdsl", label: "CDSL TPIN", desc: "Verify using your CDSL T-PIN each time" },
    { key: "edis", label: "eDIS OTP", desc: "One-time authorization for the day" },
  ];

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>Sell authorisation mode</h2>
        <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 6, marginBottom: 0 }}>
          Choose how to authorise sell orders from your demat account
        </p>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {modes.map(m => (
          <label
            key={m.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              border: `1.5px solid ${mode === m.key ? TEAL : BORDER}`,
              borderRadius: 8,
              cursor: "pointer",
              background: mode === m.key ? TEAL_LIGHT : "#fff",
              transition: "all 0.15s",
            }}
          >
            <input
              type="radio"
              name="auth-mode"
              checked={mode === m.key}
              onChange={() => setMode(m.key)}
              style={{ accentColor: TEAL, width: 16, height: 16 }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>{m.label}</div>
              <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginTop: 2 }}>{m.desc}</div>
            </div>
          </label>
        ))}
        <button style={{
          marginTop: 8,
          padding: "11px",
          background: TEAL,
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

