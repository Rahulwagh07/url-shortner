import { BACKEND_URL } from "../utils/helper"

const BASE_URL =  BACKEND_URL

//Auth endpoints
export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  }

  //Profile endpoints
export const profileEndpoints = {
GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
}

//Guest Endpoints
export const guestEndPoints = {
    CREATE_TEMP_SHORT_URL_API: BASE_URL + "/guest/tempShortUrl",
    GET_TEMP_SHORT_URL_API: BASE_URL + "/guest",
    TRACK_VISITOR_DATA_API: BASE_URL + "/guest/visit",
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

export const manageUrlEndpoints = {
  GET_ALL_URLS_API: BASE_URL + "/urls",
  SUSPEND_URL_API: BASE_URL + "/suspend",
  DELETE_URL_API: BASE_URL + "/delete",
  DELETE_BULK_URLS_API: BASE_URL + "/bulk-delete",
  ACTIVATE_URL_API: BASE_URL + "/activate",
  EDIT_URL_API: BASE_URL + "/edit",
}

export const categoryEndpoints = {
  CREATE_CATEGORY_API: BASE_URL + "/admin/createCategory"
}

export const reportsEndpoints = {
  GENERATE_REPORT_API: BASE_URL + "/auth/generate-report"
}
