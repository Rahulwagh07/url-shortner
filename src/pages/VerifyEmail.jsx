import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!signupData) {
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      country,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        country,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">
      {loading ? (
        <div>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
           Verify Email
        </h2>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-black">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(146, 143, 122, 0.18) form-style",
                  }}
                  className="w-[48px] sm:w-[35px] lg:w-[60px] border-[1px] border-blue-150 rounded-[0.5rem] text-black aspect-square text-center focus:border-0 focus:outline-2 focus:outline-blue-150"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="flex mt-8 w-full justify-center rounded-md bg-indigo-600 px-3 
              py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
               hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
               focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verify Email
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/signup">
              <p className="text-black flex items-center gap-x-2">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            <button
              className="flex items-center text-blue-150 gap-x-2"
              onClick={() => dispatch(sendOtp(signupData.email))}
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;