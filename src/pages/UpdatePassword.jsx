import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate} from "react-router-dom"
import { resetPassword } from "../services/operations/authAPI"
import Spinner from "../components/common/Spinner"

function UpdatePassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { loading } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    const token = location.pathname.split("/").at(-1)
    dispatch(resetPassword(password, confirmPassword, token, navigate))
  }

  return (
    <div className="flex items-center justify-center">
      <div className=" sm:mx-auto sm:w-full sm:max-w-sm p-2 mt-16 text-black">
        <h1 className="text-xl font-bold">
          Choose new password
        </h1>
        <p className="my-4 text-gray-800 font-semibold">
          Enter your new password.
        </p>
        <form onSubmit={handleOnSubmit}>
          <label className="relative">
            <p className="block text-sm font-medium leading-6 text-gray-900">
              New Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900
                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[30px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
          <label className="relative mt-3 block">
            <p className="block text-sm font-medium leading-6 text-gray-900">
              Confirm New Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900
                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[30px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>

          <button
            type="submit"
            className="flex mt-6 w-full justify-center rounded-md bg-indigo-600 px-3 
              py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
               hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
               focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
          {loading ? <div className="flex items-center justify-center"><Spinner/></div> : " Reset Password"}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between">
          <Link to="/login">
            <p className="flex items-center gap-x-2 text-sm font-semibold text-gray-800">
              <BiArrowBack /> Back To Login
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UpdatePassword