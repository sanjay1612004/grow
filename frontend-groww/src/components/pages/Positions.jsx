import React, { useState, useEffect } from "react";

const Positions = () => {
  const [MostBought, setMostBought] = useState([]);
  const [activeTab, setActiveTab] = useState("Large");

  useEffect(() => {
    const fetchMostBoughtStocks = async () => {
      try {
        const response = await fetch(
          "https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=POPULAR_STOCKS_MOST_BOUGHT&page=0&size=15"
        );

        const data = await response.json();

        const rawStocks =
          data?.exploreCompanies?.POPULAR_STOCKS_MOST_BOUGHT || [];

        const formattedStocks = rawStocks.map((item) => {
          const ltp = item.stats.ltp || 0;
          const dayChange = item.stats.dayChange || 0;
          const dayChangePerc = item.stats.dayChangePerc || 0;
          const isUp = dayChange >= 0;

          return {
            logo: item.company.imageUrl,
            name:
              item.company.companyShortName ||
              item.company.companyName,
            price: `₹${ltp.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            changeVal: `${isUp ? "+" : ""}${dayChange.toFixed(2)}`,
            change: `${Math.abs(dayChangePerc).toFixed(2)}%`,
            up: isUp,
          };
        });

        setMostBought(formattedStocks);
      } catch (error) {
        console.error("Failed to fetch stocks:", error);
      }
    };

    fetchMostBoughtStocks();
  }, []);

  const displayedStocks =
    activeTab === "Large"
      ? MostBought.slice(0, 5)
      : activeTab === "Mid"
      ? MostBought.slice(5, 10)
      : MostBought.slice(10, 15);

  return (
    <div>
      {/* Empty State */}
      <section className="w-full bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-16">
          <div className="flex-shrink-0">
            <img
              src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/stockEmptyDashboard.7c05e365.svg"
              alt="No open orders"
              className="w-[300px] object-contain"
            />
          </div>

          <div>
            <h2 className="text-[28px] font-bold text-[#44475b] leading-tight mb-4">
              You have no open <br /> orders
            </h2>

            <p className="text-[#666]">
              Equity Intraday and MTF positions will
              <br />
              appear here
            </p>
          </div>
        </div>
      </section>

      {/* Top Gainers */}
      <section className="bg-white rounded-2xl p-8 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] font-semibold text-[#44475b]">
            Top Gainers
          </h2>

          <button className="text-[#00b386] font-semibold text-sm">
            See more
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {["Large", "Mid", "Small"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full border text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-[#e6f6f1] text-[#00b386] border-transparent"
                  : "bg-white text-[#7c7e8c] border-[#e5e7eb]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-5 gap-6">
          {displayedStocks.map((stock) => (
            <div
              key={stock.name}
              className="bg-white border border-[#e5e7eb] rounded-2xl p-3 h-[200px] flex flex-col"
            >
              <div className="w-14 h-14 border border-[#ececec] rounded-md flex items-center justify-center">
                <img
                  src={stock.logo}
                  alt={stock.name}
                  className="w-10 h-10 object-contain"
                />
              </div>

              <h3 className="mt-4 text-[14px] font-bold text-[#44475b] line-clamp-2 ml-1">
                {stock.name}
              </h3>

              <div className="mt-auto">
                <p className="text-[17px] font-semibold text-[#44475b]">
                  {stock.price}
                </p>

                <p
                  className={`mt-2 text-[13px] font-semibold ${
                    stock.up
                      ? "text-[#00b386]"
                      : "text-[#eb5757]"
                  }`}
                >
                  {stock.changeVal} ({stock.change})
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Positions;