import React from 'react'
import PieChart from './PieChart'
import MapChart from './MapChart'
 
function Analytics() {
  return (
    <div className='flex items-center justify-center'>
      {/* <div className='flex items-center justify-center shadow-md z-10 w-[500px] bg-white border border-gray-100 p-4'>
      <PieChart/>
      </div> */}
      <MapChart/>
    </div>
  )
}

export default Analytics