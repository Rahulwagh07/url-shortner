import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { setSignupData } from '../../slices/authSlice';
import { sendOtp } from '../../services/operations/authAPI';
 
function SignupForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        country:"",
        password: "",
      })

    const [showPassword, setShowPassword] = useState(false)
 
    const { username, email, country, password} = formData

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
          ...prevData,
          [e.target.name]: e.target.value,
        }))
      }

      // Handle Form Submission
    const handleOnSubmit = (e) => {
        e.preventDefault()
        const signupData = {
        ...formData,
        }
        dispatch(setSignupData(signupData))
        dispatch(sendOtp(formData.email, navigate))

        // Reset
        setFormData({
        username: "",
        email: "",
        country: "",
        password: "",
        })
    }

  return (
    <div className='lg:w-[500px] md:w-[500px] flex flex-col items-center justify-center text-black'>
        <form onSubmit={handleOnSubmit} className="flex w-full flex-col items-center justify-center gap-4 lg:w-[380px]">
        <label className="w-full mr-4 ml-4 sm:mr-0">
          <p className="mb-1">
            Name <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="username"
            value={username}
            onChange={handleOnChange}
            placeholder="Enter your name"
            className="lg:w-[400px] md:w-full  sm:h-[42px] sm:items-center lg:ml-[-10px]  sm:w-[260px] h-[50px] rounded-md  border border-sky-500 focus:outline-none pl-2"
          />
        </label>
        <label className="w-full mr-4 ml-4 sm:mr-0">
          <p className="mb-1">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="lg:w-[400px] md:w-full  sm:h-[42px] sm:items-center lg:ml-[-10px]  sm:w-[260px] h-[50px] rounded-md  border border-sky-500 focus:outline-none pl-2"
          />
        </label>
        <label className="w-full mr-4 ml-4 sm:mr-0">
          <p className="mb-1">
            Country <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="country"
            value={country}
            onChange={handleOnChange}
            placeholder="Enter your name"
            className="lg:w-[400px] md:w-full  sm:h-[42px] sm:items-center lg:ml-[-10px]  sm:w-[260px] h-[50px] rounded-md  border border-sky-500 focus:outline-none pl-2"
          />
        </label>
        <label className="relative w-full mr-4 ml-4 sm:mr-0">
            <p className="mb-1">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="lg:w-[400px] md:w-full  sm:h-[42px] sm:items-center lg:ml-[-10px]  sm:w-[260px] h-[50px] rounded-md  border border-sky-500 focus:outline-none pl-2"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-[38px] z-[10] cursor-pointer mt-1"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        <button
          type="submit"
          className="bg-blue-150 sm:w-[260px] py-2 px-4 text-white-25 rounded flex items-center justify-center mb-4 w-full h-[50px]"
        >
          Next  
        </button>
      </form>
    </div>
  )
}

export default SignupForm