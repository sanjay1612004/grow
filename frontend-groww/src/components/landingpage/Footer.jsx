import { useState } from "react";

const growwLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Media & Press", href: "/press" },
  { label: "Careers", href: "/careers" },
  { label: "Help & Support", href: "/help" },
  { label: "Trust & Safety", href: "/trust-and-safety" },
  { label: "Investor Relations", href: "/investor-relations" },
];

const productLinks = [
  { label: "Stocks", href: "/stocks" },
  { label: "F&O", href: "/futures-and-options" },
  { label: "MTF", href: "/stocks/mtf" },
  { label: "ETF", href: "/invest-in-etfs" },
  { label: "IPO", href: "/ipo" },
  { label: "Mutual Funds", href: "/mutual-funds" },
  { label: "Commodities", href: "/commodities" },
  { label: "Groww Terminal", href: "/charts" },
  { label: "915 Terminal", href: "https://915.groww.in/?utm_source=groww" },
  { label: "Stock Screens", href: "/stocks/screens" },
  { label: "Algo Trading", href: "/trade-api" },
  { label: "Groww Charts", href: "/groww-charts" },
  { label: "Groww Digest", href: "/digest" },
  { label: "Demat Account", href: "/open-demat-account" },
  { label: "Groww AMC", href: "/mutual-funds/amc" },
  { label: "PMS", href: "/pms" },
];

const socialLinks = [
  { href: "https://twitter.com/_groww", alt: "Twitter", icon: "//assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/twitter.2ae97e9a.svg" },
  { href: "https://www.instagram.com/groww_official/", alt: "Instagram", icon: "//assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/instagram.18ccbecf.svg" },
  { href: "https://www.facebook.com/growwapp", alt: "Facebook", icon: "//assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/facebook.efb1d349.svg" },
  { href: "https://in.linkedin.com/company/groww.in", alt: "LinkedIn", icon: "//assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/linkedin.4e939aef.svg" },
  { href: "http://bit.ly/2rjkBHu", alt: "YouTube", icon: "//assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/youtube.6e3dbd8d.svg" },
];

const tabs = [
  "Share Market", "Indices", "F&O", "Mutual Funds",
  "ETFs", "Funds By Groww", "Calculators", "IPO", "Miscellaneous",
];

