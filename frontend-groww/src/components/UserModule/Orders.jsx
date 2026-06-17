import { useContext, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import ProfileDropdown from './ProfileDropdown'
import { UserPicture } from "../../App";
// import StocksEmptyState from "./StocksEmptyState";
// import FOEmptyState from "./FOEmptyState";
const tabs = ["Stocks", "F&O", "Mutual Funds"];

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";


export default function Orders() {
  const [activeTab, setActiveTab] = useState("Stocks");
    const [showProfile, setShowProfile] = useState(false);
    const navigate=useNavigate()
    const {userPic,setuserPic}=useContext(UserPicture)
    


  return (
    <div>
     <nav style={{
                background: "#fff",
                borderBottom: `1px solid ${BORDER}`,
                padding: "0 60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 60,
                position: "sticky",
                top: 0,
                zIndex: 100,
            }} className="relative bg-white/60 backdrop-blur-md ">
                <div style={{ display: "flex", alignItems: "center", gap: 32 }} >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Link to="/user/explore"><img src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp" alt="" /></Link>
                        </div>
                    </div>
                    {["Stocks", "F&O", "Mutual Funds"].map(item => (
                        <span key={item} style={{ fontSize: 18, fontWeight: 600, cursor: "pointer" }} className="text-gray-500">{item}</span>
                    ))}
                </div>
                <div className="flex-1 max-w-xs ml-auto mr-3">
                    <div className="flex items-center bg-gray-200 border border-gray-200 rounded-lg px-3 h-9 gap-2 focus-within:border-gray-400 focus-within:bg-white transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                            <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
                            <path d="M20 20l-3-3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search Groww...."
                            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none"
                        />
                        <span className="text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5 flex-shrink-0">Ctrl+K</span>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TEXT_SECONDARY} strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <img src={!userPic?"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg":userPic} alt="profile" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} onClick={() => setShowProfile(!showProfile)} />
                    <div className="relative">
                        {showProfile && (
                            <div className="absolute right-0 top-10 z-[9999]">
                                <ProfileDropdown />
                            </div>
                        )}
                    </div>
                </div>
            </nav>
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div className="max-w-5xl mx-23 px-1 py-8">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-gray-700">
          All orders
        </h1>

        {/* Tab bar */}
        <div className="border-b" style={{ borderColor: "#e5e7eb" }}>
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                    setActiveTab(tab);

                    if (tab === "Stocks") navigate("/user/order/stocks");
                    if (tab === "F&O") navigate("/user/order/futures-and-options");
                    if (tab === "Mutual Funds") navigate("/user/order/mutual-funds");
                }}

                className="pb-3 text-sm font-medium cursor-pointer bg-transparent border-none outline-none relative"
                style={{
                  color: activeTab === tab ? "#1e2028" : "#6b7280",
                  fontWeight: activeTab === tab ? 700 : 500,
                }}
              >
                {tab}
                {activeTab === tab && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                    style={{ backgroundColor: "#1e2028" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-4">
          <Outlet/>
        </div>
      </div>
    </div>
    </div>
  );
}
