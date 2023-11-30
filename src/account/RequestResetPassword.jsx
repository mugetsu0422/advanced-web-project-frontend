import styles from './ResetPassword.module.css'
import Alert from 'react-bootstrap/Alert'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form as BootstrapForm } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import axios from 'axios'

function SuccessfulAlert({ showAlert, setShowAlert }) {
  if (showAlert == 200) {
    return (
      <Alert variant="success" onClose={() => setShowAlert(0)} dismissible>
        <strong>Request Success. Please check your email</strong>
      </Alert>
    )
  } else if (showAlert == 400) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(0)} dismissible>
        <strong>Email Is Not in Email Format</strong>
      </Alert>
    )
  } else if (showAlert == 404) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(0)} dismissible>
        <strong>Server Can't Find Email</strong>
      </Alert>
    )
  }
  return null
}

function ResetPasswordForm({ handleChange, handleSubmit, validated, inputs }) {
  return (
    <>
      <BootstrapForm
        id="reset-password-form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}>
        <div className={styles['form-div']}>
          <div className={styles['header-text']}>
            <h1>Reset Password</h1>
            <p className='mx-3'>We need your email which linked to your account to recover your account.</p>
          </div>
          <BootstrapForm.Group
            controlId="email"
            className={styles['my-input-group']}>
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className={styles['my-input']}
              required
              type="email"
              name="email"
              placeholder="Email"
              defaultValue={inputs.email || ''}
              onChange={handleChange}
            />
          </BootstrapForm.Group>
          <button
            className={styles['reset-password-btn']}
            type="submit"
            form="reset-password-form">
            RESET PASSWORD
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

function RequestResetPassword() {
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
    if (form.checkValidity() === false) {
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(inputs.email)) {
      setShowAlert(400)
      return
    }

    axios
      .post(`${import.meta.env.VITE_SERVER_HOST}/users/request-reset-password`, {
        email: inputs.email,
      })
      .then(() => {
        setShowAlert(200)
      })
      .catch((error) => {
        setShowAlert(404)
        console.error('Error from server:', error)
      })
  }

  return (
    <Container fluid className={`${styles['container-fluid']}`}>
      <SuccessfulAlert
        showAlert={showAlert}
        setShowAlert={setShowAlert}>
      </SuccessfulAlert>
      <ResetPasswordForm
        handleChange={handleInputChange}
        handleSubmit={handleFormSubmit}
        validated={validated}
        inputs={inputs}
      />
    </Container>
  )
}

export default RequestResetPassword;

