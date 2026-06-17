import { createContext, useContext, useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {Routes, Route, Navigate} from 'react-router-dom';
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
import GrowwProfile from './components/UserModule/GrowwProfile'
import BasicDetails from './components/UserModule/BasicDetails'
import Reports from './components/UserModule/Reports'
import ChangePassword from './components/UserModule/ChangePassword'
import ChangeGrowwPin from './components/UserModule/ChangeGrowwPin'
import TradingControls from './components/UserModule/TradingControls'
import TradingAPIs from './components/UserModule/TradingAPIS'
import SellAuthorisationMode from './components/UserModule/SellAuthorizationMode'
import TradingDetails from './components/UserModule/TradingDetails'
import AccountRelatedForms from './components/UserModule/AccountRelatedForms'
import NomineeDetails from './components/UserModule/NomineeDetails'
import ActiveDevices from './components/UserModule/ActiveDevices'
import ReportSuspiciousActivity from './components/UserModule/ReportSuspiciousActivity'
import Balance from './components/UserModule/Balance'
import Orders from './components/UserModule/Orders'
import StocksEmptyState from './components/UserModule/StocksEmptyState'
import FOEmptyState from './components/UserModule/FOEmptyState'
import MutualFundsEmptyState from './components/UserModule/MutualFundsEmptyState'
import CardDetails from './components/Details/CardDetails'
import GrowwAssistant from './components/common/GrowwAssistant'

export const UserIdProvider=createContext()
export const UserPicture=createContext()
export const UserBalance=createContext()
export const UserEmail=createContext()
function App() {
  const [userId,setuserId]=useState(() => localStorage.getItem("userId") || "")
  const [userPic,setuserPic]=useState(() => localStorage.getItem("userPic") || "")
  const [balance, setBalance] = useState(0);
  const [email,setemail]=useState(() => localStorage.getItem("email") || "")

  const clientid=import.meta.env.VITE_GOOGLE_CLIENT_ID
  return (
    <>
    <ThemeProvider>
    <GoogleOAuthProvider clientId={clientid}>
      <UserPicture.Provider value={{userPic,setuserPic}}>
      <UserIdProvider.Provider value={{userId,setuserId}}>
      <UserBalance.Provider value={{balance, setBalance}}>
      <UserEmail.Provider value={{email,setemail}}>
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
        <Route path="/user/profile" element={<GrowwProfile />}>
          <Route index element={<Navigate to="basic-details" replace />} />
          <Route path="basic-details" element={<BasicDetails/>} />
          <Route path="reports" element={<Reports/>} />
          <Route path="change-password" element={<ChangePassword/>} />
          <Route path="change-pin" element={<ChangeGrowwPin/>} />
          <Route path="trading-controls" element={<TradingControls />} />
          <Route path="trading-apis" element={<TradingAPIs />} />
          <Route path="sell-authorisation" element={<SellAuthorisationMode />} />
          <Route path="trading-details" element={<TradingDetails />} />
          <Route path="account-forms" element={<AccountRelatedForms />} />
          <Route path="nominee-details" element={<NomineeDetails />} />
          <Route path="active-devices" element={<ActiveDevices />} />
          <Route path="report-suspicious" element={<ReportSuspiciousActivity />} />
        </Route>     
        <Route path='/user/balance/inr' element={<Balance/>}/> 
        <Route path='/user/order' element={<Orders/>}>
          <Route index element={<Navigate to="stocks" replace/>}/>
          <Route path='stocks' element={<StocksEmptyState/>}/>
          <Route path='futures-and-options' element={<FOEmptyState/>}/>
          <Route path='mutual-funds' element={<MutualFundsEmptyState/>}/>
        </Route>
        <Route path="/stocks/:name" element={<CardDetails/>}/>
      </Routes>
      </UserEmail.Provider>
      </UserBalance.Provider>
      </UserIdProvider.Provider>
      </UserPicture.Provider>
      
      <GrowwAssistant />
      </GoogleOAuthProvider>
    </ThemeProvider>
    </>
  )
}

export default App
