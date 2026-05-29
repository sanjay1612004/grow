import React from "react";
import { Link } from "react-router-dom";

const Orders = () => {
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