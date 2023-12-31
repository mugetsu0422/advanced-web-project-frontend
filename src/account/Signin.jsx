import styles from './Signin.module.css'
import Alert from 'react-bootstrap/Alert'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Form as BootstrapForm } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import axios from 'axios'
import Cookies from 'js-cookie'
import Google from '../assets/google.png'
import Facebook from '../assets/facebook.png'
import { jwtDecode } from 'jwt-decode'

function SuccessfulAlert({ showAlert, setShowAlert }) {
  if (showAlert == 201) {
    return (
      <Alert variant="success" onClose={() => setShowAlert(0)} dismissible>
        <strong>Your account has been successfully login!</strong>
      </Alert>
    )
  } else if (showAlert == 400) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(0)} dismissible>
        <strong>Your username or password is incorrect!</strong>
      </Alert>
    )
  } else if (showAlert == 401) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(0)} dismissible>
        <strong>Social login not success!</strong>
      </Alert>
    )
  } else if (showAlert == 402) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(0)} dismissible>
        <strong>Your account has been locked!</strong>
      </Alert>
    )
  }
  return null
}

function google() {
  window.open(`${import.meta.env.VITE_SERVER_HOST}/auth/google`, '_self')
}

function facebook() {
  window.open(`${import.meta.env.VITE_SERVER_HOST}/auth/facebook`, '_self')
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
          <Link
            className={`text-decoration-none w-75 text-end`}
            to={'/forget-password'}>
            Forgot password?
          </Link>
          <button
            className={styles['signin-btn']}
            type="submit"
            form="signin-form">
            SIGN IN
          </button>
          <div className={styles['info-div']}>
            <p>
              No account yet?{' '}
              <Link className={`text-decoration-none`} to={'/signup'}>
                Sign up
              </Link>
              <br />
            </p>
          </div>
          <div className={styles['or']}> OR </div>
          <div className={styles['social-login']}>
            <div
              className={styles['social-google-login-button']}
              onClick={google}>
              <img src={Google} alt="" className={styles['icon']} />
            </div>
            <div
              className={styles['social-facebook-login-button']}
              onClick={facebook}>
              <img src={Facebook} alt="" className={styles['icon']} />
            </div>
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
  const [user, setUser] = useState(null)

  useEffect(() => {
    var url_string = window.location.href
    var url = new URL(url_string)
    var socialToken = url.searchParams.get('socialToken')
    if (socialToken !== null) {
      if (socialToken != '') {
        const getUser = () => {
          axios
            .get(
              `${
                import.meta.env.VITE_SERVER_HOST
              }/auth/signin/success/${socialToken}`
            )
            .then((response) => {
              // If successful
              if (response.data.access_token) {
                Cookies.set('authToken', response.data.access_token, {
                  expires: 1,
                })
                const decodedToken = jwtDecode(response.data.access_token)
                setShowAlert(201)

                if (decodedToken.role != '') {
                  localStorage.setItem('role', decodedToken.role)
                  window.location.href = '/'
                } else {
                  var data = {
                    socialToken: socialToken,
                  }
                  var queryString = Object.keys(data)
                    .map((key) => key + '=' + data[key])
                    .join('&')
                  var newUrl = '/update-role-after-social-login?' + queryString
                  window.location.href = newUrl
                }
              } else {
                setShowAlert(401)
              }
            })
            .catch((error) => {
              if (
                error.response.data.message === 'Your account has been locked.'
              ) {
                setShowAlert(402)

                setTimeout(() => {
                  window.location.href = '/signin'
                }, 2000)
              }
            })
        }
        getUser()
      } else {
        setShowAlert(401)
      }
    }
  }, [])

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
      .post(`${import.meta.env.VITE_SERVER_HOST}/auth/signin`, {
        username: inputs.username,
        password: inputs.password,
      })
      .then((response) => {
        // If successful
        setShowAlert(201)
        Cookies.set('authToken', response.data.access_token, { expires: 1 })
        const decodedToken = jwtDecode(response.data.access_token)
        // localStorage.setItem('username', decodedToken.username)
        localStorage.setItem('role', decodedToken.role)
        window.location.href = '/'
      })
      .catch((error) => {
        // If not successful (duplicate username or other error)
        if (error.response.data.message === 'Your account has been locked.') {
          setShowAlert(402)
        } else {
          setShowAlert(400)
          console.error('Error from server:', error)
        }
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
