import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SetGrowwPin = () => {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("userId");
  const [error, setError] = useState("");
  

  async function setpin() {
  try {

    setError("");

    if (!userId) {
      throw new Error("UserId missing");
    }
    localStorage.setItem("userId", userId);

    if (pin.length !== 4) {
      throw new Error("PIN must be 4 digits");
    }

    const res = await axios.post(
      "https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/set-pin",
      {
        userId,
        pin: pin,
      },
      {
        withCredentials: true,
      }
    );

    console.log(res.data);

    if (res.data.success) {

      navigate("/pin-otp", {
        state: {
          userId:userId,
        },
      });

    } else {

      setError(
        res.data.message
      );

    }

  } catch (error) {

    setError(
      error.response?.data?.message ||
      error.message
    );

    console.log(
      error.response?.data ||
      error.message
    );
  }
}


  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center">

      {/* Card */}
      <div
        className="
          w-[365px]
          rounded-[18px]
          bg-white
          shadow-lg
          px-10
          pt-6
          pb-7
        "
      >

        {/* Icon */}
        <div className="flex justify-center">

          <div
            className="
              w-[58px]
              h-[58px]
              rounded-full
              border-[5px]
              border-[#00C786]
              flex
              items-center
              justify-center
            "
          >
            <Lock
              size={28}
              strokeWidth={2.5}
              className="text-[#00C786]"
            />
          </div>

        </div>

        {/* Heading */}
        <h1
          className="
            mt-5
            text-center
            text-[19px]
            font-bold
            text-[#2C3446]
          "
        >
          Set New Groww PIN
        </h1>

        {/* Description */}
        <p
          className="
            mt-5
            text-center
            text-[14px]
            leading-6
            text-[#8A93A1]
          "
        >
          We Value Security, PIN helps keep your
          investments safe & secure.
        </p>

        {/* Input */}
        <div className="mt-10">

          <input
            value={pin}
            maxLength={4}
            type="password"
            onChange={(e) => setPin(e.target.value)}
            placeholder="Set Pin"
            className="
              w-full
              h-[46px]
              rounded-md
              border
              border-[#D8DDE4]
              px-4
              outline-none
              text-[16px]
              placeholder:text-[#B1B8C5]
              focus:border-[#00C786]
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

        {/* Button */}
        <div className="flex justify-center">

          <button
            className="
              mt-8
              w-[122px]
              h-[42px]
              rounded-md
              bg-[#00C786]
              text-white
              font-semibold
              tracking-[0.3px]
              hover:bg-[#00b57b]
              transition
            "
                        onClick={setpin}

          >
            SET PIN
          </button>

        </div>

        {/* Footer */}
        <div
          className="
            mt-8
            text-center
            text-[13px]
          "
        >
          <span className="text-[#B4BAC4]">
            s***************@gmail.com
          </span>

          <button
            className="
              ml-2
              font-semibold
              text-[#00C786]
            "
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default SetGrowwPin;
