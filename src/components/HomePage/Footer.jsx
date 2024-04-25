import React from 'react'

function Footer() {
  return (
    <div className='mt-12 border-t  border-[#e2e8f0]'>
      <div className='flex justify-between xs:mx-2 xs:flex-col xs:gap-2 xs:items-center xs:justify-center mx-14 mt-12 mb-16'>
      <h3 className='text-2xl font-semibold'>Linkshort</h3>
      <ul className='flex flex-col gap-1'>
        <li className='font-semibold'>Dashboard</li>
        <li>FAQ</li>
        <li>Contact</li>
        <li>Explore other products</li>
      </ul>
      </div>
    </div>
  )
}

export default Footer