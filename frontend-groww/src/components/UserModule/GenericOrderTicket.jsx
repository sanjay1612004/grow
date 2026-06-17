import React, { useContext, useState } from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserBalance } from "../../App";
import { buyStockApi, sellStockApi } from "../../utils/stockApi";

export default function GenericOrderTicket({ stock }) {
  const { balance, setBalance } = useContext(UserBalance);
  const navigate = useNavigate();
  const [orderSide, setOrderSide] = useState("BUY");
  const [quantity, setQuantity] = useState("");
  const [priceMode, setPriceMode] = useState("Market");
  const [limitPrice, setLimitPrice] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  if (!stock) return null;

  // Normalize stock data depending on where it's passed from
  const lname = stock.companyName || stock.company?.companyName || stock.company?.companyShortName || "Select a Stock";
  
  // The 'symbol' used in Chart.jsx is typically the URL param (searchId), but nseScriptCode is also valid.
  const symbol = stock.searchId || stock.company?.searchId || stock.symbol || stock.company?.symbol || stock.nseScriptCode || stock.company?.nseScriptCode || stock.company?.growwContractId || "";
  
  const displayPrice = stock.ltp || stock.stats?.ltp || stock.close || 0;
  const exchange = "NSE";

  const orderPrice = priceMode === "Market" ? Number(displayPrice || 0) : Number(limitPrice || 0);
  const approxRequired = Number(quantity || 0) * Number(orderPrice || 0);
  const hasEnoughBalance = orderSide === "SELL" || Number(balance || 0) >= approxRequired;

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setOrderMessage("Please login to continue");
      return;
    }

    if (!symbol || !lname) {
      setOrderMessage("Stock details are not available");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setOrderMessage("Enter quantity");
      return;
    }

    if (!orderPrice || Number(orderPrice) <= 0) {
      setOrderMessage("Price is not available");
      return;
    }

    if (orderSide === "BUY" && !hasEnoughBalance) {
      setOrderMessage("Available amount is not enough");
      return;
    }

    try {
      setOrderLoading(true);
      setOrderMessage("");

      const payload = {
        userId,
        symbol,
        companyName: lname,
        quantity: Number(quantity),
        price: Number(orderPrice),
      };

      const result = orderSide === "BUY"
        ? await buyStockApi(payload)
        : await sellStockApi(payload);

      if (result.success) {
        setOrderMessage(orderSide === "BUY" ? "Stock bought successfully" : "Stock sold successfully");
        setQuantity("");

        if (result.data?.walletBalance !== undefined) {
          setBalance(result.data.walletBalance);
        }
      } else {
        setOrderMessage(result.message || "Order failed");
      }
    } catch (err) {
      setOrderMessage(err.response?.data?.message || "Order failed");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <aside className="min-h-[480px] rounded-sm border border-gray-200 bg-white lg:sticky lg:top-20">
      <div className="px-4 pb-3 pt-4">
        <h2 className="text-[15px] font-bold text-[#444b64]">{lname}</h2>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-[#6d7487]">
          <span>NSE ₹{Number(displayPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span>BSE ₹{Number(displayPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <button className="border-b border-[#444b64] font-semibold text-[#444b64]">Depth</button>
        </div>
      </div>

      <div className="grid grid-cols-2 border-y border-gray-200">
        {["BUY", "SELL"].map((side) => (
          <button
            key={side}
            onClick={() => {
              setOrderSide(side);
              setOrderMessage("");
            }}
            className={`relative h-12 text-[13px] font-bold ${
              orderSide === side ? "text-[#00b386]" : "text-[#444b64]"
            }`}
          >
            {side}
            {orderSide === side && (
              <span className="absolute bottom-0 left-4 right-4 h-[3px] rounded-t bg-[#00b386]" />
            )}
          </button>
        ))}
      </div>

      <div className="px-4 py-5">
        <div className="flex items-center gap-2">
          {["Delivery", "Intraday", "MTF 2.76x"].map((item, index) => (
            <button
              key={item}
              className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                index === 0
                  ? "border-[#444b64] text-[#444b64]"
                  : "border-gray-200 bg-gray-50 text-[#6d7487]"
              }`}
            >
              {item}
            </button>
          ))}
          <button className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#6d7487]">
            <Settings size={15} />
          </button>
        </div>

        <div className="mt-9 space-y-5">
          <div className="grid grid-cols-[1fr_126px] items-center gap-4">
            <label className="text-[13px] font-medium text-[#444b64]">
              Qty NSE
              <span className="ml-1 text-[#6d7487]">↕</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-8 rounded-sm border border-[#444b64] bg-white px-2 text-right text-[14px] font-semibold text-[#444b64] outline-none focus:border-[#f2c94c] focus:ring-1 focus:ring-[#f2c94c]"
            />
          </div>

          <div className="grid grid-cols-[1fr_126px] items-center gap-4">
            <button
              onClick={() => {
                setPriceMode((mode) => (mode === "Market" ? "Limit" : "Market"));
                setLimitPrice(displayPrice ? Number(displayPrice).toFixed(2) : "");
                setOrderMessage("");
              }}
              className="text-left text-[13px] font-medium text-[#444b64]"
            >
              Price {priceMode}
              <span className="ml-1 text-[#6d7487]">↕</span>
            </button>

            {priceMode === "Market" ? (
              <div className="flex h-8 items-center justify-end rounded-sm border border-gray-100 bg-gray-50 px-2 text-[13px] font-semibold text-[#444b64]">
                At market
              </div>
            ) : (
              <input
                type="number"
                min="1"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="h-8 rounded-sm border border-[#444b64] bg-white px-2 text-right text-[14px] font-semibold text-[#444b64] outline-none focus:border-[#f2c94c] focus:ring-1 focus:ring-[#f2c94c]"
              />
            )}
          </div>
        </div>

        <div className="mt-16">
          {orderMessage && (
            <div className={`mb-4 rounded-sm px-3 py-3 text-center text-xs ${
              orderMessage.includes("successfully")
                ? "bg-[#e6f7f3] text-[#00b386]"
                : "bg-[#faf2de] text-[#444b64]"
            }`}>
              {orderMessage}
            </div>
          )}

          {!hasEnoughBalance && orderSide === "BUY" && !orderMessage && (
            <div className="mb-4 rounded-sm bg-[#faf2de] px-3 py-3 text-center text-xs text-[#444b64]">
              Available amount is not enough
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-[#6d7487]">
            <span>Balance : ₹{Number(balance || 0).toLocaleString("en-IN")}</span>
            <span>Approx req. : ₹{Number(approxRequired || 0).toLocaleString("en-IN")}</span>
          </div>

          <button
            onClick={hasEnoughBalance || orderSide === "SELL" ? handlePlaceOrder : () => navigate("/user/balance/inr")}
            disabled={orderLoading}
            className="mt-4 h-11 w-full rounded-md bg-[#00b386] text-[15px] font-bold text-white transition-colors hover:bg-[#009973] disabled:bg-gray-300"
          >
            {orderLoading ? "Processing..." : !hasEnoughBalance && orderSide === "BUY" ? "Add money" : orderSide === "BUY" ? "Buy" : "Sell"}
          </button>
        </div>
      </div>
    </aside>
  );
}
