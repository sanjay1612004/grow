const StocksEmptyState = () => (
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
export default StocksEmptyState;