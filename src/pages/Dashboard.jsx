import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashbord/Sidebar";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { useRef, useState} from "react";

function Dashboard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowDropdown(false);
      setIsAnimating(false);
    }, 300);  
  };

  return (
    <div className="relative flex xs:flex-col min-h-[calc(100vh-3.5rem)]">
      <div
        className={`absolute z-50 bg-white transition-transform duration-300 ${
          isAnimating ? "-translate-x-full" : showDropdown ? "translate-x-0" : "-translate-x-full"
        }`}
        ref={dropdownRef}
      >
        {showDropdown && <Sidebar setShowDropdown={closeDropdown} />}
      </div>
      <div className="absolute z-10 left-1 " onClick={toggleDropdown}>
        <RiMenuUnfoldLine size={40} className="p-2 cursor-pointer" />
      </div>
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto"
        onClick={closeDropdown}>
        <div className="mx-auto w-11/12 h-full p-16 py-10 bg-gray-100 border-gray-200 rounded-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;