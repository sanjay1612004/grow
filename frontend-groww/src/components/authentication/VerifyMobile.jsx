import React, { useContext, useState } from "react";
import { UserIdProvider } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const VerifyMobile = () => {
//  const {userId,setuserId}=useContext(UserIdProvider)
 const [phoneNumber,setphoneNumber]=useState('')
 const navigate=useNavigate()
 const location = useLocation();
const userId = location.state?.userId || localStorage.getItem("userId");

 function validatePhone(phone) {
  const regex = /^[6-9]\d{9}$/;

  return regex.test(phone);
}

  async function handleSend() {
  try {

    if (!userId) {
      throw new Error("UserId missing");
    }
    localStorage.setItem("userId", userId);

    if (!validatePhone(phoneNumber)) {
      throw new Error("Enter valid phoneNo");
    }

    console.log({
      userId,
      phoneNumber,
    });

    const res = await axios.post(
      "https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/phone",
      {
        userId,
        phoneNumber: phoneNumber.trim(),
      },
      {
        withCredentials: true,
      }
    );

    console.log(res.data);

    navigate("/otp",{
  state: {
    userId: userId,
  },
});

  } catch (err) {

    console.log(
      err.response?.data ||
      err.message
    );

  }
}
  return (
    <div className="min-h-screen  bg-[#E5E5E5] flex items-center justify-center">

      {/* Modal */}
      <div className="w-[400px] h-[320px] bg-[#F5F5F5] rounded-lg shadow-sm">

        <div className="flex flex-col items-center pt-8">

          {/* Heading */}
          <h1 className="text-[20px] font-bold text-[#111827]">
            Verify Mobile Number
          </h1>

          {/* Input */}
          <div className="mt-16">
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              className="
                w-[245px]
                h-[46px]
                px-4
                border
                border-[#BFC3C8]
                rounded-md
                outline-none
                text-[18px]
                placeholder:text-[#9CA3AF]
                focus:border-[#00B386]
              "
              maxLength={10}
              value={phoneNumber}
              onChange={(e)=>setphoneNumber(e.target.value)}
              
            />
          </div>

          {/* Button */}
          <button
            className="
              mt-14
              w-[208px]
              h-[42px]
              rounded-md
              bg-[#00C896]
              text-white
              font-semibold
              hover:bg-[#00b887]
              transition
            "
            onClick={handleSend}
          >
            Send
          </button>

          {/* Footer */}
          <div className="mt-3 text-[14px]">
            <span className="text-black">
              Your Registered Gamil
            </span>

            <button className="ml-2 text-[#0F8A63] font-medium" >
              Logout
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default VerifyMobile;
