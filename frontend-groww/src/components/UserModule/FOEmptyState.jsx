const FOEmptyState = () => (
  <div className="flex flex-row items-center justify-center gap-16 py-16 px-8">
    {/* Left: Lottie-style image */}
    <div className="relative w-80 h-72 flex-shrink-0 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-72 h-64 rounded-full opacity-20"
        />
      </div>
      <img
        src="https://assets-netstorage.groww.in/web-assets/billion_groww_desktop/prod/_next/static/media/intro.981292ef.png"
        alt="F&O intro"
       className="w-full h-full object-contain"
      />
    </div>
    {/* Right: Text content */}
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium" style={{ color: "#44475b" }}>
        Introducing
      </p>
      <h2 className="text-5xl font-bold text-gray-700">
        F&O
      </h2>
      <p className="text-base mt-2" style={{ color: "#6b7280" }}>
        Trade futures and options with ease
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
export default FOEmptyState