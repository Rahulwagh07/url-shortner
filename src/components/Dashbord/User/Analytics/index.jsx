import React, { useState } from 'react'
import PieChart from './PieChart'
import MapChart from './MapChart'
import Reports from './Reports'
 
function Analytics() {
  const [selectedRecords, setSelectedRecords] = useState([]);
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center xs:flex-col md:flex-col lg:flex-row justify-center gap-2'>
      <MapChart/>
      <PieChart selectedRecords={selectedRecords} />
      </div>
      <Reports onSelectedRecordsChange={setSelectedRecords} />
    </div>
  )
}

export default Analytics