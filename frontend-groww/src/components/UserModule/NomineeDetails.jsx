import React, { useState } from 'react';

export default function NomineeDetails() {
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans space-y-8 bg-white min-h-screen">
      
      {/* Complete Setup Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
        {/* Illustration */}
        <div className="mb-6">
          <img 
            src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/noNomineeImg.ab52dadf.svg" 
            alt="Setup Account Illustration" 
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Heading */}
        <h2 className="text-[19px] font-bold text-gray-700 mb-2">
          Complete setting up your account to add nominee
        </h2>

        {/* Subtext */}
        <p className="text-[14px] text-gray-400 mb-8">
          Complete your account set up to add nominee
        </p>

        {/* Action Button */}
        <button className="w-full bg-[#00d09c] hover:bg-[#00b889] text-white font-medium py-2 px-6 rounded-lg transition-colors text-[13px]">
          Complete Setup
        </button>
      </div>

      {/* FAQs Section */}
      <div>
        <h3 className="text-[20px] font-bold text-[#2c3e50] mb-4">
          FAQs
        </h3>

        {/* Accordion Item */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsFaqOpen(!isFaqOpen)}
            className="w-full flex items-center justify-between p-5 text-left transition-colors duration-150 hover:bg-gray-50/50"
          >
            <span className="text-[15px] text-gray-600 font-medium">
              Why are nominees important?
            </span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isFaqOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Collapsible Content */}
          <div 
            className={`transition-all duration-200 ease-in-out overflow-hidden border-t border-gray-50 ${
              isFaqOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-5 text-[14px] text-gray-400 leading-relaxed bg-white">
              Nominees get your investments in the event of unforeseen circumstances. It is always advisable to have nominees to keep your finances secure.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}