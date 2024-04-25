import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { sidebarLinks } from "../../data/dashboard-links"
import { logout } from "../../services/operations/authAPI"
import SidebarLink from "./SidebarLink"

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
 
  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg--800">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[200px] flex-col justify-between shadow-lg py-4">
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