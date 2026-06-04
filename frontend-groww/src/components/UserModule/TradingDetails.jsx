import { useState } from "react";

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";

const user = {
  name: "Sanjay Balaji",
  avatar: "https://i.pravatar.cc/80?img=12",
  mobile: "*****89425",
  email: "san***********s@gmail.com",
  dob: "-",
  maritalStatus: "-",
  gender: "-",
  incomeRange: "-",
  occupation: "-",
  pan: "ABCPS1234D",
  ucc: "8605965652",
  dpId: "-",
  dematAccNumber: "-",
  depository: "Groww Invest Tech Pvt. Ltd.",
  depositoryName: "CDSL",
};


function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ flex: "1 1 200px" }}>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, color: TEXT_PRIMARY, fontWeight: 500 }}>{value}</span>
        <button
          onClick={copy}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: copied ? TEAL : TEXT_MUTED }}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function TradingDetails() {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>Trading Details</h2>
      </div>
      <div style={{ padding: "24px", display: "flex", flexWrap: "wrap", gap: "24px 48px" }}>
        <CopyField label="Unique Client Code" value={user.ucc} />
        <CopyField label="Demat Acc Number / BOID" value={user.dematAccNumber} />
        <CopyField label="DP ID" value={user.dpId} />
        <CopyField label="Depository Participant" value={user.depository} />
        <CopyField label="Depository Name" value={user.depositoryName} />
      </div>
    </div>
  );
}

