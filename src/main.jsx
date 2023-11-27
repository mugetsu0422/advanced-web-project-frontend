import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './error-page'
import Signup from './account/Signup.jsx'
import Signin from './account/Signin.jsx'
import ProfilePage from './account/ProfilePage.jsx'
import Profile from './account/Profile.jsx'
import ChangePassword from './account/ChangePassword.jsx'
import RequestResetPassword from './account/RequestResetPassword.jsx'
import SetNewPassword from './account/SetNewPassword.jsx'
import HomePage from './common/HomePage.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import SigninRoute from './auth/SigninRoute.jsx'

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
        element: <ProfilePage />,
        children: [
          {
            path: 'detail',
            element: <Profile />,
          },
          {
            path: 'changepassword',
            element: <ChangePassword />,
          },
        ]
      },
      {
        path: 'forget-password',
        element: <RequestResetPassword />,
      },
      {
        path: 'forget-password/:token',
        element: <SetNewPassword />,
      },
      {
        path: '',
        element: <SigninRoute />,
      },
      {
        path: '/student',
        element: (
          <ProtectedRoute requiredRole={'student'}>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/teacher',
        element: (
          <ProtectedRoute requiredRole={'teacher'}>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole={'admin'}>
            <HomePage />
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
