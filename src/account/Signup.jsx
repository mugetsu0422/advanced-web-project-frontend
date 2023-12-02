import styles from './Signup.module.css'
import { createContext, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Form as BootstrapForm } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from '../constants/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChalkboardUser,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons'

const FormContext = createContext()

function MyAlert({ showAlert, setShowAlert }) {
  if (showAlert.code == 201) {
    return (
      <Alert variant="success" onClose={() => setShowAlert(0)} dismissible>
        <strong>{showAlert.msg}</strong>
      </Alert>
    )
  } else if (showAlert.code == 400) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(0)} dismissible>
        <strong>{showAlert.msg}</strong>
      </Alert>
    )
  }
  return null
}

function Roles() {
  const { inputs, setInputs, formState, setFormState } = useContext(FormContext)
  const [isInvalid, setIsInvalid] = useState(false)

  function roleClick(role) {
    if (isInvalid) {
      setIsInvalid(false)
    }
    if (role != inputs.role) {
      setInputs((values) => ({ ...values, ['role']: role }))
    }
  }

  return (
    <>
      <div className={styles['form-div']}>
        <div className={styles['title']}>Select your role</div>
        <div className={styles['role-description']}>
          {inputs.role === 'teacher'
            ? 'Guide classes, post assignments, and monitor student progress in a virtual classroom.'
            : ''}
          {inputs.role === 'student'
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
              inputs.role === 'teacher' ? styles['role-card-chosen'] : ''
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
              inputs.role === 'student' ? styles['role-card-chosen'] : ''
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
          onClick={() => {
            if (!inputs.role) {
              setIsInvalid(true)
              return
            }
            setFormState(formState + 1)
          }}>
          CONTINUE
        </button>
      </div>
    </>
  )
}

function PersonalInformation() {
  const {
    handleChange,
    handleChangeNumber,
    validated,
    setValidated,
    inputs,
    formState,
    setFormState,
  } = useContext(FormContext)

  return (
    <>
      <BootstrapForm
        id="account-information-form"
        noValidate
        validated={validated}
        onSubmit={(event) => {
          event.preventDefault()
          setValidated(true)
          const form = event.currentTarget
          if (form.checkValidity() === false) {
            return
          }
          setFormState(formState + 1)
          setValidated(false)
        }}>
        <div className={styles['form-div']}>
          <BootstrapForm.Group
            controlId="fullname"
            className={styles['my-input-group']}>
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className={styles['my-input']}
              required
              type="text"
              name="fullname"
              placeholder="Fullname"
              value={inputs.fullname || ''}
              onChange={handleChange}
            />
          </BootstrapForm.Group>
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
              autoComplete="on"
              value={inputs.email || ''}
              onChange={handleChange}
            />
            <BootstrapForm.Control.Feedback
              type="invalid"
              className={styles['invalid-feedback']}>
              Please include an &apos;@&apos; in the email address
            </BootstrapForm.Control.Feedback>
          </BootstrapForm.Group>
          <BootstrapForm.Group
            controlId="address"
            className={styles['my-input-group']}>
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className={styles['my-input']}
              type="text"
              name="address"
              placeholder="Address"
              autoComplete="on"
              value={inputs.address || ''}
              onChange={handleChange}
            />
          </BootstrapForm.Group>
          <BootstrapForm.Group
            controlId="phone"
            className={styles['my-input-group']}>
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className={styles['my-input']}
              type="text"
              maxLength={15}
              name="phone"
              placeholder="Phone number"
              autoComplete="on"
              value={inputs.phone || ''}
              onChange={handleChangeNumber}
            />
          </BootstrapForm.Group>
          <div className={styles['btn-group']}>
            <button
              className={styles['register-btn']}
              type="button"
              onClick={() => {
                setFormState(formState - 1)
              }}>
              PREVIOUS
            </button>
            <button
              className={styles['register-btn']}
              type="submit"
              form="account-information-form"
              onClick={null}>
              CONTINUE
            </button>
          </div>
          <div className={styles['info-div']}>
            Already have an account?{' '}
            <Link style={{ textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </BootstrapForm>
    </>
  )
}

function SignupForm() {
  const {
    handleChange,
    handleSubmit,
    validated,
    inputs,
    formState,
    setFormState,
  } = useContext(FormContext)

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
              value={inputs.username || ''}
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
              value={inputs.password || ''}
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
              value={inputs.confirmPassword || ''}
              onChange={handleChange}
              isInvalid={inputs.confirmPassword != inputs.password}
            />
            <BootstrapForm.Control.Feedback
              type="invalid"
              className={styles['invalid-feedback']}>
              Confirm password does not match!
            </BootstrapForm.Control.Feedback>
          </BootstrapForm.Group>
          <div className={styles['btn-group']}>
            <button
              className={styles['register-btn']}
              type="button"
              onClick={() => {
                setFormState(formState - 1)
              }}>
              PREVIOUS
            </button>
            <button
              className={styles['register-btn']}
              type="submit"
              form="register-form">
              SIGN UP
            </button>
          </div>
          <div className={styles['info-div']}>
            Already have an account?{' '}
            <Link style={{ textDecoration: 'none' }} to={'/signin'}>
              Sign in
            </Link>
          </div>
        </div>
      </BootstrapForm>
    </>
  )
}

function Signup() {
  const [showAlert, setShowAlert] = useState({code: 0, msg: ''})
  const [inputs, setInputs] = useState({})
  const [validated, setValidated] = useState(false)
  const [formState, setFormState] = useState(0)

  const formList = [
    <Roles key={0}></Roles>,
    <PersonalInformation
      key={1}
      handleChange={handleChange}
      handleChangeNumber={handleChangeNumber}
      handleSubmit={handleSubmit}
      validated={validated}
      inputs={inputs}></PersonalInformation>,
    <SignupForm
      key={2}
      handleChange={handleChange}
      handleChangeNumber={handleChangeNumber}
      handleSubmit={handleSubmit}
      validated={validated}
      inputs={inputs}></SignupForm>,
  ]

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  function handleChangeNumber(event) {
    const name = event.target.name
    const value = event.target.value.replace(/\D/g, '')
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
    const user = { ...inputs }
    user.password = bcrypt.hashSync(inputs.password, SALT_ROUNDS)
    delete user.confirmPassword

    // Send HTTP Request
    axios
      .post(`${import.meta.env.VITE_SERVER_HOST}/users`, user)
      .then(() => {
        // If successful
        setShowAlert({code: 201, msg: 'Your account has been successfully created'})
      })
      .catch((err) => {
        // If not successful (duplicate username)
        setShowAlert({code: 400, msg: err.response.data.message})
      })
  }

  return (
    <>
      <Container fluid className={`${styles['container-fluid']}`}>
        <MyAlert
          showAlert={showAlert}
          setShowAlert={setShowAlert}></MyAlert>
        <FormContext.Provider
          value={{
            handleChange: handleChange,
            handleChangeNumber: handleChangeNumber,
            handleSubmit: handleSubmit,
            validated: validated,
            setValidated: setValidated,
            inputs: inputs,
            setInputs: setInputs,
            formState: formState,
            setFormState: setFormState,
          }}>
          {formList[formState]}
        </FormContext.Provider>
      </Container>
    </>
  )
}

export default Signup

MyAlert.propTypes = {
  showAlert: PropTypes.number.isRequired,
  setShowAlert: PropTypes.func.isRequired,
}

PersonalInformation.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validated: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
}

SignupForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validated: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
}
