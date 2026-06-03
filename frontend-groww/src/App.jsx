import { createContext, useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {Routes, Route} from 'react-router-dom';
import HomePage from './components/landingpage/HomePage'
import Signup from './components/authentication/Signup'
import VerifyMobile from './components/authentication/VerifyMobile'
import OtpVerification from './components/authentication/OtpVerification'
import SetGrowwPin from './components/authentication/SetGrowwPin'
import SetPassword from './components/authentication/SetPassword'
import PinVerification from './components/authentication/PinVerification'
import Login from './components/authentication/Login'
import VerifyPinOtp from './components/authentication/VerifyPinOtp'
import { GoogleOAuthProvider } from "@react-oauth/google"
import Explore from "./components/pages/Explore"
import Common from './components/pages/Common'
import GrowwMostBought from './components/pages/GrowwMostBought'
import GrowwMostTraded from './components/pages/GrowwMostTraded'
import GrowwTopMover from './components/pages/GrowwTopMover'
import GrowwSectorTrending from './components/pages/GrowwSectorTrending'
import GrowwETfs from './components/pages/GrowwETfs'
import GrowwInteradaystock from './components/pages/GrowwInteradaystock'
import GrowwStockScreener from './components/pages/GrowwStockScreener'
import GrowwStockNews from './components/pages/GrowwStockNews'
import KycFlowContainer from './components/KYC/KycFlow'
import GrowwIndicesDashboard from './components/pages/GrowwIndicesDashboard'

export const UserIdProvider=createContext()
export const UserPicture=createContext()
function App() {
  const [userId,setuserId]=useState('')
  const [userPic,setuserPic]=useState(() => localStorage.getItem("userPic") || "")
  const clientid=import.meta.env.VITE_GOOGLE_CLIENT_ID
  return (
    <>
    <GoogleOAuthProvider clientId={clientid}>
      <UserPicture.Provider value={{userPic,setuserPic}}>
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
        <Route path="/user/explore" element={<Common/>}/>
        <Route path="/user/holdings" element={<Common />} />
        <Route path="/user/positions" element={<Common />} />
        <Route path="/user/orders" element={<Common />} />
        <Route path="/user/watchlist" element={<Common />} />
        <Route path="/stocks/most-bought-stocks-on-groww" element={<GrowwMostBought/>}/>
        <Route path='/stocks/mtf/most-traded' element={<GrowwMostTraded/>}/>
        <Route path='/markets/:type?' element={<GrowwTopMover/>}/>
        <Route path="/stocks/sectors-trending" element={<GrowwSectorTrending/>}/>
        <Route path='/etf-nfo' element={<GrowwETfs/>}/>
        <Route path="/stocks/intraday" element={<GrowwInteradaystock/>}/>
        <Route path='/etfs' element={<GrowwStockScreener/>}/>
        <Route path="/market-news/stocks" element={<GrowwStockNews/>}/>
        <Route path='/kyc' element={<KycFlowContainer/>}/>
        <Route path='/indices' element={<GrowwIndicesDashboard/>}/>
      </Routes>
      </UserIdProvider.Provider>
      </UserPicture.Provider>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
