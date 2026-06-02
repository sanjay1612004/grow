import React, { useState, useEffect } from "react";
import axios from "axios";
import { Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyPinOtp = () => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(30);
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

  async function verifyPinOtp(
    otpValue = otp
  ) {
    try {

      setError("");

      if (!userId) {
        throw new Error(
          "UserId missing"
        );
      }

      if (otpValue.length !== 6) {
        throw new Error(
          "Enter valid 6 digit OTP"
        );
      }

      const res =
        await axios.post(
          "https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/verify-pin-otp",
          {
            userId,
            otp: otpValue,
          },
          {
            withCredentials: true,
          }
        );

      console.log(res.data);

      if (res.data.success) {

        navigate(
          "/password-set",
          {
            state: {
              userId,
            },
          }
        );

      } else {

        setError(
          res.data.message
        );

      }

    } catch (error) {

      setError(
        error.response
          ?.data?.message ||
        error.message
      );

      console.log(
        error.response
          ?.data ||
        error.message
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#8e8e8e] flex items-center justify-center">

      <div
        className="
          w-[410px]
          bg-white
          rounded-[14px]
          shadow-[0_12px_30px_rgba(0,0,0,0.15)]
          px-10
          py-8
        "
      >

        {/* Icon */}
        <div className="flex justify-center">

          <div
            className="
              w-[48px]
              h-[48px]
              rounded-full
              border-[4px]
              border-[#00C78B]
              flex
              items-center
              justify-center
            "
          >
            <Lock
              size={22}
              strokeWidth={2.6}
              className="
                text-[#00C78B]
              "
            />
          </div>

        </div>

        {/* Heading */}
        <h1
          className="
            mt-5
            text-center
            text-[20px]
            font-bold
            text-[#2E3747]
          "
        >
          Please enter OTP
          to verify PIN
        </h1>

        {/* Subtitle */}
        <div className="mt-7 text-center">

          <p
            className="
              text-[11px]
              text-[#A2A8B1]
            "
          >
            An OTP has been
            sent to
            s***********@gmail.com
          </p>

          <button
            className="
              mt-1
              text-[#00C78B]
              text-[12px]
              font-semibold
            "
          >
            Logout
          </button>

        </div>

        {/* Input */}
        <div className="mt-8 flex flex-col items-center">

          <input
            type="tel"
            value={otp}
            maxLength={6}
            placeholder="Enter OTP"
            className={`
              w-[150px]
              h-[34px]
              px-3
              rounded-[4px]
              text-center
              outline-none
              tracking-[4px]
              border
              ${
                error
                  ? "border-red-500"
                  : "border-[#D7DCE3]"
              }
            `}
            onChange={(e) => {

              const value =
                e.target.value
                  .replace(
                    /\D/g,
                    ""
                  )
                  .slice(
                    0,
                    6
                  );

              setOtp(
                value
              );

              setError(
                ""
              );

              if (
                value.length ===
                6
              ) {
                verifyPinOtp(
                  value
                );
              }

            }}
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

        </div>

        {/* Timer */}
        <p
          className="
            mt-12
            text-center
            text-[12px]
            text-[#9AA2AF]
          "
        >
          Resend in
          <span className="ml-1 font-semibold">
            {seconds}
            s
          </span>
        </p>

      </div>

    </div>
  );
};

export default VerifyPinOtp;
