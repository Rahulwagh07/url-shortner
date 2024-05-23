import React from 'react'
import PieChart from './PieChart'
import MapChart from './MapChart'

function AnalyticsAdmin() {
  return (
    <div className='w-11/12 xs:w-full xs:pl-12 flex lg:flex-row items-center flex-col justify-center gap-2 bg-gray-100 mx-auto px-4 lg:px-16 py-10 overflow-x-auto min-h-screen h-auto border-gray-200'>
      <PieChart/>
      <MapChart/>
    </div>
  )
}

export default AnalyticsAdmin