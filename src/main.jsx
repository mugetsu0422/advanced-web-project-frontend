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
import AdminNavBar from './admin/AdminNavBar.jsx'
import UpdateRoleAfterSocialLogin from './account/UpdateRoleAfterSocialLogin.jsx'
import TeacherClassDetail from './teacher/TeacherClassDetail.jsx'
import TeacherClassNavBar from './teacher/TeacherClassNavBar.jsx'
import TeacherClassPeople from './teacher/TeacherClassPeople.jsx'
import TeacherGradeStructure from './teacher/TeacherGradeStructure.jsx'
import TeacherGradeManagement from './teacher/TeacherGradeManagement.jsx'
import TeacherGradeReview from './teacher/TeacherGradeReview.jsx'
import TeacherGradeReviewDetail from './teacher/TeacherGradeReviewDetail.jsx'
import StudentClassNavBar from './student/StudentClassNavBar.jsx'
import StudentClassDetail from './student/StudentClassDetail.jsx'
import StudentClassPeople from './student/StudentClassPeople.jsx'
import StudentClassScoreboard from './student/StudentClassScoreboard.jsx'
import StudentMapStudentID from './student/StudentMapStudentID.jsx'
import StudentGradeStructure from './student/StudentGradeStructure.jsx'
import StudentGradeReviewDetail from './student/StudentGradeReviewDetail.jsx'
import JoinClassByLink from './student/JoinClassByLink.jsx'
import ManageTeacherAccounts from './admin/ManageTeacherAccounts.jsx'
import ManageClasses from './admin/ManageClasses.jsx'
import ManageStudentAccounts from './admin/ManageStudentAccounts.jsx'

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
            path: 'change-password',
            element: <ChangePassword />,
          },
          {
            path: 'email-activation',
            element: <EmailActivation />,
          },
          {
            path: 'map-studentid',
            element: (
              <ProtectedRoute requiredRole={'student'}>
                <StudentMapStudentID />
              </ProtectedRoute>
            ),
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
        path: '/student',
        element: (
          <ProtectedRoute requiredRole={'student'}>
            <StudentHome />
          </ProtectedRoute>
        ),
      },
      {
        path: 'student/join-class/:id',
        element: (
          <ProtectedRoute requiredRole={'student'}>
            <JoinClassByLink />
          </ProtectedRoute>
        ),
      },
      {
        path: '/student/class/:id',
        element: (
          <ProtectedRoute requiredRole={'student'}>
            <StudentClassNavBar />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '',
            element: <StudentClassDetail />,
          },
          {
            path: 'grade-structure',
            element: <StudentGradeStructure />,
          },
          {
            path: 'scoreboard',
            element: <StudentClassScoreboard />,
          },
          {
            path: 'people',
            element: <StudentClassPeople />,
          },
          {
            path: 'scoreboard/grade-review/detail',
            element: <StudentGradeReviewDetail />,
          },
        ],
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
        element: (
          <ProtectedRoute requiredRole={'teacher'}>
            <TeacherClassNavBar />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '',
            element: <TeacherClassDetail />,
          },
          {
            path: 'grade-structure/',
            element: <TeacherGradeStructure />,
          },
          {
            path: 'grade-management/',
            element: <TeacherGradeManagement />,
          },
          {
            path: 'people',
            element: <TeacherClassPeople />,
          },
          {
            path: 'grade-review',
            element: <TeacherGradeReview />,
          },
          {
            path: 'grade-review/detail',
            element: <TeacherGradeReviewDetail />,
          },
        ],
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole={'admin'}>
            <AdminNavBar />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '',
            element: <ManageTeacherAccounts />,
          },
          {
            path: 'student-account-management',
            element: <ManageStudentAccounts />,
          },
          {
            path: 'class-management',
            element: <ManageClasses />,
          },
        ]
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
