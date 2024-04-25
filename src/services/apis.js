const BASE_URL = import.meta.env.VITE_BASE_URL || "https://urls-backend.onrender.com/api"

//Auth endpoints
export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
  }

  //Profile endpoints
export const profileEndpoints = {
GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
}

//Guest Endpoints
export const guestEndPoints = {
    CREATE_TEMP_SHORT_URL_API: BASE_URL + "/guest/tempShortUrl",
    GET_TEMP_SHORT_URL_API: BASE_URL + "/guest",
}
//URL specific endpoints for auth user
export const urlEndPoints = {
  CREATE_SHORT_URL_API: BASE_URL + "/auth/create-shortened-url"
}

//Global Variables Endpoints
export const globalVariablesEndpoints = {
  GET_GLOBAL_VARIABLE_API: BASE_URL + "/admin/get-global-variables",
  UPDATE_GLOBAL_VARIABLE_API: BASE_URL + "/admin/update-global-variables",
  DELETE_BLOCKED_DOMAINS_API: BASE_URL + "/admin/delete-blocked-domains",
  DELETE_BLOCKED_WORDS_API: BASE_URL + "/admin/delete-blocked-words",
  ADD_BLOCKED_DOMAINS_WORDS_API: BASE_URL + "/admin/add-new-domains-words"
}

//Panel options endpoints
export const panelOptionsEndpoints = {
  GET_PANEL_OPTIONS_API: BASE_URL + "/admin/get-panel-options",
  ADD_PANEL_OPTIONS_API: BASE_URL + "/admin/add-panel-options",
  DELETE_PANEL_OPTIONS_API: BASE_URL + "/admin/delete-panel-options",
}
