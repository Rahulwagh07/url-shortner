import {useSelector } from "react-redux"
import { sidebarLinks } from "../../data/dashboard-links"
import SidebarLink from "./SidebarLink"
import useOnClickOutside from "../../hooks/useOnClickOutside";
import Spinner from "../common/Spinner";
import { useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { loading: authLoading } = useSelector((state) => state.auth)
  useOnClickOutside(dropdownRef, () => {    
    setShowDropdown(false);                
  });
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg--800">
        <div className="flex items-center justify-center"><Spinner/></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="xs:flex hidden items-center p-2 mr-2 justify-end" onClick={toggleDropdown}>
      <GiHamburgerMenu size={40} className=" border rounded-md border-gray-400 p-2"/>
      </div>
      {
          showDropdown && 
          <div className="flex flex-col lg:hidden sm:hidden md:hidden p-6 bg-white border-b-4 rounded-lg border-gray-200">
          <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            )
          })}
        </div>
        </div>
           
        }
      
      <div className="flex h-[calc(100vh-3.5rem)] xs:hidden min-w-[200px] flex-col justify-between shadow-lg py-4">
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            )
          })}
        </div>
        {/* <div className="flex flex-col mb-12">
          <SidebarLink
            link={{ name: "Settings", path: "/admin/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() => dispatch(logout(navigate))}
            className="px-8 py-2 text-sm font-medium text-black"
          >
            <div className="flex items-center gap-x-2">
              <FiLogOut className="text-lg"/>
              <span >Logout</span>
            </div>
          </button>
        </div> */}
      </div>
    </div>
  )
}