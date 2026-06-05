import { useState } from "react";
import { Link } from "react-router-dom";

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";


export default function TradingAPIs() {
  const [enabled, setEnabled] = useState(false);

  return (
    // <div style={{
    //   background: "#fff",
    //   border: `1px solid ${BORDER}`,
    //   borderRadius: 8,
    //   overflow: "hidden",
    // }}>
    //   <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
    //     <h2 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>Trading APIs</h2>
    //     <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 6, marginBottom: 0 }}>
    //       Create API keys to trade programmatically on Groww
    //     </p>
    //   </div>
    //   <div style={{ padding: "24px" }}>
    //     <div style={{
    //       display: "flex",
    //       justifyContent: "space-between",
    //       alignItems: "center",
    //       padding: "16px",
    //       background: "#f9fafb",
    //       borderRadius: 8,
    //       marginBottom: 16,
    //     }}>
    //       <div>
    //         <div style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>Enable API Access</div>
    //         <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginTop: 2 }}>Allow third-party apps to trade on your behalf</div>
    //       </div>
    //       <button
    //         onClick={() => setEnabled(v => !v)}
    //         style={{
    //           width: 44,
    //           height: 24,
    //           borderRadius: 12,
    //           background: enabled ? TEAL : "#d1d5db",
    //           border: "none",
    //           cursor: "pointer",
    //           position: "relative",
    //           transition: "background 0.2s",
    //         }}
    //       >
    //         <div style={{
    //           width: 18,
    //           height: 18,
    //           borderRadius: "50%",
    //           background: "#fff",
    //           position: "absolute",
    //           top: 3,
    //           left: enabled ? 23 : 3,
    //           transition: "left 0.2s",
    //         }} />
    //       </button>
    //     </div>
    //     {enabled && (
    //       <button style={{
    //         padding: "10px 20px",
    //         background: TEAL,
    //         color: "#fff",
    //         border: "none",
    //         borderRadius: 6,
    //         fontSize: 14,
    //         fontWeight: 600,
    //         cursor: "pointer",
    //       }}>
    //         Generate API Key
    //       </button>
    //     )}
    //   </div>
    // </div>
    <div className="flex justify-center items-center  flex-col mt-20">
        <img src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/desktopLight.4afdee4c.svg" alt=""  width={300} height={300}/>
        <p className="text-4xl font-bold text-gray-600 mt-6">Groww APIs have a new home!</p>
        <p className="text-gray-400 mt-3">API keys are now available on Groww Cloud.</p>
        <Link to="https://groww.in/trade-api/api-keys"><button className="bg-[#04B488] p-3 text-white mt-4 font-semibold w-54 rounded">Take me there</button></Link>
    </div>
  );
}

