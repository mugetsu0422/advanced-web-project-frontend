import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import { ROLES } from '../constants/constants'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRole }) => {
  if (!Cookies.get('authToken')) {
    return <Navigate to={`/signin`} />
  }
  // For all roles
  if (!requiredRole) {
    return children
  }

  const userRole = localStorage.getItem('role')
  if (!userRole || ROLES[userRole] != requiredRole) {
    throw new Response('Forbidden', { status: 403, statusText: 'Forbidden' })
  }

  return children
}

export default ProtectedRoute

ProtectedRoute.propTypes = {
  children: PropTypes.object.isRequired,
  requiredRole: PropTypes.string,
}
