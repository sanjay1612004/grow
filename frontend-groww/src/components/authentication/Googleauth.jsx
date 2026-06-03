import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserPicture } from "../../App";

const getResponseUserId = (data) =>
  data?.userId ||
  data?._id ||
  data?.id ||
  data?.user?._id ||
  data?.user?.id ||
  data?.user?.userId;

const Googleauth = () => {
  const navigate = useNavigate();
  const {userPic,setuserPic}=useContext(UserPicture)

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;

      // token missing
      if (!idToken) {
        navigate("/login");
        return;
      }

      // optional
      const user = jwtDecode(idToken);

      console.log("Google User:", user);
      if (user?.picture) {
        localStorage.setItem("userPic", user.picture);
        setuserPic(user.picture);
      }

      const res = await axios.post(
        "https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/google",
        {
          idToken,
        },
        {
          withCredentials: true,
        }
      );

      console.log("backend response", res);

      if (
        res.status === 200 &&
        res.data?.statusCode === 200
      ) {
        const data = res.data?.data;
        const responseUserId = getResponseUserId(data);

        if (responseUserId) {
          localStorage.setItem("userId", responseUserId);
        }

        console.log("nextStep =", data?.nextStep);

        // Existing user → Login
        if (
          data?.nextStep === "LOGIN_REQUIRED" ||
          data?.redirectTo === "LOGIN_PAGE"
        ) {
          navigate("/login", {
            state: {
              userId: responseUserId,
              email: data?.email,
            },
          });

          return;
        }

        // PIN verification
        if (data?.nextStep === "PIN_REQUIRED") {
          navigate("/pin-verify", {
            state: {
              userId: responseUserId,
            },
          });

          return;
        }


        if (data?.nextStep === "VERIFY_LOGIN_PIN") {
          navigate("/pin-verify", {
            state: {
              userId: responseUserId,
            },
          });

          return;
        }

        // Mobile verification
        if ( data?.nextStep === "PHONE_REQUIRED") {
          navigate("/mobileVerification", {
            state: {
              userId: responseUserId,
            },
          });

          return;
        }

        if ( data?.nextStep === "PIN_OTP_PENDING") {
          navigate("/pin-verify", {
            state: {
              userId: responseUserId,
            },
          });

          return;
        }
      }
    } catch (err) {
      console.log(
        "google err:",
        err.response?.data?.message ||
          err.message
      );

      navigate("/login");
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");

    navigate("/login");
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        shape="pill"
        text="signin_with"
      />
    </div>
  );
};

export default Googleauth;