const tabLinks = {
  "Share Market": [
    ["Top Gainers Stocks","/markets/top-gainers"],["52 Weeks High Stocks","/markets/52-week-high"],["Tata Motors","/stocks/tata-motors-ltd"],["NHPC","/stocks/nhpc-ltd"],["ITC","/stocks/itc-ltd"],["Wipro","/stocks/wipro-ltd"],["BSE","/stocks/bse-ltd"],["NTPC","/stocks/ntpc-green-energy-ltd"],
    ["Top Losers Stocks","/markets/top-losers"],["52 Weeks Low Stocks","/markets/52-week-low"],["IREDA","/stocks/indian-renewable-energy-development-agency-ltd-1569588972606"],["State Bank of India","/stocks/state-bank-of-india"],["Adani Power","/stocks/adani-power-ltd"],["CDSL","/stocks/central-depository-services-india-ltd"],["Cochin Shipyard","/stocks/cochin-shipyard-ltd"],["SJVN","/stocks/sjvn-ltd"],
    ["Most Traded Stocks","/stocks/most-bought-stocks-on-groww"],["Stocks Market Calender","/stocks/calendar"],["Tata Steel","/stocks/tata-steel-ltd"],["Tata Power","/stocks/tata-power-company-ltd"],["Bharat Heavy Electricals","/stocks/bharat-heavy-electricals-ltd"],["Indian Oil Corporation","/stocks/indian-oil-corporation-ltd"],["HUDCO","/stocks/housing-urban-development-corporation-ltd"],["SAIL","/stocks/steel-authority-of-india-ltd"],
    ["Stocks Feed","/stock-feed"],["Suzlon Energy","/stocks/suzlon-energy-ltd"],["Zomato (Eternal)","/stocks/zomato-ltd"],["Yes Bank","/stocks/yes-bank-ltd"],["Infosys","/stocks/infosys-ltd"],["NBCC","/stocks/nbcc-india-ltd"],["IRCTC","/stocks/indian-railway-catering-tourism-corpn-ltd"],["Share Market Live Update","/share-market-today"],
    ["FII DII Activity","/fii-dii-data"],["IRFC","/stocks/indian-railway-finance-corporation-ltd"],["Bharat Electronics","/stocks/bharat-electronics-ltd"],["HDFC Bank","/stocks/hdfc-bank-ltd"],["Vedanta","/stocks/vedanta-ltd"],["Reliance Power","/stocks/reliance-power-ltd"],["Jaiprakash Power Ventures","/stocks/jaiprakash-power-ventures-ltd"],["Stocks Sectors","/stocks/sectors"],
  ],
  "Indices": [
    ["NIFTY 50","/indices/nifty"],["NIFTY Midcap 100","/indices/nifty-midcap"],["NIFTY 100","/indices/nifty-218500"],["US Tech 100","/indices/global-indices/nasdaq"],["NIFTY Realty","/indices/nifty-realty"],["Nikkei index","/indices/global-indices/nikkei"],
    ["SENSEX","/indices/sp-bse-sensex"],["NIFTY Smallcap 100","/indices/nifty-smallcap-100"],["NIFTY Auto","/indices/nifty-auto"],["Dow Jones Futures","/indices/global-indices/dow-jones-futures"],["NIFTY PSU Bank","/indices/nifty-psu-bank"],["NIFTY FMCG","/indices/nifty-fmcg"],
    ["NIFTY BANK","/indices/nifty-bank"],["NIFTY MIDCAP 150","/indices/nifty-midcap-150"],["KOSPI Index","/indices/global-indices/kospi"],["Dow Jones Index","/indices/global-indices/dow-jones"],["Gift Nifty","/indices/global-indices/sgx-nifty"],["BSE BANKEX","/indices/sp-bse-bankex"],
    ["India VIX","/indices/india-vix"],["NIFTY Pharma","/indices/nifty-pharma"],["HANG SENG Index","/indices/global-indices/hang-seng"],["BSE 100","/indices/bse-100"],["FTSE 100 Index","/indices/global-indices/ftse"],["S&P 500","/indices/global-indices/sp-500"],
    ["NIFTY NEXT 50","/indices/nifty-next"],["NIFTY Metal","/indices/nifty-metal"],["DAX Index","/indices/global-indices/dax"],["NIFTY Fin Service","/indices/nifty-financial-services"],["CAC Index","/indices/global-indices/cac"],["Nifty Pvt Bank","/indices/nifty-pvt-bank"],
  ],
  "Calculators": [
    ["SIP Calculator","/calculators/sip-calculator"],["Brokerage Calculator","/calculators/brokerage-calculator"],["RD Calculator","/calculators/rd-calculator"],["HRA Calculator","/calculators/hra-calculator"],["Home Loan EMI Calculator","/calculators/home-loan-emi-calculator"],
    ["Lumpsum Calculator","/calculators/lumpsum-calculator"],["Margin Calculator","/calculators/margin-calculator"],["FD Calculator","/calculators/fd-calculator"],["Salary Calculator","/calculators/salary-calculator"],["ROI Calculator","/calculators/roi-calculator"],
    ["SWP Calculator","/calculators/swp-calculator"],["Stock Average Calculator","/calculators/stock-average-calculator"],["EPF Calculator","/calculators/epf-calculator"],["TDS Calculator","/calculators/tds-calculator"],
    ["MF Calculator","/calculators/mutual-fund-returns-calculator"],["SSY Calculator","/calculators/sukanya-samriddhi-yojana-calculator"],["Income Tax Calculator","/calculators/income-tax-calculator"],["EMI Calculator","/calculators/emi-calculator"],
    ["Step-Up SIP Calculator","/calculators/step-up-sip-calculator"],["PPF Calculator","/calculators/ppf-calculator"],["GST Calculator","/calculators/gst-calculator"],["Car Loan EMI Calculator","/calculators/car-loan-emi-calculator"],
  ],
  "IPO": [
    ["What is IPO?","/p/what-is-ipo"],["IPO Subscription Status","/ipo/subscription"],["IPO Allotment Status","/ipo/allotment"],
    ["Open IPOs","/ipo"],["How to Apply for an IPO","/blog/how-to-invest-in-an-ipo-online"],
    ["Upcoming IPOs","/ipo/upcoming"],["What is Grey Market Premium?","/p/what-is-grey-market"],
    ["Closed IPOs","/ipo/closed"],["Mainboard IPOs","/ipo/mainboard"],
    ["IPO GMP","/ipo/gmp"],["SME IPOs","/ipo/sme"],
  ],
  "ETFs": [
    ["International","/etfs/international"],["Silver","/etfs/silver"],["Midcap","/etfs/midcap"],["Liquid","/etfs/liquid"],
    ["Debt","/etfs/debt"],["Index","/etfs/indices"],["Bank Nifty","/etfs/bank-nifty"],["Nifty IT","/etfs/nifty-it"],
    ["Equity","/etfs/equity"],["Nifty 50","/etfs/nifty-50"],["Nifty Metal","/etfs/nifty-metal"],["Nifty Auto","/etfs/nifty-auto"],
    ["Commodity","/etfs/commodities"],["Nifty Next 50","/etfs/nifty-next-50"],["Healthcare","/etfs/healthcare"],["Groww","/etfs/groww-etfs"],
    ["Gold","/etfs/gold"],["Sensex","/etfs/sensex"],["Defence","/etfs/defence"],
  ],
  "Funds By Groww": [
    ["Groww Arbitrage Fund","/mutual-funds/groww-arbitrage-fund-direct-growth"],["Groww ELSS Tax Saver Fund","/mutual-funds/groww-elss-tax-saver-fund-direct-growth"],["Groww Banking & Financial Services Fund","/mutual-funds/groww-banking-financial-services-fund-direct-growth"],["Groww Gold ETF FOF","/mutual-funds/groww-gold-etf-fof-direct-growth"],["Groww Gold ETF","/etfs/groww-gold-etf"],
    ["Groww Short Duration Fund","/mutual-funds/groww-short-duration-fund-direct-growth"],["Groww Aggressive Hybrid Fund","/mutual-funds/groww-aggressive-hybrid-fund-direct-growth"],["Groww Nifty Smallcap 250 Index Fund","/mutual-funds/groww-nifty-smallcap-250-index-fund-direct-growth"],["Groww Multicap Fund","/mutual-funds/groww-multicap-fund-direct-growth"],["Groww Nifty India Defence ETF","/etfs/groww-nifty-india-defence-etf"],
    ["Groww Liquid Fund","/mutual-funds/groww-liquid-fund-direct-growth"],["Groww Dynamic Bond Fund","/mutual-funds/groww-dynamic-bond-fund-direct-growth"],["Groww Nifty Non Cyclical Consumer Index Fund","/mutual-funds/groww-nifty-non-cyclical-consumer-index-fund-direct-growth"],["Groww Nifty India Railways PSU Index Fund","/mutual-funds/groww-nifty-india-railways-psu-index-fund-direct-growth"],
    ["Groww Large Cap Fund","/mutual-funds/groww-large-cap-fund-direct-growth"],["Groww Overnight Fund","/mutual-funds/groww-overnight-fund-direct-growth"],["Groww Nifty EV & New Age Automotive ETF FoF","/mutual-funds/groww-nifty-ev-new-age-automotive-etf-fof-direct-growth"],["Groww Nifty 200 ETF FoF","/mutual-funds/groww-nifty-200-etf-fof-direct-growth"],
    ["Groww Value Fund","/mutual-funds/groww-value-fund-direct-growth"],["Groww Nifty Total Market Index Fund","/mutual-funds/groww-nifty-total-market-index-fund-direct-growth"],["Groww Nifty India Defence ETF FoF","/mutual-funds/groww-nifty-india-defence-etf-fof-direct-growth"],["Groww Silver ETF","/etfs/groww-silver-etf"],
  ],
  "Miscellaneous": [
    ["NFO","/nfo"],["Pricing","/pricing"],["Trust & Safety","/trust-and-safety"],["Groww Digest","/digest"],
    ["Intraday","/stocks/intraday"],["Blog","/blog"],["Investor Relations","/investor-relations"],["Invest in Gold","/gold"],
    ["Corporate Bonds","/corporate-bonds/ipo"],["Media & Press","/press"],["Gold Rates","/gold-rates"],["Invest in Silver","/silver"],
    ["HUF Demat Account","/open-huf-demat-account"],["Careers","/careers"],["Silver Rates","/silver-rates"],["Sitemap","/sitemap"],
    ["About Us","/about-us"],["Help & Support","/help"],["Glossary","/p"],
  ],
  "F&O": [
    ["NIFTY Bank Options","/options/nifty-bank"],["SBI Options","/options/state-bank-of-india"],["Bajaj Finance Options","/options/bajaj-finance-ltd"],["Axis Bank Options","/options/axis-bank-ltd"],["Hindustan Unilever Options","/options/hindustan-unilever-ltd"],
    ["NIFTY 50 Options","/options/nifty"],["HDFC Bank Options","/options/hdfc-bank-ltd"],["Wipro Options","/options/wipro-ltd"],["DLF Options","/options/dlf-ltd"],["REC Options","/options/rec-ltd"],
    ["Bse Sensex Options","/options/sp-bse-sensex"],["Tata Steel Options","/options/tata-steel-ltd"],["NTPC Options","/options/ntpc-ltd"],["Bajaj Auto Options","/options/bajaj-auto-ltd"],["Indusind Bank Options","/options/indusind-bank-ltd"],
    ["Tata Motors Options","/options/tata-motors-ltd"],["ITC Options","/options/itc-ltd"],["ICICI Bank Options","/options/icici-bank-ltd"],["Adani Enterprises Options","/options/adani-enterprises-ltd"],["NIFTY 50 Futures","/futures/nifty"],
  ],
  "Mutual Funds": [
    ["MF Screener","/mutual-funds/filter"],["Best Debt Mutual funds","/mutual-funds/category/best-debt-mutual-funds"],["Best Large Cap Mutual funds","/mutual-funds/category/best-large-cap-mutual-funds"],["Parag Parikh Flexi Cap Fund","/mutual-funds/parag-parikh-long-term-value-fund-direct-growth"],
    ["Compare Mutual Funds","/mutual-funds/compare"],["Best Equity Mutual funds","/mutual-funds/category/best-equity-mutual-funds"],["Best Small Cap Mutual funds","/mutual-funds/category/best-small-cap-mutual-funds"],["Motilal Oswal Midcap Fund","/mutual-funds/motilal-oswal-most-focused-midcap-30-fund-direct-growth"],
    ["MF Knowledge Centre","/blog/category/mutual-funds"],["Mutual Fund Houses","/mutual-funds/amc"],["Best Hybrid Mutual funds","/mutual-funds/category/best-hybrid-mutual-funds"],["Best ELSS Mutual funds","/mutual-funds/category/best-elss-mutual-funds"],
    ["Mutual Funds Categories","/mutual-funds/category"],["Best MidCap Mutual funds","/mutual-funds/category/best-mid-cap-mutual-funds"],["Best Sectoral Mutual funds","/mutual-funds/category/best-sectoral-mutual-funds"],["Quant Small Cap Fund","/mutual-funds/quant-small-cap-fund-direct-plan-growth"],
  ],
};

