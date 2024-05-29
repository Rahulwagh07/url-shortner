// This will prevent non-authenticated users from accessing this route

import { useSelector } from "react-redux"
import { Navigate, useLocation} from "react-router-dom"
import { ACCOUNT_TYPE } from "../../utils/constants";

function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth)
  const {user} = useSelector((state) => state.profile)
  const location = useLocation()
  const isAdmin = user && user.accountType === ACCOUNT_TYPE.ADMIN
  const isUser = user && user.accountType === ACCOUNT_TYPE.USER

  const isAdminRoute = location.pathname.includes("/admin") 

  if (token  && isAdmin && isAdminRoute) {
    return children;
  }else if(token && isUser && !isAdminRoute){
    return children;
  }else {
    return <Navigate to="/" />;
  }
  // if (token !== null) {
  //   return children
  // } else {
  //   return <Navigate to="/login" />
  // }
}

export default PrivateRoute