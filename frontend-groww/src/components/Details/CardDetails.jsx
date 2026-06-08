import React, { useContext,useState } from "react";
import Chart from "./Chart";
import { Info } from "lucide-react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { UserPicture } from "../../App";
import ProfilePanel from "../UserModule/ProfileDropdown";
import ProfileDropdown from "../UserModule/ProfileDropdown";
import WiproStockPage from "./WiproStockPage";

const CardDetails = () => {
  
  const {userPic,setuserPic}=useContext(UserPicture)
  const location=useLocation()
  const stock=location?.state
  const logo=stock?.logo
  const searchId=stock?.searchId
  const [showProfile, setShowProfile] = useState(false);
  
  console.log(stock)
  const sname=stock?.nse
  const lname=stock?.name
  
  return (
    <div>
    <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6 border-b border-gray-200 sticky top-0 z-10 bg-white/60 backdrop-blur-md">
        <img
          src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp"
          alt="Groww"backdrop-blur-md
          height={30}
          width={30}
        />
        <nav className="flex items-center gap-6">
          {["Stocks", "Explore", "Holdings", "Positions", "WatchList"].map((item) => (
            <NavLink
              key={item}
              to={`/user/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `text-md font-semibold ${
                  isActive
                    ? "text-gray-700 border-b-2 border-[#00d09c] pb-1"
                    : "text-gray-600 hover:text-gray-700"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </nav>
        <div className="flex-1 max-w-xs ml-auto">
          <div className="flex items-center bg-gray-200 border border-gray-200 rounded-lg px-3 h-9 gap-2 focus-within:border-gray-400 focus-within:bg-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0" >
              <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
              <path d="M20 20l-3-3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search Groww...."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none"
            />
            <span className="text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5 flex-shrink-0">
              Ctrl+K
            </span>
          </div>
          
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
            {userPic && <img src={userPic} alt="" width={30} height={30} className='rounded-2xl'/>}
            {!userPic && <img src='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'  width={28} height={28} className='rounded-full'/>}             

          </div>
          {showProfile && (
              <div className="absolute right-5 top-12 z-[9999]">
                <ProfileDropdown/>
              </div>
            )}
        </div>
      </div>
    <div className="min-h-screen w-full bg-white font-sans">

      <div className="mx-auto w-full max-w-[1230px] px-4 pt-8 sm:px-6 lg:px-0">
        <div className="max-w-[802px] rounded-lg border border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-3">
              <Info
                size={16}
                className="shrink-0 text-gray-400"
              />

              <span className="text-sm text-[#444b64]">
                The current prices are delayed, activate stocks for live prices
              </span>
            </div>

            <button className="shrink-0 text-xs font-bold text-[#00b386] transition-colors hover:text-[#009973]">
              ACTIVATE STOCKS
            </button>
          </div>
        </div>
      </div>

      <Chart sname={sname} lname={lname} logo={logo}/>
      <WiproStockPage searchId={searchId}/>
    </div>
    </div>
  );
};

export default CardDetails;
