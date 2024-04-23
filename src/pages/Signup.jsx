import React from 'react'
import SignupForm from '../components/auth/SignupForm'

function Signup() {
  return (
    <div className='flex flex-col items-center justify-center  lg:mt-8'>
      <div className='flex flex-col items-center justify-center lg:shadow-lg md:shadow-lg p-8 mb-4 sm:w-[320px]'>
          <h3 className='font-bold text-lg'>Create an account</h3>
          <SignupForm/>
      </div>
  </div>
  )
}

export default Signup