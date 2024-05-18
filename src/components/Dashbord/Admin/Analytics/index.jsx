import React from 'react'
import PieChart from './PieChart'
import MapChart from './MapChart'

function AnalyticsAdmin() {
  return (
    <div className='flex items-center xs:flex-col justify-center gap-2'>
      <PieChart/>
      <MapChart/>
    </div>
  )
}

export default AnalyticsAdmin