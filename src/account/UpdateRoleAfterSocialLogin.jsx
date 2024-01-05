import React, { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChalkboardUser,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons'
import styles from './UpdateRoleAfterSocialLogin.module.css'
import Container from 'react-bootstrap/Container'
import Cookies from 'js-cookie'
import Alert from 'react-bootstrap/Alert'
import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'

function SuccessfulAlert({ showAlert, setShowAlert }) {
  if (showAlert == 201) {
    return (
      <Alert variant="success" onClose={() => setShowAlert(0)} dismissible>
        <strong>There was an error updating the role</strong>
      </Alert>
    )
  }
  return null
}

function UpdateRoleAfterSocialLogin() {
  const [role, setRole] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  var queryString = window.location.search
  queryString = queryString.substring(1)
  var queryParams = {}
  queryString.split('&').forEach(function (param) {
    var keyValue = param.split('=')
    queryParams[keyValue[0]] = decodeURIComponent(keyValue[1])
  })

  function roleClick(selectedRole) {
    if (isInvalid) {
      setIsInvalid(false)
    }
    setRole(selectedRole)
  }

  async function handleContinue() {
    if (!role) {
      setIsInvalid(true)
      return
    }

    const token = Cookies.get('authToken')
    axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}/users/update-role-social-login`,
        {
          socialToken: queryParams.socialToken,
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // If successful
        Cookies.set('authToken', response.data.access_token, { expires: 1 })
        const decodedToken = jwtDecode(response.data.access_token)
        localStorage.setItem('role', decodedToken.role)
        window.location.href = '/'
      })
      .catch((error) => {})
  }

  return (
    <Container fluid className={`${styles['container-fluid']}`}>
      <div className={styles['form-div']}>
        <div className={styles['title']}>Select your role</div>
        <div className={styles['role-description']}>
          {role === 'teacher'
            ? 'Guide classes, post assignments, and monitor student progress in a virtual classroom.'
            : ''}
          {role === 'student'
            ? 'Access materials, submit assignments, and collaborate with classmates for an interactive learning experience.'
            : ''}
        </div>
        <div className={`${styles['role-description']} text-danger`}>
          {isInvalid ? 'Please select your role to continue' : ''}
        </div>
        <div className={styles['role-icon-group']}>
          <div
            id="teacher"
            className={`${styles['role-card']} ${
              role === 'teacher' ? styles['role-card-chosen'] : ''
            }`}
            onClick={() => roleClick('teacher')}>
            <FontAwesomeIcon
              className={styles['role-icon']}
              icon={faChalkboardUser}
            />
            Teacher
          </div>
          <div
            id="student"
            className={`${styles['role-card']} ${
              role === 'student' ? styles['role-card-chosen'] : ''
            }`}
            onClick={() => roleClick('student')}>
            <FontAwesomeIcon
              className={styles['role-icon']}
              icon={faGraduationCap}
            />
            Student
          </div>
        </div>
        <button
          className={styles['register-btn']}
          type="button"
          onClick={handleContinue}>
          SAVE
        </button>
      </div>
    </Container>
  )
}

export default UpdateRoleAfterSocialLogin

SuccessfulAlert.propTypes = {
  showAlert: PropTypes.number.isRequired,
  setShowAlert: PropTypes.func.isRequired,
}
