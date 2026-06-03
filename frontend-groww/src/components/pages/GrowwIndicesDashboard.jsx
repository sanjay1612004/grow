import { useState, useEffect, useRef, useContext } from "react";
import Footer from "../landingpage/Footer";
import { UserPicture } from "../../App";
import { NavLink } from "react-router-dom";

// ─── Groww Design Tokens (from source CSS) ───────────────────────────────────
// --green9: #04b488  (accent/positive)
// --red9:   #ed5533  (negative)
// --gray900:#44475b  (content-primary)
// --gray700:#7c7e8c  (content-secondary)
// --gray500:#a1a3ad  (content-tertiary)
// --gray150:#e9e9eb  (border-primary)
// --gray100:#f0f0f2  (background-tertiary)
// --gray50: #f8f8f8  (background-secondary)
// Font: GrowwSans (variable), Soehne (headings/display)
// ─────────────────────────────────────────────────────────────────────────────

const GROWW_ACCENT   = "#04b488";
const GROWW_NEGATIVE = "#ed5533";
const GROWW_GRAY900  = "#44475b";
const GROWW_GRAY700  = "#7c7e8c";
const GROWW_GRAY500  = "#a1a3ad";
const GROWW_GRAY150  = "#e9e9eb";
const GROWW_GRAY100  = "#f0f0f2";
const GROWW_GRAY50   = "#f8f8f8";

// ─── Static Data ─────────────────────────────────────────────────────────────

