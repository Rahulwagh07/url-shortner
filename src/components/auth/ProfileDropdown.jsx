import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import useOnClickOutside from "../../hooks/useOnClickOutside"
import { logout } from "../../services/operations/authAPI"
import { MdOutlineNewLabel } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))
  if (!user){
    return null
  }
  
  return (
    <button className="relative" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <FaUserCircle size={28}/>
      </div>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[118%] right-0 z-[1000] overflow-hidden section_bg rounded-md shadow-lg  text-gray-600"
          ref={ref}
        > 
        <Link to={`${ user?.accountType === "User" ? "/dashboard/" : "/admin/dashboard"}`} onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[18px] text-sm hover:text-sky-500">
            <MdOutlineNewLabel className="text-2xl text-sky-500" />
            Dashboard
            </div>
        </Link>
            
        <div
        onClick={() => {
            dispatch(logout(navigate))
            setOpen(false)
        }}
        className="flex w-full items-center gap-x-1 py-[10px] px-[18px] text-sm hover:text-sky-500"
        >
        <FiLogOut className="text-lg text-sky-500" />
        Logout
        </div>
        </div>
      )}
    </button>
  )
}