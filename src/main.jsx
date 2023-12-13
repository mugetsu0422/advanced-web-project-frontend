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
import EmailActivation from './account/EmailActivation.jsx'
import RequestResetPassword from './account/RequestResetPassword.jsx'
import SetNewPassword from './account/SetNewPassword.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import SigninRoute from './auth/SigninRoute.jsx'
import StudentHome from './student/StudentHome.jsx'
import TeacherHome from './teacher/TeacherHome.jsx'
import AdminHome from './admin/AdminHome.jsx'
import UpdateRoleAfterSocialLogin from './account/UpdateRoleAfterSocialLogin.jsx'
import ClassDetail from './teacher/ClassDetail.jsx'
import ClassNavBar from './teacher/ClassNavBar.jsx'
import ClassPeople from './teacher/ClassPeople.jsx'
import TeacherGradeManagement from './teacher/TeacherGradeManagement.jsx'

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
        path: 'update-role-after-social-login',
        element: <UpdateRoleAfterSocialLogin />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'detail',
            element: <Profile />,
          },
          {
            path: 'changepassword',
            element: <ChangePassword />,
          },
          {
            path: 'emailActivation',
            element: <EmailActivation />,
          },
        ],
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
        path: '/:classID/grade-management/',
        element: <TeacherGradeManagement />,
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
        path: '/teacher/class/:id',
        element: <ClassNavBar />,
        children: [
          {
            path: '',
            element: <ClassDetail />,
          },
          {
            path: 'people',
            element: <ClassPeople />,
          },
        ],
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
