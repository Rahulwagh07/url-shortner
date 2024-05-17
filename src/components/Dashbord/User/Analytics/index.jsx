import React from 'react'
import PieChart from './PieChart'
import MapChart from './MapChart'
 
function Analytics() {
  return (
    <div className='flex xs:flex-col items-center gap-2 justify-center'>
      <div className='flex items-center justify-center shadow-md bg-white border border-gray-300 p-4'>
      <PieChart/>
      </div>
      <div className='flex items-center justify-center shadow-md  bg-white border border-gray-300 p-4'>
      <MapChart/>
      </div>
    </div>
  )
}

export default Analytics