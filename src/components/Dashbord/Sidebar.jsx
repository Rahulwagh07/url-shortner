import {useSelector } from "react-redux"
import { sidebarLinks } from "../../data/dashboard-links"
import SidebarLink from "./SidebarLink"
 
export default function Sidebar({setShowDropdown}) {
  const { user} = useSelector((state) => state.profile
  );

  return (
    <div className="relative">
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[200px] flex-col justify-between shadow-lg py-4">
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} setShowDropdown={setShowDropdown}/>
            )
          })}
        </div>
      </div>
    </div>
  )
}