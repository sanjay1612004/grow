import { Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate();

  function handleclick() {
    navigate("/signup");
  }

  return (
    <nav className="w-full h-22   px-8 flex items-center justify-between sticky top-0 z-1000 bg-white/70 backdrop-blur-md">

      {/* LEFT */}
      <div className="flex items-center gap-10">

        <img src="https://resources.groww.in/web-assets/img/website-logo/groww_logo.webp" alt="" width={122} height={33}/>

        {/* Menu */}
        <ul className="hidden lg:flex items-center gap-10 text-gray-700 font-medium">

          <li className="hover:text-black cursor-pointer text-[#7c7E8C]">
            Stocks
          </li>

          <li className="hover:text-black cursor-pointer text-[#7c7E8C]">
            F&O
          </li>

          <li className="hover:text-black cursor-pointer text-[#7c7E8C]">
            Mutual Funds
          </li>

          <li className="flex items-center gap-1 hover:text-black cursor-pointer text-[#7c7E8C]">
            More
            <ChevronDown size={16}/>
          </li>

        </ul>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="hidden md:flex items-center w-[320px] h-10 px-4 border border-[#7c7E8C] rounded-lg">

          <Search
            size={18}
            className="text-gray-500"
          />

          <input
            type="text"
            placeholder="Search Groww...."
            className="w-full px-3 outline-none"
          />

          <span className="text-sm text-gray-400">
            Ctrl+K
          </span>

        </div>

        {/* Button */}
        <button
          className="
          bg-[#00D09C]
          px-5
          py-2
          rounded-lg
          text-white
          font-semibold
          hover:bg-[#00be8e]
          transition
          "
          onClick={handleclick}
        >
          Login/Sign up
        </button>

      </div>

    </nav>
  );
};

export default Navbar;