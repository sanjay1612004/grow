import { useState,useEffect, useContext } from "react";
import FieldRow from "./FieldRow";
import axios from "axios";
import { UserEmail } from "../../App";


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

export default function BasicDetails() {
  const[User,setUser]=useState([])
  const {email,setemail}=useContext(UserEmail)
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }

      const res = await axios.get(
        `https://j9cw5kv2-5000.inc1.devtunnels.ms/api/auth/users/${userId}`
      );

      console.log(res.data);
      setUser(res.data.data);
      if (res.data?.data?.email) {
          setemail(res.data.data.email);
          localStorage.setItem("email", res.data.data.email);

        }
     

    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  fetchUser();
}, []);

  return (
    
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 28px", borderBottom: `1px solid ${BORDER}` }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>Personal Details</h2>
      </div>
      <FieldRow label="Name" value={User?.name || user.name} />
      <FieldRow label="Date of Birth" value={user.dob} />
      <FieldRow label="Mobile Number" value={User?.phoneNumber || user.mobile} editable />
      <FieldRow label="Email Address" value={User?.email || user.email} editable />
      <FieldRow label="Marital Status" value={user.maritalStatus} />
      <FieldRow label="Gender" value={user.gender} />
      <FieldRow label="Income Range" value={user.incomeRange} />
      <FieldRow label="Occupation" value={user.occupation} />
    </div>
  );
}
