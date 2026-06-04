import { useState } from "react";

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";


export default function ChangeGrowwPIN() {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [step, setStep] = useState("enter"); // enter | confirm | success

  const handleDigit = (idx, val, arr, setter) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...arr];
    updated[idx] = val;
    setter(updated);
    if (val && idx < 3) {
      document.getElementById(`pin-${step}-${idx + 1}`)?.focus();
    }
  };

  const pinBoxStyle = (filled) => ({
    width: 48,
    height: 56,
    border: `2px solid ${filled ? TEAL : BORDER}`,
    borderRadius: 8,
    fontSize: 24,
    textAlign: "center",
    outline: "none",
    color: TEXT_PRIMARY,
    fontWeight: 600,
    background: filled ? TEAL_LIGHT : "#fff",
    transition: "all 0.15s",
  });

  if (step === "success") {
    return (
      <div style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: "60px 32px",
        textAlign: "center",
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: TEAL_LIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 8 }}>PIN Updated!</h3>
        <p style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 24 }}>Your Groww PIN has been changed successfully.</p>
        <button onClick={() => { setPin(["","","",""]); setConfirmPin(["","","",""]); setStep("enter"); }}
          style={{ padding: "10px 24px", background: TEAL, color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Done
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 28px", borderBottom: `1px solid ${BORDER}` }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>Change Groww PIN</h2>
        <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 6, marginBottom: 0 }}>
          Your PIN is used to authenticate transactions on Groww
        </p>
      </div>
      <div style={{ padding: "32px 28px" }}>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 13, color: TEXT_SECONDARY, display: "block", marginBottom: 12 }}>
            {step === "enter" ? "Enter new 4-digit PIN" : "Confirm your new PIN"}
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            {(step === "enter" ? pin : confirmPin).map((digit, idx) => (
              <input
                key={idx}
                id={`pin-${step}-${idx}`}
                type="password"
                maxLength={1}
                value={digit}
                onChange={e => handleDigit(idx, e.target.value, step === "enter" ? pin : confirmPin, step === "enter" ? setPin : setConfirmPin)}
                onFocus={e => e.target.style.borderColor = TEAL}
                onBlur={e => e.target.style.borderColor = digit ? TEAL : BORDER}
                style={pinBoxStyle(!!digit)}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            if (step === "enter" && pin.every(d => d)) setStep("confirm");
            else if (step === "confirm" && confirmPin.every(d => d)) setStep("success");
          }}
          style={{
            padding: "11px 28px",
            background: TEAL,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {step === "enter" ? "Continue" : "Set PIN"}
        </button>
        {step === "confirm" && (
          <button
            onClick={() => { setStep("enter"); setConfirmPin(["","","",""]); }}
            style={{ marginLeft: 12, padding: "11px 20px", background: "none", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 14, color: TEXT_SECONDARY, cursor: "pointer" }}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}

