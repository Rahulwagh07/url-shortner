import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider, Routes, Route } from "react-router-dom"
import { Provider} from 'react-redux'
import App from "./App"
import { configureStore } from "@reduxjs/toolkit"
import { Toaster } from 'react-hot-toast'
import rootReducer from "./reducer"
import './index.css'

//Pages
import Home from "./pages/Home"
import ErrorPage from "./pages/Error"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import VerifyEmail from "./pages/VerifyEmail"
import Dashboard from "./pages/Dashboard"
 

//Components
import OpenRoute from "./components/auth/OpenRoute"
import PrivateRoute from "./components/auth/PrivateRoute"
import ShortUrlRedirect from "./components/HomePage/ShortenUrlRedirect"
import GlobalVariables from "./components/Dashbord/Admin/GlobalVariables.jsx"
import PanelOptions from "./components/Dashbord/Admin/PanelOptions.jsx"
import Settings from "./components/Dashbord/Settings/Settings"
import ManageUrl from "./components/Dashbord/User/ManageUrl/index.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx"
import UpdatePassword from "./pages/UpdatePassword.jsx"
import ManageUsers from "./components/Dashbord/Admin/ManageUsers.jsx"
import Analytics from "./components/Dashbord/User/Analytics/index.jsx"
import AnalyticsAdmin from "./components/Dashbord/Admin/Analytics/index.jsx"
 
const store = configureStore({
  reducer: rootReducer,
}); 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/login",
        element: <OpenRoute><Login/></OpenRoute>,
      },
      {
        path: "/signup",
        element: <OpenRoute><Signup/></OpenRoute>,
      },
      {
        path: "/verify-email",
        element: <OpenRoute><VerifyEmail/></OpenRoute>,
      },
      {
        path: "/forgot-password",
        element: <OpenRoute><ForgotPassword/></OpenRoute>,
      },
      {
        path: "/update-password/:id",
        element: <OpenRoute><UpdatePassword/></OpenRoute>,
      },
      {
        path: "/admin/dashboard",
        element: <Dashboard/>,
        errorElement: <ErrorPage/>,
        children: [
          {
            path: "/admin/dashboard/global-variables",
            element: <GlobalVariables/>,
          },
          {
            path: "/admin/dashboard/users",
            element: <ManageUsers/>,
          },
          {
            path: "/admin/dashboard/urls",
            element: <ManageUrl/>,
          },
          {
            path: "/admin/dashboard/panel-options",
            element: <PanelOptions/>,
          },
          {
            path: "/admin/dashboard/settings",
            element: <Settings/>,
          },
          {
            path: "/admin/dashboard/analytics",
            element: <AnalyticsAdmin/>,
          },
        ]
      },
      {
        path: "/dashboard",
        element: <Dashboard/>,
        errorElement: <ErrorPage/>,
        children: [
          {
            path: "/dashboard/manage-urls",
            element: <ManageUrl/>,
          },
          {
            path: "/dashboard/settings",
            element: <Settings/>,
          },
          {
            path: "/dashboard/analytics",
            element: <Analytics/>,
          },
        ]
      },
    ]
  },
  {
    path: "/:shortUrl",
    element: <ShortUrlRedirect/>,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}>
      <Toaster/>
      <RouterProvider router={router}>
      </RouterProvider>
    </Provider>
  // {/* </React.StrictMode> */}
);
