import React from 'react'
import LoginForm from '../components/auth/LoginForm';
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';
 
function Login() {
  return (
    <div className='flex items-center justify-center mt-20'>
        <div className='shadow-lg flex flex-col mx-auto justify-center items-center relative p-20 sm:p-8'>
            <p className="font-bold">Welcome Back!</p>
            <Link to={"/"}>
                <FaArrowLeftLong size={24}
                className='absolute top-8 left-20 sm:left-6 cursor-pointer'
                />
            </Link>
            <LoginForm/>
            <div className='text-center'>
                <Link to="/signup">
                    Don't have an account? <span className='font-semibold cursor-pointer hover:text-blue-150'>Sign up</span>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Login