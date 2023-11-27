import { ROLES } from '../constants/constants'

const ProtectedRoute = ({ children, requiredRole }) => {
  const userRole = localStorage.getItem('role')
  if (!userRole || ROLES[userRole] != requiredRole) {
    console.log(ROLES[userRole], requiredRole)

    throw new Response('Forbidden', { status: 403, statusText: 'Forbidden' })
  }

  return children
}

export default ProtectedRoute
