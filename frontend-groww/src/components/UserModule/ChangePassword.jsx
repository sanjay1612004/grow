import axios from "axios";
import { useState } from "react";

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";


export default function ChangePassword() {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");
  const userId=localStorage.getItem('userId')
  
  const handleSubmit = async () => {
  setMessage("");
  setMessageType("");
  
  if (!newPass || !confirmPass) {
    setMessage("Please fill all fields");
    setMessageType("error");
    return;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  if (!passwordRegex.test(newPass)) {
    setMessage(
      "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character."
    );
    setMessageType("error");
    return;
  }



  if (newPass !== confirmPass) {
    setMessage("Passwords do not match");
    setMessageType("error");
    return;
  }

  try {
    const res = await axios.post(
      "https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/reset-password",
      {
        userId,
        password: newPass,
        confirmPassword: confirmPass,
      }
    );

    console.log(res);

    setMessage("Password updated successfully!");
    setMessageType("success");

    setNewPass("");
    setConfirmPass("");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  } catch (err) {
    console.error(err);

    const errorMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "Something went wrong. Please try again.";

    setMessage(errorMsg);
    setMessageType("error");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  }
};

  const inputStyle = {
    width: "100%",
    padding: "12px 44px 12px 14px",
    border: `1px solid ${BORDER}`,
    borderRadius: 6,
    fontSize: 15,
    color: TEXT_PRIMARY,
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Decorative blobs like Groww */}
      <div style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: TEAL_LIGHT,
        opacity: 0.7,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: -40,
        right: 60,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "#ede9fe",
        opacity: 0.5,
        pointerEvents: "none",
      }} />

      <div style={{ padding: "32px 32px", position: "relative", maxWidth: 500 }}>
        {message && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 16px",
              borderRadius: 6,
              fontSize: 14,
              background:
                messageType === "success"
                  ? "#f0fdf4"
                  : "#fef2f2",
              border:
                messageType === "success"
                  ? "1px solid #bbf7d0"
                  : "1px solid #fecaca",
              color:
                messageType === "success"
                  ? "#15803d"
                  : "#dc2626",
            }}
          >
            {message}
          </div>
        )}

        {/* New Password */}
        <div style={{ marginBottom: 20 }} >
          <label style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
            NEW PASSWORD
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showNew ? "text" : "password"}
              name="new-password"
              placeholder="Password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = TEAL}
              onBlur={e => e.target.style.borderColor = BORDER}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew(v => !v)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: TEXT_MUTED,
              }}
            >
              {showNew ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <div style={{ height: 2, background: BORDER, marginTop: 2 }} />
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
            CONFIRM NEW PASSWORD
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm-new-password"
              placeholder="Password"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = TEAL}
              onBlur={e => e.target.style.borderColor = BORDER}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: TEXT_MUTED,
              }}
            >
              {showConfirm ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <div style={{ height: 2, background: BORDER, marginTop: 2 }} />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            padding: "11px 28px",
            background: TEAL,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