const otherLinks = [
  { label: "NSE", href: "https://www.nseindia.com/" },
  { label: "BSE", href: "https://www.bseindia.com/" },
  { label: "MCX", href: "https://www.mcxindia.com/" },
  { label: "Terms and Conditions", href: "https://groww.in/terms-and-conditions/" },
  { label: "Policies and Procedures", href: "https://groww.in/p/policies/" },
  { label: "Regulatory & Other Info", href: "/regulatory-and-other-information" },
  { label: "Privacy Policy", href: "https://groww.in/privacy-policy/" },
  { label: "Disclosure", href: "https://groww.in/p/disclosure/" },
  { label: "SMART ODR", href: "https://smartodr.in/" },
  { label: "Download Forms", href: "/download-forms" },
  { label: "Information Security Practices", href: "/p/security" },
  { label: "Investor Charter and Grievance", href: "/investor-charters-and-grievance" },
  { label: "Bug Bounty", href: "https://security.groww.in" },
];

const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","Others"];

const tickerItems = [
  "1. For Stock Broking Transaction 'Prevent unauthorised transactions in your account --> Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day...Issued in the interest of Investors.",
  "2. For Depository Transaction 'Prevent Unauthorized Transactions in your demat account --> Update your Mobile Number with your Depository Participant. Receive alerts on your Registered Mobile for all debit and other important transactions in your demat account directly from CDSL/NSDL on the same day...Issued in the interest of investors.",
  "3. KYC is a one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary (Broker, DP, Mutual Fund etc.), you need not undergo the same process again when you approach another intermediary.",
  "4. If you are subscribing to an IPO, there is no need to issue a cheque. Please write the Bank account number and sign the IPO application form to authorize your bank to make payment in case of allotment. In case of non allotment the funds will remain in your bank account.",
];

