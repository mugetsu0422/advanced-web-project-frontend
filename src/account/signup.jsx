import Alert from 'react-bootstrap/Alert'
import './signup.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Form as BootstrapForm } from 'react-bootstrap'

function SuccessfulAlert({ showAlert, setShowAlert }) {
  if (showAlert) {
    return (
      <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
        <strong>Your account has been successfully created</strong>
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
        <div className="form-div">
          <BootstrapForm.Group controlId="username" className="my-input-group">
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className="my-input"
              required
              type="text"
              name="username"
              placeholder="Username"
              defaultValue={inputs.username || ''}
              onChange={handleChange}
            />
          </BootstrapForm.Group>
          <BootstrapForm.Group controlId="password" className="my-input-group">
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className="my-input"
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
            className="my-input-group">
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className="my-input"
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
            <BootstrapForm.Control.Feedback type="invalid">
              Confirm password does not match!
            </BootstrapForm.Control.Feedback>
          </BootstrapForm.Group>
          <button className="register-btn" type="submit" form="register-form">
            SIGN UP
          </button>
          <div className="info-div">
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
  const [showAlert, setShowAlert] = useState(false)
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
    // If successful
    setShowAlert(true)
    // If not successful
  }

  return (
    <>
      <div className="container-fluid">
        <SuccessfulAlert
          showAlert={showAlert}
          setShowAlert={setShowAlert}></SuccessfulAlert>
        <SignupForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          validated={validated}
          inputs={inputs}></SignupForm>
      </div>
    </>
  )
}

export default Signup

SuccessfulAlert.propTypes = {
  showAlert: PropTypes.bool.isRequired,
  setShowAlert: PropTypes.func.isRequired,
}

SignupForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validated: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
}
