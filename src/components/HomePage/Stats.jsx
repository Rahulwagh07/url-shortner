import React from 'react'

function Stats() {
  return (
    <div className='grid lg:grid-cols-4 text-gray-900 md:grid-cols-2 mt-12 gap-20 mx-14'>
        <div className='flex flex-col items-center justify-center border 
        border-[#cbd5e1] bg-[#fafafa] rounded-md py-8'>
            <h4 className='text-5xl font-semibold'>100k+</h4>
            <span>Active links</span>
        </div>
        <div className='flex flex-col items-center justify-center border
         border-[#cbd5e1] bg-[#fafafa] rounded-md py-8'>
            <h4 className='text-5xl font-semibold'>1TB+</h4>
            <span>Links shortened</span>
        </div>
        <div className='flex flex-col items-center justify-center border
         border-[#cbd5e1]  bg-[#fafafa]   rounded-md py-8'>
            <h4 className='text-5xl font-semibold'>2.1M+</h4>
            <span>Links created</span>
        </div>
        <div className='flex flex-col items-center justify-center border
         border-[#cbd5e1]  bg-[#fafafa]  rounded-md py-8'>
            <h4 className='text-5xl font-semibold'>100k+</h4>
            <span>Active links</span>
        </div>
    </div>
  )
}

export default Stats