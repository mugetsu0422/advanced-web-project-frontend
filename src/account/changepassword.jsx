import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Card, Alert } from 'react-bootstrap'
import styles from './profile.module.css'
import Cookies from 'js-cookie'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from '../constants/constants'

function SuccessfulAlert({ showAlert, setShowAlert }) {
  if (showAlert == 201) {
    return (
      <Alert variant="success" onClose={() => setShowAlert('')} dismissible>
        <strong>Change password successfully</strong>
      </Alert>
    )
  } else if (showAlert == 400) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert('')} dismissible>
        <strong>Old password is incorrect</strong>
      </Alert>
    )
  }
  return null
}

const ChangePassword = () => {
  const [showAlert, setShowAlert] = useState(0)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)

    if (!oldPassword.trim()) return
    if (!newPassword.trim()) return

    const token = Cookies.get('authToken')
    const decodedToken = jwtDecode(token)
    try {
      const response = await axios.post(
        `//${import.meta.env.VITE_SERVER_HOST}:${
          import.meta.env.VITE_SERVER_PORT
        }/users/change-password`,
        {
          userId: decodedToken.sub,
          oldPassword: oldPassword,
          newPassword: bcrypt.hashSync(newPassword, SALT_ROUNDS),
        }
      )

      setShowAlert(201)
      setOldPassword('')
      setNewPassword('')
      setSubmitted(false)
    } catch {
      setShowAlert(400)
      setSubmitted(false)
    }
  }

  return (
    <div className={styles.profile}>
      <div className={`row`}>
        <div className="col-sm-3">
          <Card>
            <ul className="list-group list-group-flush">
              <Link to="/profile" className={`${styles['profile-item']}`}>
                Profile
              </Link>
              <Link
                to="/profile/changePassword"
                className={`${styles['profile-item']} ${styles['active-menu']}`}>
                Change password
              </Link>
            </ul>
          </Card>
        </div>
        <div className={`col-sm-9 pb-4 ${styles['col-sm-9']}`}>
          <p className={`title text-center ${styles.title}`}>Change Password</p>
          <div className={styles['alert-container']}>
            <SuccessfulAlert
              showAlert={showAlert}
              setShowAlert={setShowAlert}
            />
          </div>
          <form
            className={`profile-form ${styles['profile-form']}`}
            onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label htmlFor="oldPassword">Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={`${styles['form-control']} ${
                      submitted && !oldPassword.trim() ? styles['invalid'] : ''
                    }`}
                    isInvalid={submitted && !oldPassword.trim()}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label htmlFor="newPassword">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${styles['form-control']} ${
                      submitted && !newPassword.trim() ? styles['invalid'] : ''
                    }`}
                    isInvalid={submitted && !newPassword.trim()}
                  />
                </Form.Group>
              </div>
            </div>
            <button type="submit" className={styles['submit-btn']}>
              SAVE
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
