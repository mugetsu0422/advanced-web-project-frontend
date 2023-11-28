import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './error-page'
import Signup from './account/Signup.jsx'
import Signin from './account/Signin.jsx'
import Profile from './account/Profile.jsx'
import ChangePassword from './account/ChangePassword.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import SigninRoute from './auth/SigninRoute.jsx'
import StudentHome from './student/StudentHome.jsx'
import TeacherHome from './teacher/TeacherHome.jsx'
import AdminHome from './admin/AdminHome.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'signin',
        element: <Signin />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'profile/changePassword',
        element: <ChangePassword />,
      },
      {
        path: '',
        element: <SigninRoute />,
      },
      {
        path: '/student',
        element: (
          <ProtectedRoute requiredRole={'student'}>
            <StudentHome />
          </ProtectedRoute>
        ),
      },
      {
        path: '/teacher',
        element: (
          <ProtectedRoute requiredRole={'teacher'}>
            <TeacherHome />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole={'admin'}>
            <AdminHome />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
