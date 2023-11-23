import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Alert, Card } from 'react-bootstrap'
import styles from './Profile.module.css'
import Cookies from 'js-cookie'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

function SuccessfulAlert({ showAlert, setShowAlert }) {
  if (showAlert == 201) {
    return (
      <Alert variant="success" onClose={() => setShowAlert('')} dismissible>
        <strong>Edit profile successfully</strong>
      </Alert>
    )
  } else if (showAlert == 400) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert('')} dismissible>
        <strong>Username has been existed</strong>
      </Alert>
    )
  }
  return null
}

const Profile = ({ username, email, msg }) => {
  const [showAlert, setShowAlert] = useState(0)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const token = Cookies.get('authToken')
    const decodedToken = jwtDecode(token)

    if (token) {
      axios
        .get(
          `${import.meta.env.VITE_SERVER_HOST}/users/${decodedToken.sub}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          const userData = response.data
          setFormData(userData)
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)

    const { username, email, phone, address } = formData

    if (!username.trim()) return

    const token = Cookies.get('authToken')
    const decodedToken = jwtDecode(token)

    if (token) {
      axios
        .put(
          `${import.meta.env.VITE_SERVER_HOST}/users/${decodedToken.sub}`,
          {
            username: username,
            email: email,
            phone: phone,
            address: address,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setShowAlert(201)
          setSubmitted(false)
        })
        .catch(() => {
          setShowAlert(400)
          setSubmitted(false)
        })
    }
  }

  return (
    <div className={styles.profile}>
      <div className={`row`}>
        <div className="col-sm-3">
          <Card>
            <ul className="list-group list-group-flush">
              <Link
                to="/profile"
                className={`${styles['profile-item']} ${styles['active-menu']}`}>
                Profile
              </Link>
              <Link to="changePassword" className={`${styles['profile-item']}`}>
                Change password
              </Link>
            </ul>
          </Card>
        </div>
        <div className={`col-sm-9 pb-4 ${styles['col-sm-9']}`}>
          <p className={`title text-center ${styles.title}`}>Profile</p>
          <div className={styles['alert-container']}>
            <SuccessfulAlert
              showAlert={showAlert}
              setShowAlert={setShowAlert}
            />
          </div>
          <form
            className={`profile-form ${styles['profile-form']}`}
            onSubmit={handleSubmit}>
            {msg && (
              <Alert
                variant="success"
                className={`text-center pr-0 ${styles.alert}`}
                dismissible>
                {msg}
              </Alert>
            )}
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtName">Username</Form.Label>
                  <Form.Control
                    type="text"
                    id="txtName"
                    placeholder={username}
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className={`${styles['form-control']} ${submitted && !formData.username.trim()
                        ? styles['invalid']
                        : ''
                      }`}
                    isInvalid={submitted && !formData.username.trim()}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtEmail">Email</Form.Label>
                  <Form.Control
                    type="email"
                    id="txtEmail"
                    placeholder={email}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={styles['form-control']}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtPhone">Telephone</Form.Label>
                  <Form.Control
                    type="text"
                    id="txtPhone"
                    value={formData.phone}
                    onChange={(e) => {
                      const input = e.target.value.replace(/\D/g, '')
                      setFormData({ ...formData, phone: input })
                    }}
                    className={styles['form-control']}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtAddress">Address</Form.Label>
                  <Form.Control
                    type="text"
                    id="txtAddress"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className={styles['form-control']}
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

export default Profile
