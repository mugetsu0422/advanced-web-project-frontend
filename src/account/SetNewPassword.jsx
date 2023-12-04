import styles from './ResetPassword.module.css'
import Alert from 'react-bootstrap/Alert'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Form as BootstrapForm } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import axios from 'axios'

function SuccessfulAlert({ showAlert, setShowAlert }) {
  if (showAlert === 200) {
    return (
      <Alert variant="success" onClose={() => setShowAlert(0)} dismissible>
        <strong>Change password successfully</strong>
      </Alert>
    )
  } else if (showAlert === 400) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(0)} dismissible>
        <strong>Internal server error</strong>
      </Alert>
    )
  }
  return null
}

function SetNewPasswordForm({ handleChange, handleSubmit, validated, inputs }) {
  return (
    <>
      <BootstrapForm
        id="set-new-password-form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}>
        <div className={styles['form-div']}>
          <div className={styles['header-text']}>
            <h1>Set New Password</h1>
            <p>Enter your new password</p>
          </div>
          <BootstrapForm.Group
            controlId="newPassword"
            className={styles['my-input-group']}>
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className={styles['my-input']}
              required
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={inputs.newPassword || ''}
              onChange={handleChange}
            />
          </BootstrapForm.Group>
          <BootstrapForm.Group
            controlId="confirmPassword"
            className={styles['my-input-group']}>
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className={styles['my-input']}
              required
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={inputs.confirmPassword || ''}
              onChange={handleChange}
              isInvalid={inputs.confirmPassword !== inputs.newPassword}
            />
            <BootstrapForm.Control.Feedback
              type="invalid"
              className={styles['invalid-feedback']}>
              Passwords do not match.
            </BootstrapForm.Control.Feedback>
          </BootstrapForm.Group>
          <button
            className={styles['reset-password-btn']}
            type="submit"
            form="set-new-password-form">
            SAVE
          </button>
          <div className={styles['info-div']}>
            <p>
              Go back to{' '}
              <Link style={{ textDecoration: 'none' }} to={'/signin'}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </BootstrapForm>
    </>
  )
}

function SetNewPassword() {
  const [showAlert, setShowAlert] = useState(0)
  const [inputs, setInputs] = useState({})
  const [validated, setValidated] = useState(false)

  function handleInputChange(event) {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  function handleFormSubmit(event) {
    event.preventDefault()
    setValidated(true)
    const form = event.currentTarget
    if (
      form.checkValidity() === false ||
      inputs.newPassword !== inputs.confirmPassword
    ) {
      return
    }

    const currentUrl = window.location.href
    const urlParts = currentUrl.split('/')
    const token = urlParts[urlParts.length - 1]

    axios
      .post(`${import.meta.env.VITE_SERVER_HOST}/users/set-new-password`, {
        token: token,
        newPassword: inputs.newPassword,
      })
      .then(() => {
        setShowAlert(200)
      })
      .catch((error) => {
        setShowAlert(400)
        console.error('Error from server:', error)
      })
  }

  return (
    <Container fluid className={`${styles['container-fluid']}`}>
      <SuccessfulAlert showAlert={showAlert} setShowAlert={setShowAlert} />
      <SetNewPasswordForm
        handleChange={handleInputChange}
        handleSubmit={handleFormSubmit}
        validated={validated}
        inputs={inputs}
      />
    </Container>
  )
}

export default SetNewPassword

SuccessfulAlert.propTypes = {
  showAlert: PropTypes.number.isRequired,
  setShowAlert: PropTypes.func.isRequired,
}

SetNewPasswordForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validated: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
}
