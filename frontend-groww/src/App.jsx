import { createContext, useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {Routes, Route} from 'react-router-dom';
import HomePage from './components/HomePage'
import Signup from './components/authentication/Signup'
import VerifyMobile from './components/authentication/VerifyMobile'
import OtpVerification from './components/authentication/OtpVerification'
import SetGrowwPin from './components/authentication/SetGrowwPin'
import SetPassword from './components/authentication/SetPassword'
import PinVerification from './components/authentication/PinVerification'
import Login from './components/authentication/Login'
import VerifyPinOtp from './components/authentication/VerifyPinOtp'
import { GoogleOAuthProvider } from "@react-oauth/google"



export const UserIdProvider=createContext()
function App() {
  const [userId,setuserId]=useState('')
  const clientid=import.meta.env.VITE_GOOGLE_CLIENT_ID
  return (
    <>
    <GoogleOAuthProvider clientId={clientid}>
      <UserIdProvider.Provider value={{userId,setuserId}}>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/mobileVerification" element={<VerifyMobile/>}/>
        <Route path="/otp" element={<OtpVerification/>}/>
        <Route path="/pin" element={<SetGrowwPin/>}/>
        <Route path="/pin-otp" element={<VerifyPinOtp/>}/>
        <Route path="/password-set" element={<SetPassword/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="/pin-verify" element={<PinVerification/>}/>
      </Routes>
      </UserIdProvider.Provider>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