const INDIAN_INDICES = [
  { header: { searchId: "nifty", displayName: "NIFTY 50", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/GIDXNIFTY.png", isFnoEnabled: true, isNseFnoEnabled: true }, yearLow: 22182.55, yearHigh: 26373.2, ltp: 24945.30, change: 123.45, changePerc: 0.50, high: 24978.60, low: 24821.10, open: 24845.00, prevClose: 24821.85 },
  { header: { searchId: "nifty-bank", displayName: "NIFTY Bank", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/GIDXNIFTYBANK.png", isFnoEnabled: true, isNseFnoEnabled: true }, yearLow: 49954.85, yearHigh: 61764.85, ltp: 55432.10, change: -312.80, changePerc: -0.56, high: 55892.40, low: 55123.60, open: 55800.00, prevClose: 55744.90 },
  { header: { searchId: "nifty-financial-services", displayName: "Nifty Financial Services", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/GIDXNIFTYFIN.png", isFnoEnabled: true, isNseFnoEnabled: true }, yearLow: 23373.95, yearHigh: 28562.5, ltp: 25867.40, change: 198.20, changePerc: 0.77, high: 25912.30, low: 25680.10, open: 25700.00, prevClose: 25669.20 },
  { header: { searchId: "sp-bse-sensex", displayName: "Bse Sensex", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/GIDXBSESN.png", isFnoEnabled: true, isBseFnoEnabled: true }, yearLow: 71545.81, yearHigh: 86159.02, ltp: 82145.60, change: 410.80, changePerc: 0.50, high: 82356.40, low: 81734.20, open: 81800.00, prevClose: 81734.80 },
  { header: { searchId: "nifty-midcap-select", displayName: "Nifty Midcap Select", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/GIDXNIFTYMIDSELECT.png", isFnoEnabled: true }, yearLow: 12046.2, yearHigh: 14770.5, ltp: 13245.80, change: -56.30, changePerc: -0.42, high: 13356.40, low: 13189.20, open: 13310.00, prevClose: 13302.10 },
  { header: { searchId: "sp-bse-bankex", displayName: "Bse Bankex", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/GIDXBSEBANK.png", isFnoEnabled: true, isBseFnoEnabled: true }, yearLow: 56230.38, yearHigh: 69406.97, ltp: 63218.40, change: 340.60, changePerc: 0.54, high: 63456.80, low: 62878.00, open: 62910.00, prevClose: 62877.80 },
  { header: { searchId: "india-vix", displayName: "India Vix", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/GIDXNIFTY.png", isFnoEnabled: false }, yearLow: 8.72, yearHigh: 28.91, ltp: 14.82, change: 0.56, changePerc: 3.93, high: 15.10, low: 14.21, open: 14.30, prevClose: 14.26 },
  { header: { searchId: "nifty-total-market-index", displayName: "Nifty Total Market", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: false }, yearLow: 11436.55, yearHigh: 13548, ltp: 12734.20, change: 62.40, changePerc: 0.49, high: 12789.60, low: 12672.10, open: 12690.00, prevClose: 12671.80 },
  { header: { searchId: "nifty-next", displayName: "Nifty Next 50", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: true }, yearLow: 59896.1, yearHigh: 72442.15, ltp: 68234.60, change: 312.40, changePerc: 0.46, high: 68456.20, low: 67921.80, open: 67980.00, prevClose: 67922.20 },
  { header: { searchId: "nifty-218500", displayName: "NIFTY 100", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: false }, yearLow: 22720.45, yearHigh: 26975.15, ltp: 25189.40, change: 123.60, changePerc: 0.49, high: 25234.80, low: 25065.20, open: 25080.00, prevClose: 25065.80 },
  { header: { searchId: "nifty-midcap", displayName: "NIFTY Midcap 100", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: false }, yearLow: 52032.85, yearHigh: 62907.5, ltp: 57834.20, change: -189.60, changePerc: -0.33, high: 58123.40, low: 57644.80, open: 58034.00, prevClose: 58023.80 },
  { header: { searchId: "nifty-it", displayName: "NIFTY IT", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: false }, yearLow: 27078, yearHigh: 40301.4, ltp: 35678.90, change: -234.50, changePerc: -0.65, high: 36012.40, low: 35534.20, open: 35980.00, prevClose: 35913.40 },
  { header: { searchId: "nifty-pharma", displayName: "NIFTY Pharma", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: false }, yearLow: 21149.9, yearHigh: 25043.15, ltp: 22934.60, change: 167.80, changePerc: 0.74, high: 23012.40, low: 22766.80, open: 22789.00, prevClose: 22766.80 },
  { header: { searchId: "nifty-auto", displayName: "NIFTY Auto", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: false }, yearLow: 22915.65, yearHigh: 29179.1, ltp: 26234.80, change: 89.30, changePerc: 0.34, high: 26345.60, low: 26145.20, open: 26167.00, prevClose: 26145.50 },
  { header: { searchId: "nifty-fmcg", displayName: "Nifty FMCG", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: false }, yearLow: 45334.15, yearHigh: 58485.05, ltp: 52145.60, change: -123.40, changePerc: -0.24, high: 52456.80, low: 51978.20, open: 52234.00, prevClose: 52269.00 },
  { header: { searchId: "nifty-metal", displayName: "NIFTY Metal", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: false }, yearLow: 8997.35, yearHigh: 13873.75, ltp: 10234.60, change: -67.80, changePerc: -0.66, high: 10345.20, low: 10167.40, open: 10298.00, prevClose: 10302.40 },
  { header: { searchId: "nifty-psu-bank", displayName: "NIFTY PSU Bank", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: false }, yearLow: 6709.1, yearHigh: 9918.65, ltp: 8234.90, change: 112.40, changePerc: 1.38, high: 8312.60, low: 8122.40, open: 8145.00, prevClose: 8122.50 },
  { header: { searchId: "nifty-smallcap-100", displayName: "NIFTY Smallcap 100", logoUrl: "https://assets-netstorage.groww.in/stock-assets/logos/NSE.png", isFnoEnabled: false }, yearLow: 14986, yearHigh: 19224.95, ltp: 16745.30, change: -78.20, changePerc: -0.46, high: 16923.40, low: 16667.80, open: 16823.00, prevClose: 16823.50 },
];

const GLOBAL_INDICES = [
  { name: "GIFT NIFTY", flag: "🇮🇳", time: "02 Jun, 03:49 PM", ltp: 23579.50, change: 138.00, changePerc: 0.59, high: 23618.00, low: 23230.00, open: 23400.50, prevClose: 23441.50 },
  { name: "Dow", flag: "🇺🇸", time: "02 Jun, 01:34 AM", ltp: 51099.89, change: 46.43, changePerc: 0.09, high: 51182.10, low: 50788.32, open: 51182.10, prevClose: 51053.46 },
  { name: "Dow Futures", flag: "🇺🇸", time: "02 Jun, 04:22 PM", ltp: 50875.50, change: -203.40, changePerc: -0.40, high: 51082.40, low: 50816.90, open: 50959.00, prevClose: 51078.90 },
  { name: "S&P", flag: "🇺🇸", time: "02 Jun, 04:22 PM", ltp: 7612.00, change: -13.25, changePerc: -0.17, high: 7624.00, low: 7588.50, open: 7624.00, prevClose: 7625.25 },
  { name: "NIKKEI", flag: "🇯🇵", time: "02 Jun, 12:15 PM", ltp: 66734.24, change: -200.09, changePerc: -0.30, high: 66748.06, low: 65551.13, open: 66629.60, prevClose: 66934.33 },
  { name: "HANG SENG", flag: "🇭🇰", time: "02 Jun, 01:39 PM", ltp: 26038.33, change: 640.14, changePerc: 2.52, high: 26046.50, low: 25394.64, open: 25395.07, prevClose: 25398.19 },
  { name: "DAX", flag: "🇩🇪", time: "02 Jun, 04:22 PM", ltp: 25243.00, change: 163.50, changePerc: 0.65, high: 25364.00, low: 24983.00, open: 25065.30, prevClose: 25079.50 },
  { name: "CAC", flag: "🇫🇷", time: "02 Jun, 04:22 PM", ltp: 8205.90, change: 59.31, changePerc: 0.73, high: 8244.61, low: 8147.15, open: 8147.15, prevClose: 8146.59 },
  { name: "KOSPI", flag: "🇰🇷", time: "02 Jun, 12:02 PM", ltp: 8801.49, change: 13.11, changePerc: 0.15, high: 8933.62, low: 8503.12, open: 8883.19, prevClose: 8788.38 },
  { name: "FTSE 100", flag: "🇬🇧", time: "02 Jun, 04:22 PM", ltp: 10376.28, change: 37.33, changePerc: 0.36, high: 10395.71, low: 10338.38, open: 10338.38, prevClose: 10338.95 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n, dec = 2) {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function fmtChange(change, perc) {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${fmt(change)} (${sign}${Math.abs(perc).toFixed(2)}%)`;
}

const NOW_STR = (() => {
  const d = new Date();
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit", hour12: true
  });
})();

// ─── World Map SVG ───────────────────────────────────────────────────────────
// Countries: US/Japan = red (negative), India/China/HK/Europe = green (positive)



// ─── Logo with fallback ───────────────────────────────────────────────────────

function IndexLogo({ logoUrl, displayName }) {
  const [err, setErr] = useState(false);
  // lc21 = 110×84 container, 45px left — from the CSS snippet you found
  if (err) {
    return (
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "#f0f0f2", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 10, fontWeight: 600,
        color: GROWW_GRAY700, flexShrink: 0
      }}>
        {displayName.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={logoUrl}
      alt={displayName}
      onError={() => setErr(true)}
      style={{
        width: 32, height: 32, borderRadius: "50%",
        objectFit: "contain", flexShrink: 0, background: "#fff",
        border: `1px solid ${GROWW_GRAY150}`
      }}
    />
  );
}

// ─── Table Header ─────────────────────────────────────────────────────────────
// From AllIndicesTableHeader_header__yvwm8: border-bottom, z-index 500

function TableHeader() {
  const cols = [
    { label: "Index name", align: "left", width: "28%" },
    { label: "Last traded", align: "right", width: "12%" },
    { label: "Day change", align: "right", width: "16%" },
    { label: "High", align: "right", width: "11%" },
    { label: "Low", align: "right", width: "11%" },
    { label: "Open", align: "right", width: "11%" },
    { label: "Prev. Close", align: "right", width: "11%" },
  ];
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: cols.map(c => c.width).join(" "),
      borderBottom: `1px solid ${GROWW_GRAY150}`,
      padding: "10px 16px",
      background: "#fff",
      position: "sticky", top: 0, zIndex: 10
    }}>
      {cols.map(col => (
        <div key={col.label} style={{
          fontSize: 12,
          fontWeight: 435,
          color: GROWW_GRAY700,
          textAlign: col.align,
          fontFamily: "GrowwSans, system-ui, sans-serif",
          lineHeight: "18px"
        }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

// ─── Indian Indices Row ───────────────────────────────────────────────────────
// AllIndicesDataTableBodyRow_name__kSOfL: ml-12, flex-col, min-h-30, justify-center
// AllIndicesDataTableBodyRow_anchorLink__NyKQb: hover accent + underline

function IndianRow({ item }) {
  const [hovered, setHovered] = useState(false);
  const isUp = item.change >= 0;
  const changeColor = isUp ? GROWW_ACCENT : GROWW_NEGATIVE;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "28% 12% 16% 11% 11% 11% 11%",
        alignItems: "center",
        padding: "0 16px",
        minHeight: 56,
        borderBottom: `1px solid ${GROWW_GRAY150}`,
        background: hovered ? GROWW_GRAY50 : "#fff",
        cursor: "pointer",
        transition: "background-color 0.15s ease"
      }}
    >
      {/* Index name cell */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <IndexLogo logoUrl={item.header.logoUrl} displayName={item.header.displayName} />
        {/* AllIndicesDataTableBodyRow_name__kSOfL */}
        <div style={{ marginLeft: 12, display: "flex", flexDirection: "column", minHeight: 30, justifyContent: "center" }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 535,
              color: hovered ? GROWW_ACCENT : GROWW_GRAY900,
              textDecoration: hovered ? "underline" : "none",
              fontFamily: "GrowwSans, system-ui, sans-serif",
              lineHeight: "20px",
              transition: "color 0.15s"
            }}
          >
            {item.header.displayName}
          </span>
          <span style={{ fontSize: 12, color: GROWW_GRAY500, fontFamily: "GrowwSans, system-ui, sans-serif", lineHeight: "18px" }}>
            {NOW_STR}
          </span>
        </div>
      </div>

      {/* Last traded */}
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmt(item.ltp)}
      </div>

      {/* Day change */}
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: changeColor, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmtChange(item.change, item.changePerc)}
      </div>

      {/* High */}
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmt(item.high)}
      </div>

      {/* Low */}
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmt(item.low)}
      </div>

      {/* Open */}
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmt(item.open)}
      </div>

      {/* Prev Close */}
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>
        {fmt(item.prevClose)}
      </div>
    </div>
  );
}

// ─── Global Indices Row ───────────────────────────────────────────────────────

function GlobalRow({ item }) {
  const [hovered, setHovered] = useState(false);
  const isUp = item.change >= 0;
  const changeColor = isUp ? GROWW_ACCENT : GROWW_NEGATIVE;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "28% 12% 16% 11% 11% 11% 11%",
        alignItems: "center",
        padding: "0 16px",
        minHeight: 56,
        borderBottom: `1px solid ${GROWW_GRAY150}`,
        background: hovered ? GROWW_GRAY50 : "#fff",
        cursor: "pointer",
        transition: "background-color 0.15s ease"
      }}
    >
      {/* Flag + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <div style={{
          width: 32, height: 32, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 22, flexShrink: 0
        }}>
          {item.flag}
        </div>
        <div style={{ marginLeft: 12, display: "flex", flexDirection: "column", minHeight: 30, justifyContent: "center" }}>
          <span style={{
            fontSize: 14, fontWeight: 535, color: hovered ? GROWW_ACCENT : GROWW_GRAY900,
            textDecoration: hovered ? "underline" : "none",
            fontFamily: "GrowwSans, system-ui, sans-serif", lineHeight: "20px",
            transition: "color 0.15s"
          }}>
            {item.name}
          </span>
          <span style={{ fontSize: 12, color: GROWW_GRAY500, fontFamily: "GrowwSans, system-ui, sans-serif", lineHeight: "18px" }}>
            {item.time}
          </span>
        </div>
      </div>

      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmt(item.ltp)}</div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: changeColor, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmtChange(item.change, item.changePerc)}</div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmt(item.high)}</div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmt(item.low)}</div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmt(item.open)}</div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 435, color: GROWW_GRAY900, fontFamily: "GrowwSans, system-ui, sans-serif" }}>{fmt(item.prevClose)}</div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
// Tabs_indicator__cJrfq: h-3px, bg-accent, absolute, bottom-0, transition width+left
// AllIndicesDataTable_tabsContainer__505VJ: bg-secondary, border-bottom, px-16, rounded-t-8

function Tabs({ active, onChange }) {
  const tabs = [
    { id: "indian", label: "Indian Indices" },
    { id: "global", label: "Global Indices" },
  ];
  const containerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabRefs = useRef({});

  useEffect(() => {
    const el = tabRefs.current[active];
    if (el && containerRef.current) {
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const tabRect = el.getBoundingClientRect();
      setIndicator({ left: tabRect.left - containerLeft, width: tabRect.width });
    }
  }, [active]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        background: GROWW_GRAY50,
        borderBottom: `1px solid ${GROWW_GRAY150}`,
        padding: "0 16px",
        borderRadius: "8px 8px 0 0"
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          ref={el => tabRefs.current[tab.id] = el}
          onClick={() => onChange(tab.id)}
          style={{
            padding: "14px 20px 13px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 14,
            // bodyBase / headingXSmall style from Groww
            fontWeight: active === tab.id ? 535 : 435,
            fontFamily: "GrowwSans, system-ui, sans-serif",
            color: active === tab.id ? GROWW_ACCENT : GROWW_GRAY700,
            lineHeight: "20px",
            transition: "color 0.2s",
            position: "relative",
            whiteSpace: "nowrap",
            outline: "none"
          }}
        >
          {tab.label}
        </button>
      ))}
      {/* Tabs_indicator__cJrfq – animated green underline */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: 3,
          background: GROWW_ACCENT,
          borderRadius: "2px 2px 0 0",
          transition: "left 0.2s ease-in-out, width 0.2s ease-in-out",
          left: indicator.left,
          width: indicator.width
        }}
      />
    </div>
  );
}


function Navbar() {
    const {userPic,setuserPic}=useContext(UserPicture)

  return (
    <div className="border-b border-gray-100 bg-white sticky top-0 z-10 bg-white/60 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-6">
        <img
          src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-270.webp"
          alt="Groww"
          height={30}
          width={30}
        />
        <nav className="flex items-center gap-6">
          {["Stocks", "Explore", "Holdings", "Positions", "WatchList"].map(item => (
            <NavLink
              key={item}
              to={`/user/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `text-sm font-semibold ${
                  isActive
                    ? "text-gray-800 border-b-2 border-[#00d09c] pb-1"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </nav>
        <div className="flex-1 max-w-xs ml-auto">
          <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg px-3 h-9 gap-2 focus-within:border-gray-300 focus-within:bg-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
              <path d="M20 20l-3-3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search Groww...."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none"
            />
            <span className="text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5 flex-shrink-0">
              Ctrl+K
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
            {userPic && <img src={userPic} alt="" width={28} height={28} className='rounded-2xl'/>}
            {!userPic && <img src='https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'  width={28} height={28} className='rounded-2xl'/>}             
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GrowwAllIndices() {
  const [activeTab, setActiveTab] = useState("global");

  return (
    // Groww uses GrowwSans variable font (weight 300-700), Soehne for headings
    <div>
      <Navbar/>
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      fontFamily: "GrowwSans, NotoSans, system-ui, sans-serif",
      WebkitFontSmoothing: "antialiased",
      color: GROWW_GRAY900
    }}>
      {/* Load Groww's actual fonts */}
      <style>{`
        @font-face {
          font-family: GrowwSans;
          font-style: normal;
          font-weight: 300 700;
          src: url(https://resources.groww.in/web-assets/font/GrowwSans-Variable.woff2) format("woff2-variations");
          font-display: swap;
        }
        @font-face {
          font-family: Soehne;
          font-style: normal;
          font-weight: 300 700;
          src: url(https://resources.groww.in/web-assets/font/Soehne.woff2) format("woff2-variations");
          font-display: swap;
        }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 1216, margin: "0 auto", padding: "0 32px" }}>

        {/* ── Page heading (AllIndicesPage_stickyHeading) */}
        <h1 style={{
          margin: "24px 0 10px",
          fontSize: 20,
          fontWeight: 535,
          fontFamily: "Soehne, GrowwSans, system-ui, sans-serif",
          color: GROWW_GRAY900,
          lineHeight: "2rem"
        }}>
          All Indices
        </h1>

        {/* ── World Map (WorldMap_worldMapContainer) */}
        {/* transform: translateY(-25px); transition: transform 50ms ease */}
        <div
  style={{
    marginTo: "-220px",
    overflow: "hidden",
  }}
>
  <img
    src="https://freesvg.org/img/molumen-world-map-1.png"
    style={{
      width: "100%",
      display: "block",
      transform: "translateY(-240px)",
    }}
  />
</div>

        {/* ── Data Table (AllIndicesDataTable_tableContainer) */}
        {/* border: 1px solid border-primary, border-radius: 8px, z-index: 900 */}
        <div style={{
  border: `1px solid ${GROWW_GRAY150}`,
  borderRadius: 8,
  overflow: "hidden",
  background: "#fff",
  zIndex: 900,
  position: "relative",
  marginTop: -700,
  marginBottom:30
}}>

          {/* Tabs */}
          <Tabs active={activeTab} onChange={setActiveTab} />

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 800 }}>
              <TableHeader />
              <div>
                {activeTab === "indian"
                  ? INDIAN_INDICES.map(item => (
                      <IndianRow key={item.header.searchId} item={item} />
                    ))
                  : GLOBAL_INDICES.map(item => (
                      <GlobalRow key={item.name} item={item} />
                    ))
                }
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer/>
    </div>
    </div>
  );
}