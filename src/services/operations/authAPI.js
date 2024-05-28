import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
  } = endpoints

  export function sendOtp(email, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Sending OTP")
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", SENDOTP_API, {
          email,
          checkUserPresent: true,
        })
         
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
  
        toast.success("OTP Sent Successfully")
        navigate("/verify-email")
      } catch (error) {
        toast.error("Could Not Send OTP")
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }

  export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    // country,
    password,
    confirmPassword,
    otp,
    navigate
  ) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", SIGNUP_API, {
          accountType,
          firstName,
          lastName,
          email,
          // country,
          password,
          confirmPassword,
          otp,
        })
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Signup Successful")
        navigate("/login")
      } catch (error) {
        toast.error("Signup Failed")
        navigate("/signup")
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
  
  export const login = async (email, password, dispatch) => {
    let success = false;
    let accountType;
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });
    
      if(response.data.suspended){
        toast.success("Your account is suspended by admin")
        return
      }
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Logged in");
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
      localStorage.setItem("token", JSON.stringify(response.data.token));
      accountType = response.data.user.accountType;
      success = true
       
    } catch (error) {
      success = false
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    return { accountType, success }; 
  };


  export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }
  
  export function getPasswordResetToken(email, setEmailSent) {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", RESETPASSTOKEN_API, {
          email,
        })
        if (!response.data.success) {
          throw new Error(response.data.message)
        }

        toast.success("Reset Email Sent")
        setEmailSent(true)
      } catch (error) {
        toast.error("Failed To Send Reset Email")
      }
      dispatch(setLoading(false))
    }
  }

  export function resetPassword(password, confirmPassword, token, navigate) {
    return async (dispatch) => {
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", RESETPASSWORD_API, {
          password,
          confirmPassword,
          token,
        })
        if (!response.data.success) {
          throw new Error(response.data.message)
        }

        toast.success("Password Reset Successfully")
        navigate("/login")
      } catch (error) {
        toast.error("Failed To Reset Password")
      }
      dispatch(setLoading(false))
    }
  }
