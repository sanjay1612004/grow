import React, { useState,useEffect, useContext } from 'react'
import Explore from './Explore';
import { useLocation, useNavigate } from "react-router-dom";
import Holdings from './Holdings';
import Orders from './Orders';
import Positions from './Positions';
import Watchlist from './Watchlist';
import Footer from '../landingpage/Footer';
import { UserPicture } from '../../App';
import ProfileDropdown from "../UserModule/ProfileDropdown"
import StockSearch from "../common/StockSearch";
const Common = () => {
      const [activeTab, setActiveTab] = useState("Explore");
      const {userPic,setuserPic}=useContext(UserPicture)
        const [showProfile, setShowProfile] = useState(false);

      
      const tabs = ["Explore", "Holdings", "Positions", "Orders", "Watchlist"];
      const indices = [
    { name: "NIFTY", val: "23,910.80", chg: "-2.90", pct: "0.01%", up: false },
    { name: "SENSEX", val: "75,965.80", chg: "-43.90", pct: "0.06%", up: false },
    { name: "BANKNIFTY", val: "54,904.70", chg: "-188.20", pct: "0.34%", up: false },
    { name: "MIDCPNIFTY", val: "14,706.10", chg: "+30.50", pct: "0.21%", up: true },
    { name: "FINNIFTY", val: "25,795.40", chg: "-1.20", pct: "0.01%", up: false },
  ];
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  const routeTab = {
    "/user/explore": "Explore",
    "/user/holdings": "Holdings",
    "/user/positions": "Positions",
    "/user/orders": "Orders",
    "/user/watchlist": "Watchlist",
  }[location.pathname];

  if (routeTab) {
    setActiveTab(routeTab);
  }
}, [location.pathname]);

  return (
    <div>
    <header className="bg-white/60 backdrop-blur-md border-b border-gray-300 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6">
          <img src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp" alt="" height={30} width={30}/>
          <nav className="flex items-center gap-6">
            {["Stocks", "F&O", "Mutual Funds"].map(item => (
              <a key={item} href="#" className="text-sm font-bold text-gray-700 hover:text-gray-900">{item}</a>
            ))}
          </nav>
          <StockSearch />
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
            {/* <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer">
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"/>
            </div> */}
            {userPic && <img src={userPic} alt="" width={28} height={28} className='rounded-2xl'onClick={()=>setShowProfile(!showProfile)}/>}
            {!userPic && <img src='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'  width={28} height={28} className='rounded-2xl' onClick={()=>setShowProfile(!showProfile)}/>}
          </div>
        </div>
        {showProfile && (
    <div className="absolute right-5 top-12 z-[9999]">
      <ProfileDropdown/>
    </div>
  )}

        {/* ── Second nav row ──────────────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between border-t border-gray-200 border-b  ">
          <nav className="flex">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => {setActiveTab(tab);
  navigate(
    {
      Explore: "/user/explore",
      Holdings: "/user/holdings",
      Positions: "/user/positions",
      Orders: "/user/orders",
      Watchlist: "/user/watchlist",
    }[tab]
  )
}}
                className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-gray-900 border-gray-900"
                    : "text-gray-700 border-transparent hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 12h8M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Terminal
            </button>
            <span className="text-sm text-gray-600 font-medium">915</span>
          </div>
        </div>
         <div className="bg-white/60 backdrop-blur-md  border-b border-gray-50 ">
        <div className="flex items-center gap-8 px-6 py-2.5 overflow-x-auto scrollbar-hide">
          {indices.map(idx => (
            <div key={idx.name} className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">{idx.name}</span>
              <span className="text-sm text-gray-900">{idx.val}</span>
              <span className={`text-sm ${idx.up ? "text-[#00b386]" : "text-[#eb5757]"}`}>
                {idx.chg} ({idx.pct})
              </span>
            </div>
          ))}
          <a className="flex-shrink-0 text-gray-400 hover:text-gray-600" href='/indices'>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="currentColor" strokeWidth="1.5"/></svg>
          </a>
        </div>
      </div>
      </header>

      {/* ── Index ticker ────────────────────────────────────────────────── */}
     

      <main className="max-w-[1400px] mx-auto px-6 py-6" onClick={()=>setShowProfile(false)}>
        {activeTab === "Explore" && <Explore/>}
        {activeTab === "Holdings" && <Holdings/>}
        {activeTab === "Positions" && <Positions/>}
        {activeTab === "Orders" && <Orders/>}
        {activeTab === "Watchlist" && <Watchlist/>}
      </main>
    <Footer/>
    </div>
  )
}

export default Common
