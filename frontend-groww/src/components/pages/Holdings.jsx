import React from 'react'

const Holdings = () => {
  
      return (
    <section className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-0">

        {/* Left Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/intro.981292ef.png"
            alt="Introducing Stocks"
            className="w-full max-w-[340px] object-contain"
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 max-w-[380px]">
          <p className="text-[18px] font-semibold text-[#44475b] mb-3">
            Introducing
          </p>

          <h1 className="text-[32px] leading-none font-bold text-[#44475b] mb-10">
            Stocks
          </h1>

          <p className="text-[14px] text-[#7c7e8c] leading-relaxed mb-10">
            Investing in stocks will never be the same again
          </p>

          <button className="bg-[#00d09c] hover:bg-[#00bc8d] text-white font-bold text-[16px] px-4 py-2 rounded-xl transition-all">
            TRY IT OUT
          </button>
        </div>

      </div>
    </section>
  );


  
}

export default Holdings