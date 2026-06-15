import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrdersApi } from "../../utils/stockApi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");

  const fetchOrders = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await getOrdersApi(userId);

      if (result.success) {
        setOrders(result.data || []);
      } else {
        setError(result.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-[24px] font-bold text-[#44475b] mb-6">Orders</h2>
          <p className="text-[#7c7e8c]">Loading orders...</p>
        </div>
      </section>
    );
  }

  if (orders.length > 0) {
    return (
      <section className="w-full bg-white py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-[24px] font-bold text-[#44475b]">Orders</h2>
              <p className="text-sm text-[#7c7e8c] mt-1">Buy and sell history</p>
            </div>
            <Link to="/user/order/stocks" className="text-[#00b386] font-semibold text-sm hover:underline">
              All Orders
            </Link>
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {orders.map((order) => (
              <div key={order._id} className="flex items-center justify-between gap-4 px-4 py-4 border-b border-gray-100 last:border-b-0">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#44475b]">{order.symbol}</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      order.type === "BUY"
                        ? "bg-[#e6f7f3] text-[#00b386]"
                        : "bg-red-50 text-red-500"
                    }`}>
                      {order.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#7c7e8c] mt-1">{order.companyName || "Stock"}</p>
                  <p className="text-xs text-[#7c7e8c] mt-1">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : ""}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-[#44475b]">
                    {order.quantity} share{Number(order.quantity) > 1 ? "s" : ""} at ₹{Number(order.price || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-[#44475b] mt-1">₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</p>
                  <p className="text-xs text-[#00b386] font-semibold mt-1">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-16">

        {/* Left: Illustration */}
        <div className="flex-shrink-0">
          <img
            src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/stockEmptyDashboard.7c05e365.svg"
            alt="No open orders"
            className="w-[300px] object-contain"
          />
        </div>

        {/* Right: Text Content */}
        <div className="flex flex-col">
          <h2 className="text-[28px] font-bold text-[#44475b] leading-tight mb-4">
            You have no open <br /> orders
          </h2>

          <Link
            to="/user/order"
            className="flex items-center gap-1 text-[#00d09c] font-semibold text-[15px] hover:underline w-fit"
          >
            All Orders
            <span className="text-[18px]">›</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Orders;
