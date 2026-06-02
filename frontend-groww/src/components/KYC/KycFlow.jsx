import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// --- CONFIGURATION ---
const BASE_URL = "https://j9cw5kv2-5000.inc1.devtunnels.ms/api/kyc";

const isValidMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value || "").trim());

const cleanUserId = (value) => {
  const id = String(value || "").trim();
  return isValidMongoId(id) ? id : "";
};

const getStoredUserId = () => {
  let storedUser = {};
  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    storedUser = {};
  }
  return cleanUserId(
    localStorage.getItem("userId") ||
    storedUser?._id ||
    storedUser?.id ||
    storedUser?.userId ||
    storedUser?.data?._id ||
    storedUser?.data?.id ||
    storedUser?.data?.userId ||
    ""
  );
};

const getAuthConfig = (userId) => {
  const activeUserId = cleanUserId(userId) || getStoredUserId();
  return {
    withCredentials: true,
    headers: activeUserId
      ? { userid: activeUserId, userId: activeUserId, "x-user-id": activeUserId }
      : {},
  };
};

const appendUserId = (formData, userId) => {
  const activeUserId = cleanUserId(userId) || getStoredUserId();
  if (!activeUserId) throw new Error("Valid userId missing. Please login again.");
  localStorage.setItem("userId", activeUserId);
  formData.set("userId", activeUserId);
  return activeUserId;
};

// --- STEP LABELS ---
const STEP_LABELS = ["PAN", "Aadhaar", "Bank", "Selfie", "Sign", "Submit", "Done"];

// --- STEPPER ---
const Stepper = ({ currentStep }) => (
  <div className="flex items-start w-full max-w-lg mb-8">
    {STEP_LABELS.map((label, i) => {
      const step = i + 1;
      const isDone = currentStep > step;
      const isActive = currentStep === step;
      return (
        <div key={label} className="flex flex-col items-center flex-1 relative">
          {/* connector line */}
          {i < STEP_LABELS.length - 1 && (
            <div
              className={`absolute top-4 left-1/2 w-full h-0.5 z-0 transition-colors duration-300 ${isDone ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          )}
          {/* dot */}
          <div
            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300
              ${isActive ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100'
                : isDone ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-200 text-gray-400'}`}
          >
            {isDone ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : step}
          </div>
          {/* label */}
          <span
            className={`mt-1.5 text-[10px] font-medium tracking-wide text-center
              ${isActive ? 'text-blue-600 font-semibold' : isDone ? 'text-gray-500' : 'text-gray-400'}`}
          >
            {label}
          </span>
        </div>
      );
    })}
  </div>
);

// --- FILE INPUT ---
const FileField = ({ label, accept, capture, required, onChange }) => {
  const [fileName, setFileName] = useState('');
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) { setFileName(file.name); onChange(e); }
  };
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
        {label}
      </label>
      <div className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors
        ${fileName ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'}`}>
        <input
          type="file"
          accept={accept}
          capture={capture}
          required={required}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="text-2xl mb-1">{fileName ? '✅' : '📎'}</div>
        <p className={`text-sm font-medium ${fileName ? 'text-green-700' : 'text-gray-500'}`}>
          {fileName ? 'File selected' : 'Click to upload'}
        </p>
        {fileName
          ? <p className="text-xs font-mono text-green-600 mt-1 truncate max-w-xs mx-auto">{fileName}</p>
          : <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 10MB</p>
        }
      </div>
    </div>
  );
};

