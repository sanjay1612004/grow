import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserName, UserPicture } from "../../App";
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
  avatar: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
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

const menuItems = [
  { key: "basic-details", label: "Basic Details" },
  { key: "reports", label: "Reports" },
  { key: "change-password", label: "Change Password" },
  { key: "change-pin", label: "Change Groww PIN" },
  { key: "trading-controls", label: "Trading controls" },
  { key: "trading-apis", label: "Trading APIs" },
  { key: "sell-authorisation", label: "Sell authorisation mode" },
  { key: "trading-details", label: "Trading Details" },
  { key: "account-forms", label: "Account Related Forms" },
  { key: "nominee-details", label: "Nominee Details" },
  { key: "active-devices", label: "Active Devices" },
  { key: "report-suspicious", label: "Report suspicious activity" },
];




export default function Sidebar() {
  const {userPic,setuserPic}=useContext(UserPicture)
  const {name,setname}=useContext(UserName)
  console.log(userPic)

  return (
    <div style={{
      width: 300,
      minWidth: 280,
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: "hidden",
      height: "fit-content",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 20px 20px",
      }}>
        <img
          src={!userPic?user.avatar:userPic}
          alt={user.name}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 12,
          }}
        />
        <span style={{ fontWeight: 600, fontSize: 15, color: TEXT_PRIMARY }}>{name??user.name}</span>
      </div>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.key}
            to={`/user/profile/${item.key}`}
            style={({ isActive }) => ({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "14px 20px",
              background: isActive ? BG_ACTIVE : "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              color: isActive ? TEXT_PRIMARY : "#374151",
              textDecoration: "none",
              transition: "background 0.15s",
            })}
            onMouseEnter={e => {
              if (e.currentTarget.getAttribute("aria-current") !== "page") {
                e.currentTarget.style.background = BG_HOVER;
              }
            }}
            onMouseLeave={e => {
              if (e.currentTarget.getAttribute("aria-current") !== "page") {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <span>{item.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
