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
import GlobalVariables from "./components/Dashbord/GlobalVariables"
import UserManagement from "./components/Dashbord/UserManagement"
import Reports from "./components/Dashbord/Reports"
import URLManagement from "./components/Dashbord/URLManagement"
import PanelOptions from "./components/Dashbord/PanelOptions"
import Settings from "./components/Dashbord/Settings/Settings"
import ManageUrl from "./components/Dashbord/User/ManageUrl"
import Category from "./pages/Category"
import Demo from "./pages/Demo"
 
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
        path: "/:shortUrl",
        element: <ShortUrlRedirect/>,
      },
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
            element: <UserManagement/>,
          },
          {
            path: "/admin/dashboard/reports",
            element: <Reports/>,
          },
          {
            path: "/admin/dashboard/urls",
            element: <URLManagement/>,
          },
          {
            path: "/admin/dashboard/panel-options",
            element: <PanelOptions/>,
          },
          {
            path: "/admin/dashboard/category",
            element: <Category/>,
          },
          {
            path: "/admin/dashboard/settings",
            element: <Settings/>,
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
        ]
      },
    ]
  },
  {
    path: "/demo",
    element: <Demo/>,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster/>
      <RouterProvider router={router}>
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
