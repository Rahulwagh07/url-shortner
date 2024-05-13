import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import reportReducer from "../slices/reportSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  report: reportReducer,
})

export default rootReducer;