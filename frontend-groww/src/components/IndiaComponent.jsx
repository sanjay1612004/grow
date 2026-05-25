import React from 'react'

const IndiaComponent = () => {
  return (
    <div>
        <div className="flex flex-col items-center mt-10">

  {/* Top Row */}
  <div className="flex items-center gap-4">

    <img
      src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/UnionImage.911dfe4b.webp"
      className="w-5 h-8"
    />

    <div className="text-center">

      <h2
        className="
        text-[18px]
        font-semibold
        text-[#7B8499]
        leading-7
        "
      >
        India's #1
        <br />
        Investing Platform
      </h2>

    </div>

    <img
      src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/UnionImage.911dfe4b.webp"
      className="
      w-5
      h-8
      scale-x-[-1]
      "
    />

  </div>

  {/* Bottom Text */}
  <div className="flex items-center mt-3">

    <div className="w-[110px] h-[1px] bg-[#E6E8EF]" />

    <p
      className="
      px-4
      text-[13px]
      font-medium
      text-[#A0A6B5]
      "
    >
      Trusted by 2 Cr+ active investors
    </p>

    <div className="w-[110px] h-[1px] bg-[#E6E8EF]" />

  </div>

</div>
    </div>
  )
}

export default IndiaComponent