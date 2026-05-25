const data = [
  "NIFTYAUTO 26,425.30 ↑ 1.57%",
  "NIFTYTOTALMCAP 12,888.40 ↑ 1.08%",
  "NIFTY500 22,889.60 ↑ 1.05%",
  "NIFTYIT 29,081.40 ↑ 0.58%",
  "NIFTYPSUBANK 6,850.20 ↑ 1.12%",
]

export default function MarketTicker() {
  return (
      <div
      className="
      w-178.25
      h-10
      overflow-hidden
      bg-white
      flex
      items-center
      mx-auto
      "
    >

      <div className="flex w-max animate-scroll">

        {[...data, ...data].map((item, i) => (
          <div
            key={i}
            className="mx-8 whitespace-nowrap text-sm"
          >
            <span className="text-gray-500">
              {item.split("↑")[0]}
            </span>

            <span className="ml-2 text-green-500 font-semibold">
              ↑ {item.split("↑")[1]}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}