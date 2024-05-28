import React from 'react';
import ShortenUrlForm from './ShortUrlForm';
 
function HeroSection() {
  return (
    <div className='pt-8 bg-gray-100 grid lg:grid-cols-2
     md:grid-cols-1 gap-2 pb-20 rounded-b-[25px]'>
      <div className='flex lg:mx-14 w-full mt-16 xs:mt-6'>
        <ShortenUrlForm/>
      </div>
      <div className='flex flex-col lg:mx-14 items-center lg:items-start gap-8 mt-16 xs:p-2'>
        <h3 className='text-5xl text-black font-bold'>
          Organize your links <br className='mb-2' /> and track their <br className='mb-2' /> performance
        </h3>
        <p>Secure link management to protect your data <br /> from unauthorized sharing.</p>
      </div>
    </div>
  );
}

export default HeroSection;
