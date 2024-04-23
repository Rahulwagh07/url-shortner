import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className='bg-[#f8fafc] grid lg:grid-cols-2 lg:place-items-start 
      md:place-items-center md:grid-cols-1 gap-2 pb-12 rounded-b-[25px]'>
      <div className='flex flex-col mx-14 gap-8 mt-16'>
        <h3 className='text-5xl text-black font-bold'>
          Organize your links <br className='mb-2' /> and track their <br className='mb-2' /> performance
        </h3>
        <p>Secure link management to protect your data <br /> from unauthorized sharing.</p>
        <div className='flex gap-4'>
          <Link to='/login' className='bg-black text-white-25 p-2 px-4'>
            Explore now
          </Link>
          <Link to='/signup' className='bg-[#f9fafb] border text-gray-900 border-black p-2 px-6'>
            Short url
          </Link>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default HeroSection;
