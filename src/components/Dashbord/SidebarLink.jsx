import * as Icons from "react-icons/vsc"
import { NavLink, matchPath, useLocation } from "react-router-dom"

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <NavLink
      to={link.path}
      className={`relative px-8 py-2 sm:py-1 text-sm font-medium ${
        matchRoute(link.path)
          ? "bg-black text-white"
          : "bg-opacity-0 text-black"
      } transition-all duration-200`}
    >
      <div className="flex items-center gap-x-2">
        <Icon className={` text-lg ${
        matchRoute(link.path)
          ? "text-sky-400"
          : "bg-opacity-0 text-sky-400"
      }`} />
        <span>{link.name}</span>
      </div>
    </NavLink>
  )
}