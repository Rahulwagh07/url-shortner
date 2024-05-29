import React, { useState } from 'react'
import PieChart from './PieChart'
import MapChart from './MapChart'
import Reports from './Reports'
 
function Analytics() {
  return (
    <div className='flex flex-col gap-2 w-11/12 bg-gray-100 mx-auto px-4 py-10 overflow-x-auto min-h-screen h-auto border-gray-200'>
      <div className='flex w-full items-center xs:pl-12 xs:flex-col md:flex-col lg:flex-row justify-center gap-2'>
      <PieChart/>
      <MapChart/>
      </div>
      <Reports/>
    </div>
  )
}

export default Analytics