const s = {
  footer: { background: "#f9f9f9", color: "#222", fontFamily: "'Inter', sans-serif", fontSize: "13px", padding: "40px 0 0 0", borderTop: "1px solid #e8e8e8" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "0 24px" },
  topSection: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "32px" },
  leftSection: { flex: 1, display: "flex", flexDirection: "column", gap: "20px" },
  address: { color: "#666", lineHeight: "1.7", fontSize: "12px" },
  socialRow: { display: "flex", gap: "12px", alignItems: "center" },
  appRow: { display: "flex", gap: "10px", marginTop: "8px" },
  appBtn: { border: "1px solid #ddd", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", background: "#fff" },
  colsWrap: { display: "flex", gap: "98px" },
  colHead: { fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em", color: "#222", marginBottom: "14px", textTransform: "uppercase" },
  linkGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  link: { color: "#444", textDecoration: "none", fontSize: "13px", lineHeight: "1.4" },
  copyright: { display: "flex", justifyContent: "space-between", color: "#999", fontSize: "12px", padding: "16px 0", borderTop: "1px solid #e8e8e8", marginTop: "16px" },
  tabsWrapper: { borderBottom: "1px solid #e8e8e8", marginBottom: "20px", position: "relative", overflowX: "auto" },
  tabsRow: { display: "flex", gap: "0", whiteSpace: "nowrap" },
  tab: (active) => ({ padding: "12px 16px", cursor: "pointer", fontSize: "13px", fontWeight: active ? "700" : "500", color: active ? "#00b386" : "#444", borderBottom: active ? "2px solid #00b386" : "2px solid transparent", background: "none", border: "none", cursor: "pointer" }),
  linksGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px 16px", marginBottom: "16px" },
  showMore: { display: "flex", justifyContent: "center", marginTop: "12px" },
  showMoreBtn: { border: "1px solid #ddd", borderRadius: "20px", padding: "8px 24px", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" },
  hr: { border: "none", borderTop: "1px solid #e8e8e8", margin: "24px 0" },
  othersRow: { display: "flex", flexWrap: "wrap", gap: "6px 0", alignItems: "center", marginBottom: "20px" },
  othersLabel: { fontWeight: "700", fontSize: "12px", marginRight: "12px", whiteSpace: "nowrap" },
  otherLink: { color: "#555", textDecoration: "none", fontSize: "12px" },
  sep: { color: "#ccc", margin: "0 8px" },
  letterRow: { display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "20px", alignItems: "center" },
  letterLabel: { fontWeight: "700", fontSize: "12px", marginRight: "12px", whiteSpace: "nowrap" },
  letterLink: { color: "#555", textDecoration: "none", fontSize: "13px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" },
  accordionTitle: { fontWeight: "700", fontSize: "15px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" },
  accordionBody: { color: "#555", lineHeight: "1.8", fontSize: "13px" },
  ticker: { background: "#fff8f0", border: "1px solid #ffe4c4", borderRadius: "6px", padding: "10px 14px", marginBottom: "12px", overflow: "hidden" },
  tickerInner: { display: "flex", flexDirection: "column", gap: "6px" },
  tickerItem: { fontSize: "12px", color: "#555" },
  mt20: { marginTop: "16px" },
  mt40: { marginTop: "32px", fontWeight: "700", fontSize: "13px" },
};

export default function Footer() {
  const [activeTab, setActiveTab] = useState("Share Market");
  const [showMore, setShowMore] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(true);

  const currentLinks = tabLinks[activeTab] || [];
  const displayLinks = showMore ? currentLinks : currentLinks.slice(0, 40);

  return (
    <footer style={s.footer}>
      <div style={s.container}>

        {/* TOP SECTION */}
        <div style={s.topSection}>
          {/* Left: Logo + Address + Social + App */}
          <div style={s.leftSection}>
            <img
              src="https://resources.groww.in/web-assets/img/website-logo/groww_logo.webp"
              alt="Groww Logo"
              style={{ width: "122px", height: "33px", objectFit: "contain" }}
            />
            <div style={s.address}>
              <div>Vaishnavi Tech Park, South Tower, 3rd Floor</div>
              <div>Sarjapur Main Road, Bellandur, Bengaluru – 560103</div>
              <div>Karnataka</div>
            </div>

            <div>
              <a href="/help/my-account/searchable/how-to-call-groww-customer-care" style={{ color: "#222", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
                Contact Us
              </a>
              <div style={{ ...s.socialRow, marginTop: "10px" }}>
                {socialLinks.map((s2) => (
                  <a key={s2.href} href={s2.href} target="_blank" rel="nofollow noopener noreferrer" aria-label={s2.alt}>
                    <img src={s2.icon} alt={s2.alt} width={24} height={24} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "10px" }}>Download the App</div>
              <div style={s.appRow}>
                <a href="https://app.groww.in/v3cO/4a6424fe" rel="nofollow noreferrer" target="_blank" style={s.appBtn}>
                  <img src="https://resources.groww.in/web-assets/img/shared/appleStore.svg" width={20} height={20} alt="App Store" />
                  <span style={{ fontSize: "11px" }}>App Store</span>
                </a>
                <a href="https://app.groww.in/v3cO/4a6424fe" rel="nofollow noreferrer" target="_blank" style={s.appBtn}>
                  <img src="https://resources.groww.in/web-assets/img/shared/playStore.svg" width={20} height={20} alt="Play Store" />
                  <span style={{ fontSize: "11px" }}>Play Store</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Groww + Products columns shifted to the end */}
          <div style={s.colsWrap}>
            <div>
              <div style={s.colHead}>Groww</div>
              <div style={s.linkGrid}>
                {growwLinks.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={s.link}
                    onMouseEnter={e => e.target.style.color = "#00b386"}
                    onMouseLeave={e => e.target.style.color = "#444"}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={s.colHead}>Products</div>
              <div style={s.linkGrid}>
                {productLinks.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={s.link}
                    onMouseEnter={e => e.target.style.color = "#00b386"}
                    onMouseLeave={e => e.target.style.color = "#444"}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={s.copyright}>
          <span>© 2016-2026 Groww. All rights reserved.</span>
          <span>Version: 7.6.5</span>
        </div>

        {/* TABS SECTION */}
        <div style={s.tabsWrapper}>
          <div style={s.tabsRow}>
            {tabs.map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setShowMore(false); }} style={s.tab(activeTab === tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Links Grid */}
        <div style={s.linksGrid}>
          {displayLinks.map(([label, href], i) => (
            <a key={i} href={href} style={{ ...s.link, color: "#666", fontSize: "12px" }}
              onMouseEnter={e => e.target.style.color = "#00b386"}
              onMouseLeave={e => e.target.style.color = "#666"}>
              {label}
            </a>
          ))}
        </div>

        {currentLinks.length > 40 && (
          <div style={s.showMore}>
            <button onClick={() => setShowMore(!showMore)} style={s.showMoreBtn}>
              {showMore ? "Show Less" : "Show More"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" height="18" width="18"
                style={{ transform: showMore ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M12 14.95q-.2 0-.375-.063a.9.9 0 0 1-.325-.212l-4.6-4.6a.95.95 0 0 1-.275-.7q0-.425.275-.7a.95.95 0 0 1 .7-.275q.425 0 .7.275l3.9 3.9 3.9-3.9a.95.95 0 0 1 .7-.275q.425 0 .7.275a.95.95 0 0 1 .275.7.95.95 0 0 1-.275.7l-4.6 4.6q-.15.15-.325.212a1.1 1.1 0 0 1-.375.063" />
              </svg>
            </button>
          </div>
        )}

        <hr style={s.hr} />

        {/* Others links */}
        <div style={s.othersRow}>
          <span style={s.othersLabel}>Others:</span>
          {otherLinks.map((l, i) => (
            <span key={l.href} style={{ display: "flex", alignItems: "center" }}>
              <a href={l.href} target="_blank" rel="nofollow noreferrer" style={s.otherLink}
                onMouseEnter={e => e.target.style.color = "#00b386"}
                onMouseLeave={e => e.target.style.color = "#555"}>
                {l.label}
              </a>
              {i < otherLinks.length - 1 && <span style={s.sep}>|</span>}
            </span>
          ))}
        </div>

        {/* Mutual Funds A-Z */}
        <div style={s.letterRow}>
          <span style={s.letterLabel}>Mutual Funds:</span>
          {letters.map((l) => (
            <a key={l} href={`/mutual-funds/fund-list/${l.toLowerCase()}`} target="_blank" style={s.letterLink}
              onMouseEnter={e => { e.target.style.background = "#e8f9f4"; e.target.style.color = "#00b386"; }}
              onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = "#555"; }}>
              {l}
            </a>
          ))}
        </div>

        {/* Stocks A-Z */}
        <div style={s.letterRow}>
          <span style={s.letterLabel}>Stocks:</span>
          {letters.map((l) => (
            <a key={l} href={`/stocks/stocks-list/${l.toLowerCase()}`} target="_blank" style={s.letterLink}
              onMouseEnter={e => { e.target.style.background = "#e8f9f4"; e.target.style.color = "#00b386"; }}
              onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = "#555"; }}>
              {l}
            </a>
          ))}
        </div>

        <hr style={s.hr} />

        {/* About Groww Accordion */}
        <div>
          <div style={s.accordionTitle} onClick={() => setAboutOpen(!aboutOpen)}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>About Groww</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="20" width="20"
              style={{ transform: aboutOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>
              <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
            </svg>
          </div>

          {aboutOpen && (
            <div style={s.accordionBody}>
              <p>Groww is India's largest Stock Broker with more than 1.4 crore active customers where users can find their investment solutions pertaining to mutual funds, stocks, US Stocks, ETFs, IPO, and F&Os, to invest their money without hassles.</p>
              <p style={s.mt20}>Groww objectively evaluates stocks and mutual funds and does not advise or recommend any stocks, mutual funds or portfolios. Investors shall invest at their own discretion, will and consent.</p>

              <div style={s.mt40}>SECURE TRANSACTIONS ON GROWW</div>
              <p style={s.mt20}>All transactions on Groww are safe and secure. Users can invest through SIP or Lumpsum using Netbanking through all supported banks. It uses BSE Star MF <span style={{ color: "#00b386" }}>(with Member code 11724)</span> as transaction platform.</p>

              <div style={s.mt40}>ATTENTION INVESTORS</div>
              <div style={{ ...s.ticker, ...{ marginTop: "16px" } }}>
                <div style={s.tickerInner}>
                  {tickerItems.map((item, i) => (
                    <div key={i} style={s.tickerItem}>{item}</div>
                  ))}
                </div>
              </div>

              <div style={s.mt40}>DISCLAIMER</div>
              <p style={s.mt20}>Groww Invest Tech Pvt. Ltd. (Formerly known as Nextbillion Technology Pvt. Ltd) (CIN: U65100KA2016PTC092879) is a member of NSE &amp; BSE &amp; MCX with SEBI Registration no: INZ000301838, Depository Participant of CDSL Depository with SEBI Registration no: IN-DP-417-2019 and Mutual Fund distributor with AMFI Registration No: ARN-111686. Registered office and Correspondence office - Vaishnavi Tech Park, South Tower, 3rd floor, Sarjapur Main Road, Bellandur, Bengaluru – 560103, Karnataka.</p>
              <p style={s.mt20}>Investment in Securities Market are subject to market risks, read all the related documents carefully before investing.</p>
              <p style={s.mt20}>Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing. Past performance of the schemes is neither an indicator nor a guarantee of future performance.</p>
              <p style={{ ...s.mt20, marginBottom: "32px" }}>India's largest Stock Broker by active users on NSE as of June 30, 2025. Terms and conditions of the website/app are applicable. Privacy policy of the website is applicable.</p>
            </div>
          )}
        </div>

      </div>
    </footer>
  );
}