import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileDropdown from './ProfileDropdown'
import { UserBalance, UserPicture } from '../../App';

const Balance = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [kycStatus, setKycStatus] = useState(null);
    const [loadingKyc, setLoadingKyc] = useState(true);
    const [amount, setAmount] = useState(100);
    const [activeTab, setActiveTab] = useState('add');
    const { userPic, setuserPic } = useContext(UserPicture);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const{balance, setBalance}=useContext(UserBalance)


useEffect(() => {
  fetchBalance();
}, []);

const fetchBalance = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/wallet/balance/${userId}`
    );

    setBalance(res.data.balance);
  } catch (err) {
    console.log(err);
  }
};


  const handleAddMoney = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/wallet/add-money",
        {
          userId,
          amount: Number(amount),
        }
      );

      alert("Money added successfully");
      console.log(res.data);
      setBalance(res.data.balance);
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Failed to add money");
    } finally {
      setLoading(false);
    }
  };


    

    useEffect(() => {
        const fetchKycStatus = async () => {
            try {
                const storedUserId = localStorage.getItem("userId");
                const res = await axios.get(
                    `https://j9cw5kv2-5000.inc1.devtunnels.ms/api/kyc/me?userId=${storedUserId}`
                );
                const { status } = res.data.message;
                console.log("KYC Status from API:", status);
                setKycStatus(status);
            } catch (err) {
                console.error("KYC status fetch error:", err);
            } finally {
                setLoadingKyc(false);
            }
        };
        fetchKycStatus();
    }, []);

    if (loadingKyc) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <nav className="relative bg-white/60 backdrop-blur-md sticky top-0 z-[100] flex items-center justify-between h-[60px] px-[60px] border-b border-[#e8e8e8]">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <Link to="/user/explore">
                                <img src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp" alt="" />
                            </Link>
                        </div>
                    </div>
                    {["Stocks", "F&O", "Mutual Funds"].map(item => (
                        <span key={item} className="text-[18px] font-semibold cursor-pointer text-gray-500">{item}</span>
                    ))}
                </div>
                <div className="flex-1 max-w-xs ml-auto mr-3">
                    <div className="flex items-center bg-gray-200 border border-gray-200 rounded-lg px-3 h-9 gap-2 focus-within:border-gray-400 focus-within:bg-white transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                            <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
                            <path d="M20 20l-3-3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search Groww...."
                            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none"
                        />
                        <span className="text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5 flex-shrink-0">Ctrl+K</span>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <img
                        src={!userPic ? "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" : userPic}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover"
                        onClick={() => setShowProfile(!showProfile)}
                    />
                    <div className="relative">
                        {showProfile && (
                            <div className="absolute right-0 top-10 z-[9999]">
                                <ProfileDropdown />
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {kycStatus === "APPROVED" ? (
                <div className="max-w-5xl mx-auto mt-10 px-6 flex flex-col md:flex-row gap-6">
                    {/* Left card */}
                    <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-6 text-center border-b border-dashed border-gray-200">
                            <p className="text-sm font-semibold text-gray-500">Stocks, F&O balance</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                ₹{balance}<span className="text-base align-bottom">.00</span>
                            </p>
                        </div>
                        <div className="p-6 space-y-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Cash</span>
                                <span className="text-gray-800 border-b border-dashed border-gray-300 pb-0.5">₹0.00</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-700">Pledge</p>
                                    <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                        Add balance for stocks intraday and F&O by pledging your holdings on Groww
                                    </p>
                                </div>
                                <span className="text-gray-800 border-b border-dashed border-gray-300 pb-0.5">Add</span>
                            </div>
                        </div>

                        <Link to="/transactions" className="flex justify-between items-center p-6 border-b border-gray-200 hover:bg-gray-50">
                            <span className="font-semibold text-gray-800">All transactions</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>

                        <div className="flex justify-between items-center p-6">
                            <div>
                                <p className="font-semibold text-gray-800">Instant trade balance</p>
                                <p className="text-xs text-gray-400 mt-1">Get ₹0 for Intraday, MTF & FnO</p>
                            </div>
                            <button className="bg-[#e6f7f3] text-[#04B488] font-semibold text-sm px-4 py-1.5 rounded">
                                Pledge
                            </button>
                        </div>
                    </div>

                    {/* Right card */}
                    <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('add')}
                                className={`flex-1 py-4 font-semibold text-sm border-b-2 ${activeTab === 'add' ? 'text-[#04B488] border-[#04B488]' : 'text-gray-400 border-transparent'}`}
                            >
                                Add money
                            </button>
                            <button
                                onClick={() => setActiveTab('withdraw')}
                                className={`flex-1 py-4 font-semibold text-sm border-b-2 ${activeTab === 'withdraw' ? 'text-[#04B488] border-[#04B488]' : 'text-gray-400 border-transparent'}`}
                            >
                                Withdraw
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center py-10 border-b border-gray-200">
                            <div className="mb-6">
                                <div className="flex items-center justify-center">
                                    <span className="text-4xl font-bold text-gray-800 ">₹</span>

                                    <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="text-4xl font-bold text-gray-800 bg-transparent outline-none border-none w-34 px-3"
                                    placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {[1000, 5000, 10000].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(prev => prev + val)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full"
                                    >
                                        +₹{val.toLocaleString('en-IN')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
                            <div className="w-9 h-9 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M2 8l10-6 10 6-10 6z" fill="#FF6B35" />
                                    <path d="M2 8v8l10 6V14z" fill="#138808" />
                                    <path d="M22 8v8l-10 6V14z" fill="#3399FF" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Scan QR to pay</p>
                                <p className="text-xs text-gray-400">INDIAN OVERSEAS BANK ••••9791</p>
                            </div>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>

                        <button className="bg-[#04B488] text-white font-bold py-4 hover:bg-[#039a76] transition-colors" onClick={handleAddMoney}>
                            Add money
                        </button>
                    </div>
                </div>
            ) : (
                <div className='flex justify-center items-center h-screen flex-col'>
                    <img src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/non_onboarded_wallet.11dfb63f.svg" alt="" width={300} height={300} />
                    <p className='font-bold text-gray-700 mt-10'>Invest faster with Groww Balance</p>
                    <p className='mt-5 text-gray-700'>No bank login, no OTP,no waiting -Add money now !</p>
                    <button className='uppercase bg-[#04B488] text-white px-3 py-1 mt-10 rounded text-sm font-bold' onClick={() => navigate('/kyc')}>start investing</button>
                </div>
            )}
        </div>
    )
}

export default Balance