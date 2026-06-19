import React, { useContext, useEffect, useState } from 'react'
import { UserBalance } from "../../App";
import { getHoldingsApi, sellStockApi } from "../../utils/stockApi";

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSellId, setActiveSellId] = useState("");
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState("");
  const [sellLoading, setSellLoading] = useState(false);
  const [sellMessage, setSellMessage] = useState("");
  const { setBalance } = useContext(UserBalance);
  const userId = localStorage.getItem("userId");

  const fetchHoldings = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await getHoldingsApi(userId);

      if (result.success) {
        setHoldings(result.data || []);
      } else {
        setError(result.message || "Failed to fetch holdings");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch holdings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const openSellForm = (stock) => {
    setActiveSellId(stock._id);
    setSellQuantity(1);
    setSellPrice(stock.avgBuyPrice || "");
    setSellMessage("");
  };

  const handleSellStock = async (stock) => {
    if (!userId) {
      setSellMessage("Please login before selling stocks");
      return;
    }

    if (!sellQuantity || Number(sellQuantity) <= 0) {
      setSellMessage("Enter a valid quantity");
      return;
    }

    if (Number(sellQuantity) > Number(stock.quantity)) {
      setSellMessage("Sell quantity cannot be more than holding quantity");
      return;
    }

    if (!sellPrice || Number(sellPrice) <= 0) {
      setSellMessage("Enter a valid sell price");
      return;
    }

    try {
      setSellLoading(true);
      setSellMessage("");

      const result = await sellStockApi({
        userId,
        symbol: stock.symbol,
        companyName: stock.companyName,
        quantity: Number(sellQuantity),
        price: Number(sellPrice),
      });

      if (result.success) {
        setSellMessage("Stock sold successfully");

        if (result.data?.walletBalance !== undefined) {
          setBalance(result.data.walletBalance);
        }

        setActiveSellId("");
        await fetchHoldings();
      } else {
        setSellMessage(result.message || "Sell failed");
      }
    } catch (err) {
      setSellMessage(err.response?.data?.message || "Sell failed");
    } finally {
      setSellLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-[24px] font-bold text-[#44475b] mb-6">Holdings</h2>
          <p className="text-[#7c7e8c]">Loading holdings...</p>
        </div>
      </section>
    );
  }

  if (holdings.length > 0) {
    const totalInvested = holdings.reduce((sum, stock) => sum + Number(stock.investedAmount || 0), 0);

    return (
      <section className="w-full bg-white py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-[24px] font-bold text-[#44475b]">Holdings</h2>
              <p className="text-sm text-[#7c7e8c] mt-1">{holdings.length} stock{holdings.length > 1 ? "s" : ""}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#7c7e8c]">Total invested</p>
              <p className="text-lg font-bold text-[#44475b]">₹{totalInvested.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-6 px-4 py-3 bg-gray-50 text-xs font-semibold text-[#7c7e8c]">
              <span>Stock</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Avg price</span>
              <span className="text-right">Invested</span>
              <span className="text-right">Updated</span>
              <span className="text-right">Action</span>
            </div>

            {holdings.map((stock) => (
              <div key={stock._id} className="border-t border-gray-100">
                <div className="grid grid-cols-6 px-4 py-4 text-sm items-center">
                  <div>
                    <p className="font-bold text-[#44475b]">{stock.symbol}</p>
                    <p className="text-xs text-[#7c7e8c] mt-1">{stock.companyName || "Stock"}</p>
                  </div>
                  <p className="text-right font-semibold text-[#44475b]">{stock.quantity}</p>
                  <p className="text-right text-[#44475b]">₹{Number(stock.avgBuyPrice || 0).toLocaleString("en-IN")}</p>
                  <p className="text-right text-[#44475b]">₹{Number(stock.investedAmount || 0).toLocaleString("en-IN")}</p>
                  <p className="text-right text-xs text-[#7c7e8c]">
                    {stock.updatedAt ? new Date(stock.updatedAt).toLocaleDateString("en-IN") : "-"}
                  </p>
                  <div className="text-right">
                    <button
                      onClick={() => activeSellId === stock._id ? setActiveSellId("") : openSellForm(stock)}
                      className="text-sm font-bold text-red-500 hover:text-red-600"
                    >
                      {activeSellId === stock._id ? "Cancel" : "Sell"}
                    </button>
                  </div>
                </div>

                {activeSellId === stock._id && (
                  <div className="mx-4 mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                      <div>
                        <label className="text-xs font-semibold text-[#7c7e8c]">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          max={stock.quantity}
                          value={sellQuantity}
                          onChange={(e) => setSellQuantity(e.target.value)}
                          className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b386] bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#7c7e8c]">Sell price</label>
                        <input
                          type="number"
                          min="1"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(e.target.value)}
                          className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b386] bg-white"
                        />
                      </div>

                      <button
                        onClick={() => handleSellStock(stock)}
                        disabled={sellLoading}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold text-sm px-5 py-2 rounded-lg"
                      >
                        {sellLoading ? "Selling..." : "Sell"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-[#7c7e8c]">
                        Total: ₹{(Number(sellQuantity || 0) * Number(sellPrice || 0)).toLocaleString("en-IN")}
                      </p>
                      {sellMessage && (
                        <p className={`text-xs font-semibold ${sellMessage.includes("successfully") ? "text-[#00b386]" : "text-red-500"}`}>
                          {sellMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
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
