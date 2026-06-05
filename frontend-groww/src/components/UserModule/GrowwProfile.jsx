
import { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileDropdown from "./ProfileDropdown";
import { Link, Outlet } from "react-router-dom";


const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";

export default function GrowwProfile() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "#FFFF",
      minHeight: "100vh",
    }} >
      {/* Navbar */}
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
          <img src="https://lh3.googleusercontent.com/a/ACg8ocIYetc0b2EDMVGG5XQi0ZYArJTTNNjd4sYXbUGGwKYi51BGgcP3=s96-c" alt="profile" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} onClick={()=>setShowProfile(!showProfile)} />
          <div className="relative">
  {showProfile && (
    <div className="absolute right-0 top-10 z-[9999]">
      <ProfileDropdown />
    </div>
  )}
</div>
        </div>
      </nav>

      {/* Body */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "32px 40px",
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
      }} onClick={() => setShowProfile(false)}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
