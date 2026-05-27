import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const userId =
    location.state?.userId;

  async function setpassword() {
    try {

      setError("");

      if (!userId) {
        throw new Error(
          "UserId missing"
        );
      }

      if (
        !password ||
        !confirmPassword
      ) {
        throw new Error(
          "Enter both passwords"
        );
      }

      if (
        password !==
        confirmPassword
      ) {
        throw new Error(
          "Passwords didn't match"
        );
      }

      const res =
        await axios.post(
          "https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/set-password",
          {
            userId,
            password,
          },
          {
            withCredentials: true,
          }
        );

      console.log(
        res.data
      );

      if (res.data.success) {

        navigate("/login",{
          state: {
            userId,
          },
        });

      } else {

        setError(
          res.data.message
        );

      }

    } catch (
      error
    ) {

      setError(
        error.response
          ?.data
          ?.message ||
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
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center">

      <div
        className="
          w-[365px]
          bg-white
          rounded-[18px]
          shadow-xl
          px-10
          pt-6
          pb-7
        "
      >

        {/* Icon */}
        <div className="flex justify-center">

          <div
            className="
              w-[60px]
              h-[60px]
              rounded-full
              border-[5px]
              border-[#00C786]
              flex
              items-center
              justify-center
            "
          >
            <Lock
              size={30}
              strokeWidth={2.5}
              className="text-[#00C786]"
            />
          </div>

        </div>

        {/* Heading */}
        <h1
          className="
            mt-6
            text-center
            text-[18px]
            font-bold
            text-[#2E3648]
          "
        >
          Set New Groww Password
        </h1>

        {/* Subtitle */}
        <p
          className="
            mt-5
            text-center
            text-[14px]
            leading-6
            text-[#8B93A0]
          "
        >
          We Value Security,
          Password helps keep
          your Account Safe &
          Secure.
        </p>

        {/* Password */}
        <input
          type="password"
          value={password}
          placeholder="Set Password"
          onChange={(e) => {
            setPassword(
              e.target.value
            );

            setError("");
          }}
          className="
            mt-10
            w-full
            h-[46px]
            px-4
            rounded-md
            border
            border-[#D9DEE5]
            outline-none
            text-[15px]
            focus:border-[#00C786]
          "
        />

        {/* Confirm */}
        <input
          type="password"
          value={
            confirmPassword
          }
          placeholder="Confirm Password"
          onChange={(e) => {
            setConfirmPassword(
              e.target.value
            );

            setError("");
          }}
          className={`
            mt-6
            w-full
            h-[46px]
            px-4
            rounded-md
            border
            outline-none
            text-[15px]
            ${
              error
                ? "border-red-500"
                : "border-[#D9DEE5]"
            }
          `}
        />

        {/* Error */}
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

        {/* Button */}
        <div className="flex justify-center">

          <button
            onClick={
              setpassword
            }
            className="
              mt-8
              w-[128px]
              h-[42px]
              rounded-md
              bg-[#00C786]
              text-white
              font-semibold
              hover:bg-[#00b57b]
            "
          >
            SET Password
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
          <span className="text-[#B3BAC4]">
            s*************@gmail.com
          </span>

          <button
            className="
              ml-2
              text-[#00C786]
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

export default SetPassword;