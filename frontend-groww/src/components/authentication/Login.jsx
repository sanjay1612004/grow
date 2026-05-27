import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


const CATEGORIES = ["Stocks", "F&O", "IPO", "MTF", "MF"];

const TopographicSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 460 560"
    preserveAspectRatio="xMidYMid slice"
  >
    <g
      fill="none"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="1.2"
    >
      <path d="M-40,120 C40,80 120,160 200,130 C280,100 340,180 420,150 C480,130 520,160 560,140" />
      <path d="M-40,160 C60,110 150,200 240,165 C320,135 380,210 460,185 C510,168 540,190 580,175" />
      <path d="M-60,210 C30,155 130,240 220,205 C310,170 370,250 460,225 C510,210 545,228 580,215" />
      <path d="M-80,260 C20,200 110,285 210,250 C300,215 365,295 460,268 C510,252 545,268 580,258" />
      <path d="M-60,310 C40,248 140,330 230,295 C320,260 380,340 465,315 C515,298 548,315 582,305" />
      <path d="M-80,360 C30,295 130,375 230,340 C325,308 385,388 468,362 C518,346 550,362 584,352" />
      <path d="M-100,410 C20,345 120,425 222,390 C318,356 380,435 468,410 C518,394 552,410 586,400" />
      <path d="M-80,455 C30,388 132,468 232,433 C328,399 390,478 472,454 C522,438 555,454 588,445" />
      <path d="M-60,70 C60,30 160,100 250,68 C335,38 395,112 470,85" />
      <ellipse cx="180" cy="240" rx="90" ry="55" />
      <ellipse cx="320" cy="340" rx="70" ry="40" />
      <ellipse cx="100" cy="380" rx="60" ry="35" />
    </g>
  </svg>
);

const Login = () => {
  const [current, setCurrent] = useState(0);
  const [anim, setAnim] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const [email,setemail]=useState('')
  const [password,setpassword]=useState('')
  

  function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

  async function login(){
    try{
      if ((validateEmail(email)!=true)){
        throw new Error("not validate email")
      }
      else{
        const res=await axios.post("https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/login",{email,password},{withCredentials:true})
        console.log("res is",res)
        if (
      res.status === 200 &&
      res.data.statusCode === 200 &&
      res.data.data.nextStep === "PIN_REQUIRED"
    ){
              navigate("/pin-verify", {
            state: {
              userId,
            },
          })
        }else{
          setError("something went wrong")
        }

      
        
          // console.log(userId)
        
      }
    }catch(err){
      setError(err.message)
      console.log(err.message)
    }
    
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setAnim(true);

      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % CATEGORIES.length);

        setTimeout(() => {
          setAnim(false);
        }, 80);
      }, 300);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div
        className="
          w-[920px]
          h-[520px]
          bg-white
          rounded-xl
          overflow-hidden
          shadow-[0_20px_80px_rgba(0,0,0,0.15)]
          flex
        "
      >

        {/* LEFT */}

        <div
          className="
            relative
            w-[50%]
            bg-[#00c896]
            overflow-hidden
            px-8
            py-10
            flex
            flex-col
            justify-between
          "
        >

          <TopographicSVG />

          <div className="relative z-10">

            <h1
              className="
                text-white
                text-[22px]
                font-bold
                leading-[30px]
              "
            >
              Simple, Free
              <br />
              Investing.
            </h1>

          </div>

          <div className="relative z-10">

            <div
              className={`
                h-[5px]
                bg-white
                rounded
                mb-4
                transition-all
                duration-300
                ${anim ? "w-[16px]" : "w-[48px]"}
              `}
            />

            <div className="overflow-hidden h-[52px]">

              <h2
                className={`
                  text-white
                  text-[38px]
                  font-semibold
                  transition-all
                  duration-300
                  ${
                    anim
                      ? "-translate-y-12 opacity-0"
                      : "translate-y-0 opacity-100"
                  }
                `}
              >
                {CATEGORIES[current]}
              </h2>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div
          className="
            w-[50%]
            px-16
            flex
            flex-col
            justify-center
          "
        >

          <h2
            className="
              text-center
              text-[22px]
              font-bold
              text-[#374151]
            "
          >
            Welcome to Groww
          </h2>

          <h3
            className="
              text-center
              text-[22px]
              font-bold
              text-[#374151]
              mb-10
            "
          >
            Login
          </h3>

          <input
            type="email"
            placeholder="Your Email Address"
            className="
              h-[44px]
              border
              border-[#d6d6d6]
              rounded
              px-4
              mb-5
              outline-none
              focus:border-[#00c896]

            "
            value={email}
            onChange={(e)=>setemail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Your Password"
            className="
              h-[44px]
              border
              border-[#d6d6d6]
              rounded
              px-4
              mb-12
              outline-none
              focus:border-[#00c896]
            "
            value={password}
            onChange={(e)=>setpassword(e.target.value)}
          />
          {error && (
            <p
              className="
                mt-2
                text-[12px]
                text-red-500
              "
            >
              {error}
            </p>
          )}

          <button
            className="
              h-[40px]
              bg-[#00c896]
              rounded
              text-white
              font-semibold
              hover:bg-[#00b785]
              transition
            "
            onClick={login}
          >
            Log In
          </button>

          <p
            className="
              text-center
              text-[10px]
              text-[#8a8a8a]
              mt-3
            "
          >
            By proceeding, I agree to
            <span className="underline ml-1">
              T&C
            </span>
            ,
            <span className="underline ml-1">
              Privacy Policy
            </span>
            &
            <span className="underline ml-1">
              Tariff Rates
            </span>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;