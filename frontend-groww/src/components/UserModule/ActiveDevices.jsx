import { useState } from "react";

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";


const devices = [
  { id: 1, name: "Chrome, Linux", status: "Active Now", current: true },
  { id: 2, name: "Chrome, Windows", status: "Logged on 30 May, 10:26 AM", current: false },
];

export default function ActiveDevices() {
  const [loggedOut, setLoggedOut] = useState([]);

  const logout = (id) => setLoggedOut(prev => [...prev, id]);

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 24px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: "0 0 6px" }}>Active devices</h2>
        <p style={{ fontSize: 13, color: TEXT_SECONDARY, margin: 0 }}>
          You're currently logged-in on these devices. Multiple active sessions on the same device indicates you've opened Groww on more than one browser.
        </p>
      </div>

      {["Current device", "Active devices"].map((section, si) => {
        const sectionDevices = si === 0
          ? devices.filter(d => d.current)
          : devices.filter(d => !d.current);
        if (!sectionDevices.length) return null;
        return (
          <div key={section} style={{ borderTop: `1px solid ${BORDER}`, padding: "16px 24px" }}>
            <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 12 }}>{section}</div>
            {sectionDevices.map(device => (
              <div key={device.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: `1px solid ${BORDER}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TEXT_SECONDARY} strokeWidth="1.5">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>{device.name}</div>
                    <div style={{ fontSize: 12, color: device.current ? TEAL : TEXT_MUTED }}>{device.status}</div>
                  </div>
                </div>
                {!loggedOut.includes(device.id) ? (
                  <button
                    onClick={() => logout(device.id)}
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: TEAL,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <span style={{ fontSize: 12, color: TEXT_MUTED }}>Logged out</span>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

