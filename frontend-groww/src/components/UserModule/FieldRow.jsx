const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";

export default function FieldRow({ label, value, editable }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px 28px",
      borderBottom: `1px solid ${BORDER}`,
    }}>
      <div>
        <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 15, color: TEXT_PRIMARY, fontWeight: 400 }}>{value || "-"}</div>
      </div>
      {editable && (
        <button style={{
          background: "none", border: "none", cursor: "pointer", padding: 4,
          color: TEAL, display: "flex", alignItems: "center"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      )}
    </div>
  );
}