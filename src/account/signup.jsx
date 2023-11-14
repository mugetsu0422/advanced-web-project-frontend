import styles from './signup.module.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Form as BootstrapForm } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from '../constants/constants'

function SuccessfulAlert({ showAlert, setShowAlert }) {
  if (showAlert == 201) {
    return (
      <Alert variant="success" onClose={() => setShowAlert('')} dismissible>
        <strong>Your account has been successfully created</strong>
      </Alert>
    )
  } else if (showAlert == 400) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert('')} dismissible>
        <strong>Your username has been existed!</strong>
      </Alert>
    )
  }
  return null
}

function SignupForm({ handleChange, handleSubmit, validated, inputs }) {
  return (
    <>
      <BootstrapForm
        id="register-form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}>
        <div className={styles['form-div']}>
          <BootstrapForm.Group
            controlId="username"
            className={styles['my-input-group']}>
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className={styles['my-input']}
              required
              type="text"
              name="username"
              placeholder="Username"
              defaultValue={inputs.username || ''}
              onChange={handleChange}
            />
          </BootstrapForm.Group>
          <BootstrapForm.Group
            controlId="password"
            className={styles['my-input-group']}>
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className={styles['my-input']}
              required
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="on"
              defaultValue={inputs.password || ''}
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
              pattern={inputs.password}
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              autoComplete="on"
              defaultValue={inputs.confirmPassword || ''}
              onChange={handleChange}
              isInvalid={inputs.confirmPassword != inputs.password}
            />
            <BootstrapForm.Control.Feedback type="invalid" className={styles['invalid-feedback']}>
              Confirm password does not match!
            </BootstrapForm.Control.Feedback>
          </BootstrapForm.Group>
          <button
            className={styles['register-btn']}
            type="submit"
            form="register-form">
            SIGN UP
          </button>
          <div className={styles['info-div']}>
            <p>
              Already have an account?{' '}
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

function Signup() {
  const [showAlert, setShowAlert] = useState(0)
  const [inputs, setInputs] = useState({})
  const [validated, setValidated] = useState(false)

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setValidated(true)
    const form = event.currentTarget
    if (
      form.checkValidity() === false ||
      inputs.confirmPassword != inputs.password
    ) {
      return
    }

    // Send HTTP Request
    axios
      .post(
        `//${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}/users`,
        {
          username: inputs.username,
          password: bcrypt.hashSync(inputs.password, SALT_ROUNDS),
        }
      )
      .then(() => {
        // If successful
        setShowAlert(201)
      })
      .catch(() => {
        // If not successful (duplicate username)
        setShowAlert(400)
      })
  }

  return (
    <>
      <Container fluid className={`${styles['container-fluid']}`}>
        <SuccessfulAlert
          showAlert={showAlert}
          setShowAlert={setShowAlert}></SuccessfulAlert>
        <SignupForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          validated={validated}
          inputs={inputs}></SignupForm>
      </Container>
    </>
  )
}

export default Signup

SuccessfulAlert.propTypes = {
  showAlert: PropTypes.number.isRequired,
  setShowAlert: PropTypes.func.isRequired,
}

SignupForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validated: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
}
