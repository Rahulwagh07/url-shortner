import React from 'react'
import { FiExternalLink } from "react-icons/fi";
import { SiTplink } from "react-icons/si";
import { BsActivity } from "react-icons/bs";
import { LuLink } from "react-icons/lu";

function Stats() {
  return (
    <div className='grid lg:grid-cols-4 text-gray-900 md:grid-cols-2 mt-12 gap-20 mx-14'>
        <div className='flex flex-col items-center justify-center  border 
        border-[#cbd5e1] bg-[#fafafa] rounded-md py-8'>
            <div className='rounded-full p-2 bg-green-600'><BsActivity size={32} className='text-white-25'/></div>
            <h4 className='text-5xl font-semibold'>100k+</h4>
            <span className=''>Active links</span>
        </div>
        <div className='flex flex-col items-center justify-center  border 
        border-[#cbd5e1] bg-[#fafafa] rounded-md py-8'>
            <div className='rounded-full p-2 bg-red-600'><SiTplink size={32} className='text-white-25'/></div>
            <h4 className='text-5xl font-semibold'>1TB+</h4>
            <span className=''>Links shortend</span>
        </div>
        <div className='flex flex-col items-center justify-center  border 
        border-[#cbd5e1] bg-[#fafafa] rounded-md py-8'>
            <div className='rounded-full p-3 bg-sky-600'><LuLink size={32} className='text-white-25'/></div>
            <h4 className='text-5xl font-semibold'>87.5k+</h4>
            <span className=''>Links created</span>
        </div>
        <div className='flex flex-col items-center justify-center  border 
        border-[#cbd5e1] bg-[#fafafa] rounded-md py-8'>
            <div className='rounded-full p-3 bg-blue-600'><FiExternalLink size={32} className='text-white-25'/></div>
            <h4 className='text-5xl font-semibold'>2M+</h4>
            <span className=''>Links visited</span>
        </div>
    </div>
  )
}

export default Stats