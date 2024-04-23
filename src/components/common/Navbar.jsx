import React, { useState }  from 'react'
import { Link} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { NavbarLinks } from '../../data/navbarlinks';
import { IoReorderThree } from 'react-icons/io5';
import { useRef } from 'react';
import useOnClickOutside  from "../../hooks/useOnClickOutside";
import logo from "../../assets/react.svg"
import ProfileDropdown from '../auth/ProfileDropdown';
 
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
    <div className='flex items-center justify-center transition-all duration-300 section_bg py-2'>
      <nav className='flex justify-between max-w-maxScreen w-10/12 text-lg relative h-[40px]'>
        <Link to={"/"} className='flex gap-2 items-center justify-center'>
            <h3 className='text-black font-bold'>LINKSHORT</h3>
        </Link>

          {/*Small and Medium screen*/}
        <div className='flex lg:hidden gap-4 items-center justify-center mt-2'>
          {
            token === null ? (
              <div className="cursor-pointer  text-blue-150" onClick={toggleDropdown}>
                <IoReorderThree size={32}/>
              </div>
            ): ( <ProfileDropdown/>) 
          }
        </div>   
        {
        showDropdown && (
        <div  ref={dropdownRef} className='absolute section_bg top-12 border-t border-sky-500 shadow-lg w-full'>
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
                  <button className="hover:text-[#6674CC]" onClick={() => setShowDropdown(false)}>
                    Log in
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
      <div className='flex items-center   gap-12 sm:hidden md:hidden'>
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
        <div className="flex items-center gap-8 sm:hidden md:hidden">
          {token === null && (
            <Link to="/login">
              <button className="rounded-md  border-brand items-center px-7 py-2">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-md border-brand items-center px-7 py-2">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown/>}
        </div>    
      </nav>
    </div>
  )
}

export default Navbar