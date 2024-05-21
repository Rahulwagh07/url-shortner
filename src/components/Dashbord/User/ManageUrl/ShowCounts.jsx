import React, { useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import { IoToggle } from "react-icons/io5";
import { GoArrowDown } from "react-icons/go";

function ShowCounts({countryViewsData, setShowCountryViews, modalState}) {
  const [countryViews, setCountryViews] = useState(countryViewsData);
  const [showClicks, setShowClicks] = useState(modalState);
  const [toggle, setToggle] = useState(true)
  const [arrowAsc, setArrowAsc] = useState(false)
  const handleSort = () => {
    const sortedCountryViews = [...countryViews];
    if (arrowAsc) {
      sortedCountryViews.sort((a, b) => b.count - a.count);  
    } else {
      sortedCountryViews.sort((a, b) => a.count - b.count);  
    }
    setCountryViews(sortedCountryViews);
    setArrowAsc(!arrowAsc);  
   };

   const handleToggle = () => {
    setToggle(!toggle)
    setShowClicks(!showClicks);
   }
  
  return (
    <td className='inset-0 z-10 fixed flex items-center justify-center
    bg-black  bg-opacity-60 backdrop-blur-sm transition-opacity duration-300'>
      <div className=" bg-white border relative border-gray-300 rounded-md shadow-lg p-12">
      <IoCloseOutline onClick={() => setShowCountryViews(null)}
        size={24} className='absolute top-2 right-2 cursor-pointer'/>

        {countryViews.length === 0 ? (
          <p>0 clicks</p>
        ) : (
          <div>
          <div className="mt-2 flex justify-between items-center px-0.5">
            <IoToggle onClick={handleToggle}
            size={36}  className={`cursor-pointer ${toggle ? "text-blue-500" : "text-blue-600 rotate-180"}`}/>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-normal py-1 px-2 rounded-lg"
              onClick={handleSort}
            >
              <div className='flex gap-1 items-center justify-center '>
                <span className='text-sm'>Sort</span>
                {
                  arrowAsc ? <GoArrowDown className='rotate-180'/> : <GoArrowDown/>
                }
              </div>
            </button>
          </div>
          <ul className='flex flex-col'>
            <div className='flex gap-2 mt-2'>
            <span className='font-semibold text-black'>Country</span>: 
            <span className='font-semibold text-black'>
              {
                showClicks ? "Clicks" : "Users"
              }
            </span>
            </div>
            {countryViews.map((countryView) => (
              <li key={countryView.id} className=''>
                {
                  showClicks ? <div className='grid grid-cols-2 gap-2'>
                   <span className=''> 
                  {countryView.name} : </span>  <span> {countryView.clicks}</span>
                   </div> : 
                   <div className='grid grid-cols-2 gap-2'>
                   <span className=''> 
                  {countryView.name} : </span> <span> {countryView.count}</span>
                   </div>
                }
              </li>
            ))}
          
          </ul>
        </div>
      )}
    </div>
  </td>
  )
}

export default ShowCounts