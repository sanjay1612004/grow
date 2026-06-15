import { useEffect, useState } from "react";
import { getOrdersApi } from "../../utils/stockApi";

const StocksEmptyState = () => {
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
      <div className="py-16 px-8">
        <p className="text-gray-500">Loading stock orders...</p>
      </div>
    );
  }

  if (orders.length > 0) {
    return (
      <div className="py-6">
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500">
            <span>Stock</span>
            <span>Type</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Status</span>
          </div>

          {orders.map((order) => (
            <div key={order._id} className="grid grid-cols-5 px-4 py-4 border-t border-gray-100 text-sm items-center">
              <div>
                <p className="font-bold text-gray-700">{order.symbol}</p>
                <p className="text-xs text-gray-500 mt-1">{order.companyName || "Stock"}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : ""}
                </p>
              </div>
              <span className={`w-fit text-[11px] font-bold px-2 py-0.5 rounded ${
                order.type === "BUY" ? "bg-[#e6f7f3] text-[#00b386]" : "bg-red-50 text-red-500"
              }`}>
                {order.type}
              </span>
              <p className="text-right text-gray-700">{order.quantity}</p>
              <p className="text-right text-gray-700">₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</p>
              <p className="text-right text-[#00b386] font-semibold">{order.status}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
  <div className="flex flex-row items-center justify-center gap-16 py-16 px-8">
    {/* Left: Intro image */}
    <div className="relative w-80 h-72 flex-shrink-0 flex items-center justify-center">
      <img
        src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/intro.981292ef.png"
        alt="Stocks intro"
        className="w-full h-full object-contain"
      />
    </div>

    {/* Right: Text content */}
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-gray-700">
        Introducing
      </p>
      <h2 className="text-5xl font-bold text-gray-700">
        Stocks
      </h2>
      <p className="text-base mt-2 text-gray-700">
        Investing in stocks will never be the same again
      </p>
      <div className="mt-4">
        <button
          className="px-6 py-3 rounded text-white font-bold text-sm tracking-wider uppercase cursor-pointer border-none"
          style={{ backgroundColor: "#00d09c" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#00b589")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#00d09c")}
        >
          TRY IT OUT
        </button>
      </div>
    </div>
  </div>
  );
};
export default StocksEmptyState;
