import { useState, useEffect, useContext } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { UserIdProvider, UserName } from "../../App";
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
 
const getResponseUserId = (data) =>
  data?.userId ||
  data?._id ||
  data?.id ||
  data?.user?._id ||
  data?.user?.id ||
  data?.user?.userId;
 
export default function Signup() {
  const [current, setCurrent] = useState(0);
  const [animState, setAnimState] = useState("visible"); // "visible" | "exit" | "enter"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const {setuserId}=useContext(UserIdProvider)
  const {setname}=useContext(UserName)

  function validateEmail(email) {
    const regex = /^(?=[^@]*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  async function signup(){
    try{
      setError("")
      const trimmedName = name.trim()
      const trimmedEmail = email.trim().toLowerCase()


      if (trimmedName.length < 2) {
        throw new Error("Please enter your full name")
      }
      if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
        throw new Error("Name can contain only letters and spaces");
      }
      if (!validateEmail(trimmedEmail)){
        throw new Error("Please enter a valid email address")
      }
      else{
        const res=await axios.post(
          "https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/email",
          { name: trimmedName, email: trimmedEmail },
          {withCredentials:true}
        )
        console.log("res is",res)
        if(res.data.message==="User already exists. Please login."){
          navigate("/login")
        }else{
          const id = getResponseUserId(res?.data?.data);
          if (id) {
            localStorage.setItem("userId", id);
            setuserId(id)
          }
          localStorage.setItem("name", trimmedName)
          setname(trimmedName)
          navigate("/mobileVerification", {
  state: {
    userId: id,
  },
});
          // console.log(userId)
        }
      }
    }catch(err){
      setError(err.response?.data?.message || err.message)
      console.log(err.message)
        console.log("FULL ERROR:", err);
  console.log("RESPONSE:", err.response);
  console.log("REQUEST:", err.request);
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
 
          {/* Name Input */}
          <div className="relative mb-7">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField("")}
              autoComplete="name"
              className="w-full pb-2 text-gray-800 bg-transparent outline-none text-base"
              style={{ borderBottom: `1.5px solid ${focusedField === "name" || name ? "#00c896" : "#d1d5db"}`, transition: "border-color 0.2s" }}
            />
            <label
              style={{
                position: "absolute",
                left: 0,
                top: focusedField === "name" || name ? "-14px" : "6px",
                fontSize: focusedField === "name" || name ? "12px" : "15px",
                color: focusedField === "name" ? "#00c896" : "#9ca3af",
                transition: "all 0.2s ease",
                pointerEvents: "none",
              }}
            >
              Your Full Name
            </label>
          </div>

          {/* Email Input */}
          <div className="relative mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              autoComplete="email"
              className="w-full pb-2 text-gray-800 bg-transparent outline-none text-base"
              style={{ borderBottom: `1.5px solid ${focusedField === "email" || email ? "#00c896" : "#d1d5db"}`, transition: "border-color 0.2s" }}
            />
            <label
              style={{
                position: "absolute",
                left: 0,
                top: focusedField === "email" || email ? "-14px" : "6px",
                fontSize: focusedField === "email" || email ? "12px" : "15px",
                color: focusedField === "email" ? "#00c896" : "#9ca3af",
                transition: "all 0.2s ease",
                pointerEvents: "none",
              }}
            >
              Your Email Address
            </label>
          </div>

          {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
 
          {/* Continue Button */}
          <button
            className="w-full text-white font-semibold py-3 mt-6 rounded-lg transition-opacity hover:opacity-90"
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
 
