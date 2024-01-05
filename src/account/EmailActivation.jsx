import { useState, useEffect } from 'react'
import BootstrapForm from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import styles from './Profile.module.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

function ActivationStatus({ isActivated, setIsActivated }) {
  if (isActivated == true) {
    return (
      <Alert
        variant="info"
        onClose={() => setIsActivated('')}
        className={styles['successful-alert']}>
        <strong>Account activated</strong>
      </Alert>
    )
  } else {
    return (
      <Alert
        variant="warning"
        onClose={() => setIsActivated('')}
        className={styles['successful-alert']}>
        <strong>Account not activated</strong>
      </Alert>
    )
  }
}

function EmailActivationForm({
  handleActivateAccount,
  handleResendActivation,
  activationCode,
  handleInputChange,
}) {
  return (
    <div className={styles['profile-form']}>
      <BootstrapForm onSubmit={handleActivateAccount}>
        <div className="row">
          <div className="col-md-12">
            <BootstrapForm.Group>
              <BootstrapForm.Label>Activation Code</BootstrapForm.Label>
              <BootstrapForm.Control
                className={styles['form-control']}
                required
                type="text"
                name="activationCode"
                value={activationCode}
                onChange={handleInputChange}
              />
            </BootstrapForm.Group>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button type="submit" className={styles['submit-btn']}>
              Activate Account
            </button>
          </div>
        </div>
      </BootstrapForm>
      <div className="row">
        <div className="col-md-12">
          <button
            onClick={handleResendActivation}
            className={styles['submit-btn']}>
            Send Activation code
          </button>
        </div>
      </div>
    </div>
  )
}

function EmailActivation() {
  const [showAlert, setShowAlert] = useState('')
  const [activationCode, setActivationCode] = useState('')
  const [isActivated, setIsActivated] = useState(false)

  useEffect(() => {
    const token = Cookies.get('authToken')
    if (token) {
      axios
        .get(`${import.meta.env.VITE_SERVER_HOST}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userData = response.data
          setIsActivated(userData.isActivated)
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })
    }
  }, [])

  const showAlertFunction = (message, type = 'info', dismissible = true) => {
    setShowAlert({ message, type, dismissible })
    if (dismissible) {
      setTimeout(() => {
        setShowAlert('')
      }, 5000)
    }
  }

  const handleInputChange = (event) => {
    setActivationCode(event.target.value)
  }

  const handleResendActivation = () => {
    const token = Cookies.get('authToken')
    const decodedToken = jwtDecode(token)

    axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}/users/send-activation-code/${
          decodedToken.sub
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        showAlertFunction(
          'Activation email resent successfully! Check your email for the code.',
          'success'
        )
      })
      .catch(() => {
        showAlertFunction('Error sending activation email', 'danger')
      })
  }

  const handleActivateAccount = () => {
    event.preventDefault()
    if (!activationCode) {
      return
    }

    const token = Cookies.get('authToken')
    const decodedToken = jwtDecode(token)

    axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}/users/verify-activation-code`,
        {
          activationCode: activationCode,
          userId: decodedToken.sub,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const { isActivated } = response.data
        if (isActivated) {
          setIsActivated(true)
          showAlertFunction('Account activated successfully!', 'success')
        } else {
          showAlertFunction('Wrong activation code', 'danger')
        }
      })
      .catch(() => {
        showAlertFunction('Internal server error', 'danger')
      })
  }

  return (
    <Container fluid className={`col-sm-9 pb-4 ${styles['col-sm-9']}`}>
      {showAlert && showAlert.dismissible && (
        <Alert
          variant={showAlert.type}
          className={styles['successful-alert']}
          dismissible>
          {showAlert.message}
        </Alert>
      )}
      <p className={`title text-center ${styles.title}`}>Email Activation</p>
      <ActivationStatus
        isActivated={isActivated}
        setIsActivated={setIsActivated}
      />
      <p className={styles['instruction']}>
        {
          'We will send the activation code to your email once you click on the Send Activation Code on the bottom of this tab. Please check your email for the 6-digit code and enter it here. Click on the Send Activation Code button again if you do not see the email.'
        }
      </p>
      <EmailActivationForm
        handleActivateAccount={handleActivateAccount}
        handleResendActivation={handleResendActivation}
        activationCode={activationCode}
        handleInputChange={handleInputChange}
      />
    </Container>
  )
}

export default EmailActivation
