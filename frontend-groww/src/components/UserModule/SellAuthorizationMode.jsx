import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "How does T-PIN work?",
    answer:
      "T-PIN is a verification step on CDSL to authorise the sale of your holdings. You'll be redirected to verify whenever you place a sell order.",
  },
  {
    id: 2,
    question: "Is there a faster way to execute sell orders?",
    answer:
      "Yes. Enable DDPI to authorise once and place sell orders with a single tap.",
  },
  {
    id: 3,
    question: "How do I opt for DDPI?",
    answer:
      "Use the Switch to DDPI option below to begin the quick setup.",
  },
  {
    id: 4,
    question: "Do I have to pay ₹100 + GST everytime?",
    answer:
      "No. With DDPI, you authorise once and sell without additional charges per transaction.",
  },
];

function ChevronDown({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-4 px-1 text-left group"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
          {faq.question}
        </span>
        <ChevronDown
          className={`text-gray-700 shrink-0 ml-3 transition-transform duration-200 ${
            open ? "-rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <p className="text-sm text-gray-500 pb-4 px-1 leading-relaxed">
          {faq.answer}
        </p>
      )}
    </div>
  );
}

export default function SellAuthorisationMode() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-[860px] mx-auto space-y-5">

        {/* Page Title */}
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
          Sell authorisation
        </h1>

        {/* TPIN Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Top row */}
          <div className="flex items-start justify-between px-5 py-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  TPIN (eDIS)
                </span>
                <span className="text-[11px] font-semibold text-[#00b899] bg-[#e6faf7] px-2 py-0.5 rounded">
                  ENABLED
                </span>
              </div>
              <p className="text-xs text-gray-700">
                It requires verification on CDSL to sell your holdings
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button className="text-xs font-medium text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors">
                Change T-PIN
              </button>
              <button className="text-xs font-medium text-[#00b899] border border-[#00b899] rounded-md px-3 py-1.5 hover:bg-[#e6faf7] transition-colors">
                Switch to DDPI
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-200 mx-5" />

          {/* DDPI hint row */}
          <div className="flex items-start gap-2 px-5 py-3">
            <SparkleIcon />
            <p className="text-xs text-gray-500">
              Enabling DDPI is a faster way to capture sell price with one tap.
            </p>
          </div>
        </div>

        {/* FAQs Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 pt-4 pb-2">
          <h2 className="text-sm font-bold text-gray-900 mb-1">FAQs</h2>

          <div className="divide-y divide-gray-200">
            {faqs.map((faq) => (
              <FaqItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}