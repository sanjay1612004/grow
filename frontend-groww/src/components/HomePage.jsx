import React from 'react'
import Navbar from './Navbar'
import MarketTicker from './MarketTicker'
import IndiaComponent from './IndiaComponent'
// import InvestmentSection from './InvestmentSection'
import InvestmentLayout from './InvestmentLayout'
import MutualFundGrid from './MutualFundGrid'

const HomePage = () => {
  return (
    <div>

      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center">

        <div className="mt-4">
          <MarketTicker />
        </div>

        <h1
          className="
          -mt-3
          text-[68px]
          font-semibold
          text-[#35405A]
          text-center
          leading-22.5
          "
        >
          Groww your wealth
        </h1>

        <button
          className="
          mt-8
          w-42.5
          h-12
          bg-[#00B386]
          rounded-full
          text-white
          text-[16px]
          font-semibold
          hover:bg-[#009f78]
          transition
          "
        >
          Get started
        </button>

        <img
          src="https://resources.groww.in/web-assets/story_assets/landing-page/home_page/cityScape.svg"
          alt="city"
          className="
          -mt-45
          w-full
          max-w-375
          object-contain
          
          "
        />
        
        <IndiaComponent/>
      </div>
      <h2 className="text-[44px] font-semibold text-[#44475B] text-center leading-[52px] mt-[36px]">
        India’s stock market at your fingertips
      </h2>
      <InvestmentLayout/>


      <div className="flex flex-col items-center mt-[120px]">

        <h1 className="w-[865px] h-[48px] text-[44px] font-semibold text-[#44475B] leading-[48px] text-center">
            Build wealth, SIP by SIP
        </h1>

        <p className="mt-3 text-[22px] font-medium text-[#A0A6B5]">
          Invest in Direct Mutual Funds
        </p>

        <button
          className="mt-4 w-[138px] h-[48px] rounded-full border border-[#E6E8EF] bg-white text-[16px] font-semibold text-[#44475B] hover:shadow-lg hover:scale-105 hover:border-[#C8CCD9] transition-all duration-300 hover:bg-gray-100 mb-3"
          >
          Invest now
        </button>

      </div>
      <MutualFundGrid/>


    </div>
  )
}

export default HomePage