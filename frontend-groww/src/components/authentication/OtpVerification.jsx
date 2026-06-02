import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(29);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId || localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/signup");
    } else {
      localStorage.setItem("userId", userId);
    }
  }, [navigate, userId]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  async function verifyOtp() {
    try {

      if (!userId) {
        throw new Error("UserId missing");
      }

      if (otp.length !== 6) {
        throw new Error("Enter valid 6 digit OTP");
      }

      console.log({
        userId,
        otp,
      });

      const res = await axios.post(
        "https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/verifyOtp",
        {
              userId: userId,

          otp:otp,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      navigate("/pin", {
        state: {
          userId,
        },
      });

    } catch (error) {
    setError("enter valid otp");

      console.log(
        error.response?.data ||
        error.message
      );

    }
  }

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center">

      <div
        className="
          relative
          w-[365px]
          bg-white
          rounded-2xl
          shadow-xl
          px-9
          pt-8
          pb-6
        "
      >

        <h1
          className="
            text-center
            text-[24px]
            font-bold
            text-[#232C3D]
          "
        >
          Enter OTP
        </h1>

        <p
          className="
            text-center
            mt-5
            text-[15px]
            text-[#8D96A5]
          "
        >
          Enter verification code
        </p>

        <div className="mt-10">

          <input
            type="tel"
            value={otp}
            maxLength={6}
            onChange={(e) =>
              setOtp(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            placeholder="Enter OTP"
            className="
              w-full
              h-[46px]
              border
              border-[#D8DCE3]
              rounded-md
              px-4
              outline-none
              text-center
              tracking-[10px]
              text-[18px]
              focus:border-[#00C58E]
            "
          />
            {error && (
    <p
      className="
        mt-2
        text-center
        text-sm
        text-red-500
      "
    >
      {error}
    </p>
  )}


        </div>

        <p
          className="
            text-center
            mt-10
            text-[#A0A8B5]
          "
        >
          Resend OTP in
          <span className="font-bold ml-1">
            {seconds}s
          </span>
        </p>

        <div className="flex justify-center">

          <button
            className="
              mt-8
              w-[140px]
              h-[42px]
              rounded-md
              bg-[#00C78C]
              text-white
              font-semibold
            "
            onClick={verifyOtp}
          >
            Confirm OTP
          </button>

        </div>

        <div
          className="
            text-center
            mt-8
            text-[14px]
          "
        >
          <span className="text-[#A1A8B4]">
            s***************@gmail.com
          </span>

          <button
            className="
              ml-2
              text-[#00B386]
              font-semibold
            "
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default OtpVerification;
