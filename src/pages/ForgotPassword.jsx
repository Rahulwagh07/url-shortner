import { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getPasswordResetToken } from "../services/operations/authAPI"
import Spinner from "../components/common/Spinner"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(getPasswordResetToken(email, setEmailSent))
  }

  return (
    <div className="flex items-center justify-center">
        <div className="max-w-lg p-12 mt-16 text-black">
          <h1 className=" font-semibold text-xl">
            {!emailSent ? "Reset your password" : "Check email"}
          </h1>
          <p className="my-4 text-gray-800">
            {!emailSent
              ? "Please look out for our email with instructions."
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={handleOnSubmit}>
            {!emailSent && (
              <label className="w-full">
                <p className="block text-sm font-medium leading-6 text-gray-900">
                  Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900
                   shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                   focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </label>
            )}
            <button
              type="submit"
              className="flex mt-6 w-full justify-center rounded-md bg-indigo-600 px-3 
              py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
               hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
               focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
          {loading ? (
              <div className="flex items-center justify-center">
                <Spinner />
              </div>
            ) : 
              <>{!emailSent ? "Submit" : "Resend Email"}</>
            }
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

export default ForgotPassword