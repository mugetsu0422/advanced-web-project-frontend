import styles from './Signin.module.css'
import Alert from 'react-bootstrap/Alert'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Form as BootstrapForm } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import axios from 'axios'
import Cookies from 'js-cookie'

function SuccessfulAlert({ showAlert, setShowAlert }) {
  if (showAlert == 201) {
    return (
      <Alert variant="success" onClose={() => setShowAlert(0)} dismissible>
        <strong>Your account has been successfully login</strong>
      </Alert>
    )
  } else if (showAlert == 400) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(0)} dismissible>
        <strong>Your username or password is incorrect!</strong>
      </Alert>
    )
  }
  return null
}

function SigninForm({ handleChange, handleSubmit, validated, inputs }) {
  return (
    <>
      <BootstrapForm
        id="signin-form"
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
          <button
            className={styles['signin-btn']}
            type="submit"
            form="signin-form">
            SIGN IN
          </button>
          <div className={styles['info-div']}>
            <p>
              No account yet?{' '}
              <Link style={{ textDecoration: 'none' }} to={'/signup'}>
                Sign up
              </Link>
              <br/>
              <Link style={{ textDecoration: 'none' }} to={'/forget-password'}>
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </BootstrapForm>
    </>
  )
}

function Signin() {
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
    if (form.checkValidity() === false) {
      return
    }

    axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}/signin`,
        {
          username: inputs.username,
          password: inputs.password,
        }
      )
      .then((response) => {
        // If successful
        Cookies.set('authToken', response.data.access_token, { expires: 1 })
        window.location.href = '/'
      })
      .catch((error) => {
        // If not successful (duplicate username or other error)
        setShowAlert(400)
        console.error('Error from server:', error)
      })
  }

  return (
    <>
      <Container fluid className={`${styles['container-fluid']}`}>
        <SuccessfulAlert
          showAlert={showAlert}
          setShowAlert={setShowAlert}></SuccessfulAlert>
        <SigninForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          validated={validated}
          inputs={inputs}></SigninForm>
      </Container>
    </>
  )
}

export default Signin

SuccessfulAlert.propTypes = {
  showAlert: PropTypes.number.isRequired,
  setShowAlert: PropTypes.func.isRequired,
}

SigninForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validated: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
}
