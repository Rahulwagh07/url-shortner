import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link} from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { login } from "../../services/operations/authAPI"
import { ACCOUNT_TYPE } from '../../utils/constants'
 
function LoginForm() {
    const navigate  = useNavigate()
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const { email, password } = formData;

    const handleOnChange = ( e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]:e.target.value,
        }))
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accountType } = await login(email, password, dispatch);
            if (accountType === ACCOUNT_TYPE.ADMIN) {
                navigate("/admin/dashboard")
            }
            else{
                navigate("/dashboard")
            }
        } catch (error) {
            navigate("/login")
            console.log("Login Error", error)
        }
    }

  return (
    <form
        onSubmit={handleOnSubmit}
        className=''
        >
        <label className="w-full">
            <p className="mb-3 mt-5 leading-[1.375rem] text-black">
                Email Address <sup className="text-pink-200">*</sup>
            </p>
            <input
                required
                type="text"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Enter email address"
                className="w-[325px] sm:w-[260px] h-[50px]  px-2 border border-sky-500 focus:outline-none rounded-md mb-4"    
            />
        </label>
        <label className="relative">
            <p className="mb-3 leading-[1.375rem] text-black">
                Password <sup className="text-pink-200">*</sup>
            </p>
            <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className="w-[325px] sm:w-[260px] h-[50px] px-2 border border-sky-500 focus:outline-none rounded-md mb-4"
            />
            <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 z-[10] cursor-pointer mt-3" 
            >
            {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
            </span>
            <Link to="/forgot-password">
                <span className="mt-2 flex items-center justify-center text-sm font-semibold text-black hover:text-blue-150">Forgot Password</span>
            </Link>
        </label>
        <button
            type="submit"
            className="mt-6 bg-blue-150 rounded-[8px] py-[8px] px-[12px] font-medium text-white-25 w-full"
        >
            Next
        </button>
    </form>
  )
}

export default LoginForm