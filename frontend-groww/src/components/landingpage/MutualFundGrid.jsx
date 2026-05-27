import React from "react";

const CELL = 70;

const COLS = 18;
const ROWS = 10;

const MutualFundGrid = () => {
  const TOTAL = COLS * ROWS;

  return (
    <div>



      {/* Grid Section */}

      <div className="relative w-[1260px] h-[700px] mx-auto overflow-hidden flex justify-center items-center">

        {/* Background */}

        <img
          src="https://resources.groww.in/web-assets/story_assets/landing-page/home_page/mf-bg.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-fill z-[1]"
        />

        {/* Grid */}

        <div
          className="absolute inset-0 z-[2] grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`
          }}
        >

          {Array.from({ length: TOTAL }).map((_, index) => (

            <div
              key={index}
              className="w-[70px] h-[70px] border border-[#E5E7EB] bg-white hover:bg-transparent transition-all duration-[1200ms]"
            />

          ))}

        </div>

        {/* Fade Edges */}

        <div className="absolute top-0 left-0 w-full h-[160px] bg-gradient-to-b from-white to-transparent pointer-events-none z-[3]" />

        <div className="absolute bottom-0 left-0 w-full h-[160px] bg-gradient-to-t from-white to-transparent pointer-events-none z-[3]" />

        <div className="absolute left-0 top-0 w-[180px] h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-[3]" />

        <div className="absolute right-0 top-0 w-[180px] h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-[3]" />

        {/* Phone */}

        <div className="relative z-[4] animate-[floatPhone_6s_ease-in-out_infinite]">

          <img
            src="https://resources.groww.in/web-assets/story_assets/landing-page/home_page/mf-mock-image.webp"
            alt=""
            className="w-[360px] rounded-[30px] object-contain shadow-xl"
          />

        </div>

      </div>

      <style>{`
        @keyframes floatPhone{

          0%,100%{
            transform:translateY(0px);
          }

          50%{
            transform:translateY(-18px);
          }

        }
      `}</style>

    </div>
  );
};

export default MutualFundGrid;