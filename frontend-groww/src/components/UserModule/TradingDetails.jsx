import { useState } from "react";

const TEAL = "#00b386";
const TEAL_LIGHT = "#e6f7f3";
const BORDER = "#e8e8e8";
const TEXT_PRIMARY = "#222";
const TEXT_SECONDARY = "#6b7280";
const TEXT_MUTED = "#9ca3af";
const BG_HOVER = "#f7f7f7";
const BG_ACTIVE = "#f0f0f0";

const user = {
  name: "Sanjay Balaji",
  avatar: "https://i.pravatar.cc/80?img=12",
  mobile: "*****89425",
  email: "san***********s@gmail.com",
  dob: "-",
  maritalStatus: "-",
  gender: "-",
  incomeRange: "-",
  occupation: "-",
  pan: "ABCPS1234D",
  ucc: "8605965652",
  dpId: "-",
  dematAccNumber: "-",
  depository: "Groww Invest Tech Pvt. Ltd.",
  depositoryName: "CDSL",
};

const segments = [
  "NSE equity",
  "BSE equity",
  "Mutual funds",
  "Futures and Options"
];

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ flex: "1 1 200px" }}>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, color: TEXT_PRIMARY, fontWeight: 500 }}>{value}</span>
        <button
          onClick={copy}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: copied ? TEAL : TEXT_MUTED }}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function TradingDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckboxClick = (e) => {
    e.preventDefault(); // Prevent checkbox from toggling
    setIsModalOpen(true); // Open the modal instead
  };

  return (
    <div className="relative space-y-6">
      {/* Segments Container */}
      <div className="max-w-4xl border border-gray-100 shadow-sm rounded-lg p-8 bg-white font-sans">
        <h2 className="text-[17px] font-semibold text-[#3b4b60] mb-8">
          These segments are enabled for your account
        </h2>

        <div className="flex flex-col space-y-6">
          {segments.map((segment, index) => (
            <label key={index} className="flex items-center cursor-pointer group w-max">
              <input
                type="checkbox"
                onClick={handleCheckboxClick}
                className="w-[18px] h-[18px] border-gray-400 rounded-sm text-blue-600 focus:ring-0 cursor-pointer appearance-none border checked:bg-blue-600 checked:border-transparent relative"
              />
              <span className="ml-3 text-[15px] text-[#71849a]">
                {segment}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Trading Details Container */}
      <div className="max-w-4xl" style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        overflow: "hidden",
      }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>Trading Details</h2>
        </div>
        <div style={{ padding: "24px", display: "flex", flexWrap: "wrap", gap: "24px 48px" }}>
          <CopyField label="Unique Client Code" value={user.ucc} />
          <CopyField label="Demat Acc Number / BOID" value={user.dematAccNumber} />
          <CopyField label="DP ID" value={user.dpId} />
          <CopyField label="Depository Participant" value={user.depository} />
          <CopyField label="Depository Name" value={user.depositoryName} />
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center font-sans">
          <div className="bg-white rounded-md shadow-xl w-[450px] p-8 relative mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[18px] font-semibold text-[#44475b]">
                Enabling or disabling a segment
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <p className="text-[14px] text-[#44475b] leading-relaxed mb-6 pr-4">
              If you wish to update the segments you want to trade in, please write to us at support@groww.in and our support will help you out.
            </p>
            
            {/* Modal Footer Link */}
            <div className="flex items-center text-[#00b386] font-medium text-[14px] cursor-pointer hover:opacity-80 transition-opacity w-max">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Help and FAQs
            </div>
          </div>
        </div>
      )}
    </div>
  );
}