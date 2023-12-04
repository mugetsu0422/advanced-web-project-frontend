import Cookies from 'js-cookie'
import LandingPage from '../common/LandingPage'
import { Navigate } from 'react-router-dom'

const SigninRoute = () => {
  const userRole = localStorage.getItem('role')
  if (Cookies.get('authToken')) {
    return <Navigate to={`/${userRole}`} />
  } else {
    return <LandingPage />
  }
}

export default SigninRoute
