import React, { useState }  from 'react'
import { Link} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { NavbarLinks } from '../../data/navbarlinks';
import { ImMenu } from "react-icons/im";
import { useRef } from 'react';
import useOnClickOutside  from "../../hooks/useOnClickOutside";
import ProfileDropdown from '../auth/ProfileDropdown';
import { CiLogin } from "react-icons/ci";

 
function Navbar() {

  const {token} = useSelector((state) => state.auth)
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => {    
    setShowDropdown(false);                 
  });

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
    
  return (
    <div className='flex items-center justify-center transition-all duration-300 py-2'>
      <nav className='flex justify-between  w-10/12 text-lg relative h-[40px]'>
        <Link to={"/"} className='flex gap-2 items-center justify-center'>
            <h3 className='text-black font-bold'>LINKSHORT</h3>
        </Link>

          {/*Small and Medium screen*/}
        <div className='md:hidden sm:flex mt-2 absolute right-2'>
          {
            token === null ? (
              <div className="cursor-pointer text-black" onClick={toggleDropdown}>
                <ImMenu size={28}/>
              </div>
            ): ( <ProfileDropdown/>) 
          }
        </div>   
        {
        showDropdown && (
        <div  ref={dropdownRef} className='absolute z-50 bg-gray-100 top-12 shadow-lg w-full'>
          <div className='flex flex-col items-center'>
            {NavbarLinks.map((link, index) => (
                <li key={index} className='py-2 leading-5 flex items-center hover:text-[#6674CC] transition-all duration-150 cursor-pointer'>
                  <Link
                    to={link.path}
                    onClick={() => setShowDropdown(false)}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </div>
            <div className="flex flex-col  items-center">      
              {token === null && (
                <Link to="/login">
                  <button className=" flex gap-1 items-center justify-center hover:text-[#6674CC]" onClick={() => setShowDropdown(false)}>
                     <span>Log in </span><CiLogin/>
                  </button>
                </Link>
              )}
              {token === null && (
                <Link to="/signup">
                  <button className="hover:text-[#6674CC] py-2" onClick={() => setShowDropdown(false)}>
                    Sign up
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
        {/* Large Screen */}
      <div className='flex items-center sm:hidden  lg:flex md:flex  gap-12'>
        {NavbarLinks.map((link, index) => (
            <li key={index} className='py-5 leading-5 flex gap-1 items-center hover:text-[#6674CC] transition-all duration-150 cursor-pointer'>
              <Link
                to={link.path}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </div>
        <div className='sm:hidden md:flex'>
        {token === null ? (
          <Link to="/login">
            <button className=" border border-blue-150 rounded-md text-white-25 bg-blue-700 px-6 py-1">
              Sign in
            </button>
          </Link>
        ) :  <>{token !== null && <ProfileDropdown/>}</>}
        </div>
      </nav>
    </div>
  )
}

export default Navbar