// --- TEXT INPUT ---
const TextField = ({ label, value, onChange, placeholder, required, mono }) => (
  <div className="mb-5">
    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-800 bg-white
        outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50 placeholder-gray-300
        ${mono ? 'font-mono tracking-wider' : ''}`}
    />
  </div>
);

// --- ERROR TOAST ---
const ErrorToast = ({ message }) => (
  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mt-4">
    <span>⚠️</span>
    <span>{message}</span>
  </div>
);

// --- SPINNER ---
const Spinner = () => (
  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
);

// --- PRIMARY BUTTON ---
const PrimaryBtn = ({ loading, label, onClick, type = 'submit', variant = 'blue' }) => {
  const base = "w-full mt-6 py-3 px-5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all";
  const colors = variant === 'green'
    ? "bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-60 shadow-lg shadow-emerald-200"
    : "bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 shadow-lg shadow-blue-200";
  return (
    <button type={type} onClick={onClick} disabled={loading} className={`${base} ${colors}`}>
      {loading ? <><Spinner /><span>Processing…</span></> : <span>{label}</span>}
    </button>
  );
};

// --- CARD WRAPPER ---
const KycCard = ({ stepNum, title, subtitle, children }) => (
  <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-[fadeUp_0.35s_ease-out]">
    <style>{`
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
    `}</style>
    {/* Card Header */}
    <div className="px-8 pt-7 pb-6 border-b border-gray-100 bg-gradient-to-br from-slate-50 to-gray-50">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
        Step {stepNum} of 6
      </p>
      <h2 className="text-xl font-bold text-gray-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {/* Card Body */}
    <div className="px-8 py-7">{children}</div>
  </div>
);

// --- STATUS PILL ---
const StatusPill = ({ status }) => {
  if (!status) return null;
  const s = status.toLowerCase();
  const config = s.includes('submit')
    ? { cls: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', label: 'Submitted' }
    : s.includes('approv')
    ? { cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Approved' }
    : s.includes('reject')
    ? { cls: 'bg-red-100 text-red-600', dot: 'bg-red-500', label: 'Rejected' }
    : { cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'Pending' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

// --- DETAIL ROW ---
const DetailRow = ({ label, children }) => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 gap-3">
    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">{label}</span>
    <span className="text-sm font-semibold text-gray-800 font-mono text-right break-all">{children}</span>
  </div>
);

// ─────────────────────────────────────────────
// STEP 1 — PAN
// ─────────────────────────────────────────────
const PanForm = ({ onNext, userId }) => {
  const [panNumber, setPanNumber] = useState('');
  const [panCardImage, setPanCardImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const formData = new FormData();
      const activeUserId = appendUserId(formData, userId);
      formData.append('panNumber', panNumber);
      formData.append('panCardImage', panCardImage);
      await axios.post(`${BASE_URL}/pan`, formData, getAuthConfig(activeUserId));
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <KycCard stepNum={1} title="PAN Verification" subtitle="Enter your PAN details exactly as they appear on your card">
        <TextField
          label="PAN Number"
          value={panNumber}
          onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
          required
          mono
        />
        <FileField label="PAN Card Image" required onChange={(e) => setPanCardImage(e.target.files[0])} />
        {error && <ErrorToast message={error} />}
        <PrimaryBtn loading={loading} label="Save & Continue →" />
      </KycCard>
    </form>
  );
};

// ─────────────────────────────────────────────
// STEP 2 — AADHAAR
// ─────────────────────────────────────────────
const AadhaarForm = ({ onNext, userId }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const formData = new FormData();
      const activeUserId = appendUserId(formData, userId);
      formData.append('aadhaarNumber', aadhaarNumber);
      formData.append('aadhaarFrontImage', frontImage);
      formData.append('aadhaarBackImage', backImage);
      await axios.post(`${BASE_URL}/aadhaar`, formData, getAuthConfig(activeUserId));
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <KycCard stepNum={2} title="Aadhaar Verification" subtitle="Upload front and back images of your Aadhaar card">
        <TextField
          label="Aadhaar Number"
          value={aadhaarNumber}
          onChange={(e) => setAadhaarNumber(e.target.value)}
          placeholder="XXXX XXXX XXXX"
          required
          mono
        />
        <FileField label="Front Side of Aadhaar" required onChange={(e) => setFrontImage(e.target.files[0])} />
        <FileField label="Back Side of Aadhaar"  required onChange={(e) => setBackImage(e.target.files[0])} />
        {error && <ErrorToast message={error} />}
        <PrimaryBtn loading={loading} label="Save & Continue →" />
      </KycCard>
    </form>
  );
};

// ─────────────────────────────────────────────
// STEP 3 — BANK
// ─────────────────────────────────────────────
const BANK_FIELDS = [
  { key: 'bankName',          label: 'Bank Name',            placeholder: 'e.g. State Bank of India', mono: false },
  { key: 'accountNumber',     label: 'Account Number',       placeholder: 'Enter account number',      mono: true  },
  { key: 'ifscCode',          label: 'IFSC Code',            placeholder: 'e.g. SBIN0001234',           mono: true  },
  { key: 'accountHolderName', label: 'Account Holder Name',  placeholder: 'As on passbook',             mono: false },
];

const BankForm = ({ onNext, userId }) => {
  const [bankData, setBankData] = useState({ bankName: '', accountNumber: '', ifscCode: '', accountHolderName: '' });
  const [chequeImage, setChequeImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const formData = new FormData();
      const activeUserId = appendUserId(formData, userId);
      Object.keys(bankData).forEach(key => formData.append(key, bankData[key]));
      formData.append('cancelledChequeImage', chequeImage);
      await axios.post(`${BASE_URL}/bank`, formData, getAuthConfig(activeUserId));
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <KycCard stepNum={3} title="Bank Details" subtitle="Link your bank account for transactions">
        {BANK_FIELDS.map(f => (
          <TextField
            key={f.key}
            label={f.label}
            placeholder={f.placeholder}
            value={bankData[f.key]}
            onChange={(e) => setBankData({ ...bankData, [f.key]: f.mono ? e.target.value.toUpperCase() : e.target.value })}
            required
            mono={f.mono}
          />
        ))}
        <FileField label="Cancelled Cheque Image" required onChange={(e) => setChequeImage(e.target.files[0])} />
        {error && <ErrorToast message={error} />}
        <PrimaryBtn loading={loading} label="Save & Continue →" />
      </KycCard>
    </form>
  );
};

// ─────────────────────────────────────────────
// STEP 4 — SELFIE
// ─────────────────────────────────────────────
const SelfieForm = ({ onNext, userId }) => {
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const formData = new FormData();
      const activeUserId = appendUserId(formData, userId);
      formData.append('selfieImage', selfie);
      await axios.post(`${BASE_URL}/selfie`, formData, getAuthConfig(activeUserId));
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <KycCard stepNum={4} title="Live Selfie" subtitle="Take a clear selfie with good lighting. Remove glasses or face masks.">
        <FileField label="Capture Selfie" accept="image/*" capture="user" required onChange={(e) => setSelfie(e.target.files[0])} />
        {error && <ErrorToast message={error} />}
        <PrimaryBtn loading={loading} label="Save & Continue →" />
      </KycCard>
    </form>
  );
};

// ─────────────────────────────────────────────
// STEP 5 — SIGNATURE
// ─────────────────────────────────────────────
const SignatureForm = ({ onNext, userId }) => {
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const formData = new FormData();
      const activeUserId = appendUserId(formData, userId);
      formData.append('signatureImage', signature);
      await axios.post(`${BASE_URL}/signature`, formData, getAuthConfig(activeUserId));
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <KycCard stepNum={5} title="Signature" subtitle="Upload a clear image of your signature on plain white paper">
        <FileField label="Signature Image" accept="image/*" required onChange={(e) => setSignature(e.target.files[0])} />
        {error && <ErrorToast message={error} />}
        <PrimaryBtn loading={loading} label="Save & Continue →" />
      </KycCard>
    </form>
  );
};

// ─────────────────────────────────────────────
// STEP 6 — SUBMIT
// ─────────────────────────────────────────────
const SubmitKyc = ({ onNext, userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const activeUserId = cleanUserId(userId) || getStoredUserId();
      if (!activeUserId) throw new Error("Valid userId missing. Please login again.");
      localStorage.setItem("userId", activeUserId);
      await axios.post(`${BASE_URL}/submit`, { userId: activeUserId }, getAuthConfig(activeUserId));
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed. Please try again.');
      setLoading(false);
    }
  };

  const checkItems = [
    { label: "PAN Card",      icon: "🪪" },
    { label: "Aadhaar Card",  icon: "🪪" },
    { label: "Bank Details",  icon: "🏦" },
    { label: "Selfie Photo",  icon: "🤳" },
    { label: "Signature",     icon: "✍️" },
  ];

  return (
    <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-8 pt-7 pb-6 border-b border-gray-100 bg-gradient-to-br from-slate-50 to-gray-50">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Step 6 of 6</p>
        <h2 className="text-xl font-bold text-gray-900">Submit for Review</h2>
        <p className="text-sm text-gray-500 mt-1">All documents uploaded — final step before verification</p>
      </div>
      <div className="px-8 py-7">
        <div className="space-y-2 mb-2">
          {checkItems.map(item => (
            <div key={item.label} className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-600">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {item.label}
            </div>
          ))}
        </div>
        {error && <ErrorToast message={error} />}
        <PrimaryBtn
          loading={loading}
          label="✓  Submit KYC for Review"
          onClick={handleSubmit}
          type="button"
          variant="green"
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// STEP 7 — KYC STATUS / SUCCESS
// ─────────────────────────────────────────────
const KycStatus = ({ userId }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/me`, {
          params: { userId },
          ...getAuthConfig(userId),
        });
        setStatus(response.data);
      } catch (err) {
        console.error("Fetch Status Error:", err.response?.data || err.message);
      } finally { setLoading(false); }
    };
    if (userId) fetchStatus();
  }, [userId]);

  const msg = status?.message || status?.data || status;
  const panNumber      = msg?.panNumber;
  const aadhaarNumber  = msg?.aadhaarNumber;
  const panStatus      = msg?.panStatus;
  const aadhaarStatus  = msg?.aadhaarStatus;
  const bankStatus     = msg?.bankStatus;
  const selfieStatus   = msg?.selfieStatus;
  const signatureStatus = msg?.signatureStatus;
  const overallStatus  = msg?.status || msg?.kycStatus || panStatus || 'Submitted';
  const refId          = msg?._id;

  return (
    <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {loading ? (
        /* Skeleton loader */
        <div className="px-8 py-10 space-y-3">
          {[40, 70, 55, 80].map((w, i) => (
            <div
              key={i}
              className="h-3.5 rounded-full bg-gray-100 animate-pulse"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="px-8 py-10 text-center">
          {/* Success ring + check */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 animate-[scaleIn_0.5s_cubic-bezier(0.22,1,0.36,1)]">
            <style>{`
              @keyframes scaleIn {
                from { transform: scale(0.3); opacity: 0; }
                to   { transform: scale(1);   opacity: 1; }
              }
            `}</style>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M10 20l7 7 13-13" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Submitted!</h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto mb-7">
            Your documents have been received and are under review. We'll notify you once verification is complete.
          </p>

          {/* Details card */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden text-left mb-3">
            {panNumber && (
              <DetailRow label="PAN">{panNumber}</DetailRow>
            )}
            {aadhaarNumber && (
              <DetailRow label="Aadhaar">
                {'•'.repeat(8)}{String(aadhaarNumber).slice(-4)}
              </DetailRow>
            )}
            {panStatus && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">PAN Status</span>
                <StatusPill status={panStatus} />
              </div>
            )}
            {aadhaarStatus && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Aadhaar Status</span>
                <StatusPill status={aadhaarStatus} />
              </div>
            )}
            {bankStatus && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Bank Status</span>
                <StatusPill status={bankStatus} />
              </div>
            )}
            {selfieStatus && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Selfie Status</span>
                <StatusPill status={selfieStatus} />
              </div>
            )}
            {signatureStatus && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Signature Status</span>
                <StatusPill status={signatureStatus} />
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-3 gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Overall</span>
              <StatusPill status={overallStatus} />
            </div>
          </div>

          {refId && (
            <p className="text-xs text-gray-400 font-mono pt-4 border-t border-gray-100">
              Reference ID: {refId}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN CONTAINER
// ─────────────────────────────────────────────
export default function KycFlowContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();

  const userId = cleanUserId(location.state?.userId) || getStoredUserId();

  useEffect(() => {
    if (userId) localStorage.setItem("userId", userId);
    console.log("KYC USER ID:", userId);
    console.log("LOCATION STATE:", location.state);
    console.log("LOCAL STORAGE USERID:", localStorage.getItem("userId"));
    console.log("LOCAL STORAGE USER:", localStorage.getItem("user"));
  }, [userId, location]);

  const nextStep = () => setCurrentStep(prev => prev + 1);

  if (!cleanUserId(userId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center max-w-sm w-full">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Session Expired</h3>
          <p className="text-sm text-gray-500">
            Your user ID could not be found. Please log in again to continue with KYC verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-emerald-50 flex flex-col items-center px-4 pt-10 pb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 5v5c0 4.4 3 8.1 7 9 4-0.9 7-4.6 7-9V5L10 2z"
                stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
            KYC Verification
          </span>
        </div>
      </div>

      {/* Stepper */}
      <Stepper currentStep={currentStep} />

      {/* Step Screens */}
      {currentStep === 1 && <PanForm       onNext={nextStep} userId={userId} />}
      {currentStep === 2 && <AadhaarForm   onNext={nextStep} userId={userId} />}
      {currentStep === 3 && <BankForm      onNext={nextStep} userId={userId} />}
      {currentStep === 4 && <SelfieForm    onNext={nextStep} userId={userId} />}
      {currentStep === 5 && <SignatureForm onNext={nextStep} userId={userId} />}
      {currentStep === 6 && <SubmitKyc     onNext={nextStep} userId={userId} />}
      {currentStep === 7 && <KycStatus     userId={userId} />}
    </div>
  );
}