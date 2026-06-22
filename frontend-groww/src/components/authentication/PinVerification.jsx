import { useContext, useState } from "react";
import { Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserIdProvider } from "../../App";

const PinVerification = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { setuserId } = useContext(UserIdProvider);

  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId || localStorage.getItem("userId");

  async function pinverify(pinValue = pin) {
    try {
      setError("");

      if (!userId) {
        throw new Error("UserId missing");
      }
      localStorage.setItem("userId", userId);

      if (pinValue.length !== 4) {
        throw new Error("PIN must be exactly 4 digits");
      }

      const res = await axios.post(
        "https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/verify-login-pin",
        {
          userId,
          pin: pinValue,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      if (res.data.success) {
        setuserId(userId);
        navigate("/user/explore", {
          state: {
            userId,
          },
        });
      } else {
        setError(
          res.data.message ||
          "Invalid PIN"
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

      <div
        className="
          w-[360px]
          bg-white
          rounded-[16px]
          shadow-xl
          px-10
          pt-7
          pb-6
        "
      >

        {/* Lock */}
        <div className="flex justify-center">

          <div
            className="
              w-[54px]
              h-[54px]
              rounded-full
              border-[4px]
              border-[#00C78B]
              flex
              items-center
              justify-center
            "
          >
            <Lock
              size={26}
              strokeWidth={2.5}
              className="text-[#00C78B]"
            />
          </div>

        </div>

        {/* Heading */}
        <h1
          className="
            mt-5
            text-center
            text-[22px]
            font-bold
            text-[#2F3747]
          "
        >
          Enter Groww PIN
        </h1>

        {/* Description */}
        <p
          className="
            mt-5
            text-center
            text-[13px]
            leading-[20px]
            text-[#838B99]
          "
        >
          We Value Security, PIN helps keep your
          investments safe & secure.
        </p>

        {/* Input */}
        <div className="mt-8 flex flex-col items-center">

          <input
            value={pin}
            type="password"
            maxLength={4}
            placeholder="Enter PIN"
            className={`
              w-[134px]
              h-[38px]
              rounded-[4px]
              px-3
              text-center
              text-[18px]
              tracking-[3px]
              outline-none
              border
              ${
                error
                  ? "border-red-500"
                  : "border-[#8AB4FF]"
              }
            `}
            onChange={(e) => {

              const value =
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 4);

              setPin(value);

              setError("");

              if (value.length === 4) {
                pinverify(value);
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

        {/* Footer */}
        <div
          className="
            mt-10
            text-center
            text-[12px]
          "
        >
          <span className="text-[#B2B8C1]">
            s***************@gmail.com
          </span>

          <button
            className="
              ml-2
              text-[#00C78B]
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

export default PinVerification;
