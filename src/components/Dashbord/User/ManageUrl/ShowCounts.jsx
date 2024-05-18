import React, { useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";

function ShowCounts({countryViewsData, setShowCountryViews}) {
  const [countryViews, setCountryViews] = useState(countryViewsData);
  const handleSortAscending = () => {
    const sortedCountryViews = [...countryViews].sort((a, b) => a.count - b.count);
    setCountryViews(sortedCountryViews);
  };

  const handleSortDescending = () => {
    const sortedCountryViews = [...countryViews].sort((a, b) => b.count - a.count);
    setCountryViews(sortedCountryViews);
  };
  return (
    <td className='inset-0 z-10 fixed flex items-center justify-center'>
      <div className=" bg-white border relative border-gray-300 rounded-md shadow-lg p-8">
      <IoCloseOutline onClick={() => setShowCountryViews(null)}
        size={24} className='absolute top-2 right-2 cursor-pointer'/>
        {countryViews.length === 0 ? (
          <p>0 clicks</p>
        ) : (
          <div>
          <div className="mt-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-1 px-2 rounded mr-2"
              onClick={handleSortAscending}
            >
              Sort Asc
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-1 px-2 rounded"
              onClick={handleSortDescending}
            >
              Sort Desc
            </button>
          </div>
          <ul>
            <div className='flex gap-2 mt-2'>
            <span className='font-semibold text-green-400'>Country</span>: 
            <span className='font-semibold text-green-400'>Users</span>
            </div>
            {countryViews.map((countryView) => (
              <li key={countryView.id} className='flex gap-2'>
                <span className='font-semibold text-gray-700'> {countryView.name}</span>: <span> {countryView.count}</span>
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