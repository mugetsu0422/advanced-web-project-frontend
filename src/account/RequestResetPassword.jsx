import styles from './ResetPassword.module.css'
import Alert from 'react-bootstrap/Alert'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form as BootstrapForm } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import axios from 'axios'

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
            <p className="mx-3">
              We need your email which linked to your account to recover your
              account.
            </p>
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
  const [showAlert, setShowAlert] = useState('')
  const [inputs, setInputs] = useState({})
  const [validated, setValidated] = useState(false)

  const showAlertFunction = (message, type = 'info', dismissible = true) => {
    setShowAlert({ message, type })
    if (dismissible) {
      setTimeout(() => {
        setShowAlert('')
      }, 5000)
    }
  }

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
      showAlertFunction('Email Is Not in Email Format', 'danger')
      return
    }

    axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}/users/request-reset-password`,
        {
          email: inputs.email,
        }
      )
      .then((response) => {
        if (response.data.success == true)
        showAlertFunction(response.data.message, 'success')
        else
        showAlertFunction(response.data.message, 'danger')
      })
      .catch((error) => {
        showAlertFunction(error.message, 'danger')
      })
  }

  return (
    <Container fluid className={`${styles['container-fluid']}`}>
        {showAlert && (
          <Alert
            variant={showAlert.type}
            className={styles['alert']}
            dismissible>
            {showAlert.message}
          </Alert>
        )}
      <ResetPasswordForm
        handleChange={handleInputChange}
        handleSubmit={handleFormSubmit}
        validated={validated}
        inputs={inputs}
      />
    </Container>
  )
}

export default RequestResetPassword
