const MutualFundsEmptyState = () => (
  <div className="flex flex-col items-center justify-center ">
    <img
      src="https://assets-v2.lottiefiles.com/a/67972e32-1181-11ee-bd43-33ab23e2cde2/2fM0Wf1cG5.png"
      alt="Empty box"
      className="object-contain"
      onError={(e) => {
        e.target.style.display = "none";
      }}
      height={400}
      width={400}
    />
    <p className="text-sm text-gray-700 text-center">
      You have not placed any Mutual Fund orders yet
    </p>
  </div>
);
export default MutualFundsEmptyState