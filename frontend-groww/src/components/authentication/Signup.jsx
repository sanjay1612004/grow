import { useState, useEffect, useContext } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { UserIdProvider } from "../../App";
import Googleauth from "./Googleauth";
 
const CATEGORIES = ["F&O", "IPO", "MTF", "Stocks", "MF"];
 
const TopographicSVG = () => (

  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 460 560"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2">
      <path d="M-40,120 C40,80 120,160 200,130 C280,100 340,180 420,150 C480,130 520,160 560,140" />
      <path d="M-40,160 C60,110 150,200 240,165 C320,135 380,210 460,185 C510,168 540,190 580,175" />
      <path d="M-60,210 C30,155 130,240 220,205 C310,170 370,250 460,225 C510,210 545,228 580,215" />
      <path d="M-80,260 C20,200 110,285 210,250 C300,215 365,295 460,268 C510,252 545,268 580,258" />
      <path d="M-60,310 C40,248 140,330 230,295 C320,260 380,340 465,315 C515,298 548,315 582,305" />
      <path d="M-80,360 C30,295 130,375 230,340 C325,308 385,388 468,362 C518,346 550,362 584,352" />
      <path d="M-100,410 C20,345 120,425 222,390 C318,356 380,435 468,410 C518,394 552,410 586,400" />
      <path d="M-80,455 C30,388 132,468 232,433 C328,399 390,478 472,454 C522,438 555,454 588,445" />
      <path d="M-60,70 C60,30 160,100 250,68 C335,38 395,112 470,85 C515,70 548,88 582,78" />
      <path d="M-100,500 C25,433 128,510 230,476 C328,443 392,520 474,496 C524,480 558,496 590,487" />
      <path d="M100,20 C160,-10 230,50 310,20 C385,-8 435,55 490,30" />
      <path d="M-40,30 C40,-10 120,60 195,28" />
      <path d="M250,530 C330,500 410,550 480,525 C530,510 560,528 590,518" />
      <ellipse cx="180" cy="240" rx="90" ry="55" />
      <ellipse cx="320" cy="340" rx="70" ry="40" />
      <ellipse cx="100" cy="380" rx="60" ry="35" />
    </g>
  </svg>
);
 
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);
 
export default function Signup() {
  const [current, setCurrent] = useState(0);
  const [animState, setAnimState] = useState("visible"); // "visible" | "exit" | "enter"
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate()
  const {userId,setuserId}=useContext(UserIdProvider)

  function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

  async function signup(){
    try{
      if ((validateEmail(email)!=true)){
        throw new Error("not validate email")
      }
      else{
        const res=await axios.post("https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/email",{email},{withCredentials:true})
        console.log("res is",res)
        if(res.data.message==="User already exists. Please login."){
          navigate("/login")
        }else{
          const id=res?.data?.data?.userId
          navigate("/mobileVerification", {
  state: {
    userId: id,
  },
});
          // console.log(userId)
        }
      }
    }catch(err){
      console.log(err.message)
    }
    
  }
 
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimState("exit");
 
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % CATEGORIES.length);
        setAnimState("enter");
 
        setTimeout(() => {
          setAnimState("visible");
        }, 350);
      }, 350);
    }, 2500);
 
    return () => clearInterval(interval);
  }, []);
 
  const labelStyle = {
    display: "inline-block",
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: animState === "visible" ? 1 : 0,
    transform:
      animState === "exit"
        ? "translateY(-18px)"
        : animState === "enter"
        ? "translateY(14px)"
        : "translateY(0)",
  };
 
  const dashStyle = {
    transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    width: animState === "visible" ? "36px" : "12px",
  };
 
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Modal container */}
      <div
        className="relative bg-white rounded-2xl overflow-hidden flex"
        style={{
          width: "860px",
          minHeight: "480px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="relative flex flex-col justify-between overflow-hidden"
          style={{
            width: "44%",
            background: "#00c896",
            padding: "40px 36px 36px",
          }}
        >
          <TopographicSVG />
 
          {/* Headline */}
          <div className="relative z-10">
            <h1
              className="text-white font-bold leading-tight"
              style={{ fontSize: "33px", letterSpacing: "-0.3px" }}
            >
              Simple, Free
              <br />
              Investing.
            </h1>
          </div>
 
          {/* Animated category label */}
          <div className="relative z-10">
            <div
              style={{
                height: "4px",
                backgroundColor: "white",
                borderRadius: "2px",
                marginBottom: "10px",
                ...dashStyle,
              }}
            />
            <div style={{ overflow: "hidden", height: "32px" }}>
              <span
                style={{
                  ...labelStyle,
                  color: "white",
                  fontWeight: "600",
                  fontSize: "28px",
                  letterSpacing: "0.5px",
                }}
              >
                {CATEGORIES[current]}
              </span>
            </div>
          </div>
        </div>
 
        {/* ── RIGHT PANEL ── */}
        <div
          className="flex flex-col justify-center"
          style={{ width: "56%", padding: "48px 52px" }}
        >
          {/* Close button */}
         
          <h2
            className="text-gray-800 font-bold text-center mb-7"
            style={{ fontSize: "26px", letterSpacing: "-0.3px" }}
          >
            Welcome to Groww
          </h2>
 
          {/* Google Button */}
          {/* <button
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition-colors"
            style={{ fontSize: "15px", fontWeight: "500", color: "#3c4043", cursor: "pointer" }}
          >
            <GoogleIcon />
            Continue with Google
          </button> */}
          <Googleauth/>
 
          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-gray-400 text-sm">Or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
 
          {/* Email Input */}
          <div className="relative mb-7">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full pb-2 text-gray-800 bg-transparent outline-none text-base"
              style={{ borderBottom: `1.5px solid ${focused || email ? "#00c896" : "#d1d5db"}`, transition: "border-color 0.2s" }}
            />
            <label
              style={{
                position: "absolute",
                left: 0,
                top: focused || email ? "-14px" : "6px",
                fontSize: focused || email ? "12px" : "15px",
                color: focused ? "#00c896" : "#9ca3af",
                transition: "all 0.2s ease",
                pointerEvents: "none",
              }}
            >
              Your Email Address
            </label>
          </div>
 
          {/* Continue Button */}
          <button
            className="w-full text-white font-semibold py-3 mt-15 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "#00c896", fontSize: "16px", cursor: "pointer", border: "none" }}
            onClick={signup}
          >
            Continue
          </button>
 
          {/* T&C */}
          <p className="text-center text-gray-400 mt-4" style={{ fontSize: "12px" }}>
            By proceeding, I agree to{" "}
            <a href="#" className="text-gray-600 underline">T&C</a>{" "}
            ,{" "}
            <a href="#" className="text-gray-600 underline">Privacy Policy</a>{" "}
            &{" "}
            <a href="#" className="text-gray-600 underline">Tariff Rates</a>
          </p>
        </div>
      </div>
    </div>
  );
}
 

