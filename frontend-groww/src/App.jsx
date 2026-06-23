import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'
import {Routes, Route, Navigate, useLocation, useNavigate} from 'react-router-dom';
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
export const UserName=createContext()

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" && localStorage.getItem("userId");

  if (!isLoggedIn) {
    return <Navigate to="/signup" replace state={{ from: location }} />;
  }

  return children;
};

function App() {
  const [userId,setuserId]=useState(() => localStorage.getItem("userId") || "")
  const [userPic,setuserPic]=useState(() => localStorage.getItem("userPic") || "")
  const [balance, setBalance] = useState(0);
  const [email,setemail]=useState(() => localStorage.getItem("email") || "")
  const[name,setname]=useState(() => localStorage.getItem("name") || "")
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthStorageChange = (event) => {
      if (!["isLoggedIn", "userId"].includes(event.key)) return;

      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const storedUserId = localStorage.getItem("userId") || "";

      if (!isLoggedIn || !storedUserId) {
        setuserId("");
        setuserPic("");
        setemail("");
        setname("");
        setBalance(0);
        navigate("/signup", { replace: true });
        return;
      }

      setuserId(storedUserId);
    };

    window.addEventListener("storage", handleAuthStorageChange);

    return () => {
      window.removeEventListener("storage", handleAuthStorageChange);
    };
  }, [navigate]);

  useEffect(() => {
    if (!userId) return

    let cancelled = false

    axios
      .get(`https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/users/${userId}`)
      .then((res) => {
        if (cancelled) return

        const user = res.data?.data

        if (user?.email) {
          setemail(user.email)
          localStorage.setItem("email", user.email)
        }

        if (user?.name) {
          setname(user.name)
          localStorage.setItem("name", user.name)
        }
      })
      .catch((err) => console.log("Unable to load user profile:", err))

    return () => {
      cancelled = true
    }
  }, [userId])

  const clientid=import.meta.env.VITE_GOOGLE_CLIENT_ID
  return (
    <>
    <ThemeProvider>
    <GoogleOAuthProvider clientId={clientid}>
      <UserPicture.Provider value={{userPic,setuserPic}}>
      <UserIdProvider.Provider value={{userId,setuserId}}>
      <UserBalance.Provider value={{balance, setBalance}}>
      <UserEmail.Provider value={{email,setemail}}>
      <UserName.Provider value={{name,setname}}>
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
        <Route path="/user/explore" element={<ProtectedRoute><Common/></ProtectedRoute>}/>
        <Route path="/user/holdings" element={<ProtectedRoute><Common /></ProtectedRoute>} />
        <Route path="/user/positions" element={<ProtectedRoute><Common /></ProtectedRoute>} />
        <Route path="/user/orders" element={<ProtectedRoute><Common /></ProtectedRoute>} />
        <Route path="/user/watchlist" element={<ProtectedRoute><Common /></ProtectedRoute>} />
        <Route path="/stocks/most-bought-stocks-on-groww" element={<ProtectedRoute><GrowwMostBought/></ProtectedRoute>}/>
        <Route path='/stocks/mtf/most-traded' element={<ProtectedRoute><GrowwMostTraded/></ProtectedRoute>}/>
        <Route path='/markets/:type?' element={<ProtectedRoute><GrowwTopMover/></ProtectedRoute>}/>
        <Route path="/stocks/sectors-trending" element={<ProtectedRoute><GrowwSectorTrending/></ProtectedRoute>}/>
        <Route path='/etf-nfo' element={<ProtectedRoute><GrowwETfs/></ProtectedRoute>}/>
        <Route path="/stocks/intraday" element={<ProtectedRoute><GrowwInteradaystock/></ProtectedRoute>}/>
        <Route path='/etfs' element={<ProtectedRoute><GrowwStockScreener/></ProtectedRoute>}/>
        <Route path="/market-news/stocks" element={<ProtectedRoute><GrowwStockNews/></ProtectedRoute>}/>
        <Route path='/kyc' element={<ProtectedRoute><KycFlowContainer/></ProtectedRoute>}/>
        <Route path='/indices' element={<ProtectedRoute><GrowwIndicesDashboard/></ProtectedRoute>}/>
        <Route path="/user/profile" element={<ProtectedRoute><GrowwProfile /></ProtectedRoute>}>
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
        <Route path='/user/balance/inr' element={<ProtectedRoute><Balance/></ProtectedRoute>}/> 
        <Route path='/user/order' element={<ProtectedRoute><Orders/></ProtectedRoute>}>
          <Route index element={<Navigate to="stocks" replace/>}/>
          <Route path='stocks' element={<StocksEmptyState/>}/>
          <Route path='futures-and-options' element={<FOEmptyState/>}/>
          <Route path='mutual-funds' element={<MutualFundsEmptyState/>}/>
        </Route>
        <Route path="/stocks/:name" element={<ProtectedRoute><CardDetails/></ProtectedRoute>}/>
      </Routes>
      </UserName.Provider>
      </UserEmail.Provider>
      </UserBalance.Provider>
      </UserIdProvider.Provider>
      </UserPicture.Provider>
      {userId && localStorage.getItem("isLoggedIn") === "true" && <GrowwAssistant />}
      </GoogleOAuthProvider>
    </ThemeProvider>
    </>
  )
}

export default App
