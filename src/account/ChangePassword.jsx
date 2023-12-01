import styles from './Profile.module.css'
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form as BootstrapForm } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from '../constants/constants'

function SuccessfulAlert({ showAlert, setShowAlert }) {
  if (showAlert == 200) {
    return (
      <Alert variant="success" onClose={() => setShowAlert('') } className={styles['successful-alert']} dismissible>
        <strong>Change password successfully</strong>
      </Alert>
    )
  } else if (showAlert == 400) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert('')} className={styles['successful-alert']} dismissible>
        <strong>Old password is incorrect</strong>
      </Alert>
    )
  }
  return null
}

function ChangePasswordForm({ handleChange, handleSubmit, validated, inputs }) {
  return (
    <div>
      <BootstrapForm
        className={`profile-form ${styles['profile-form']}`}
        onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <BootstrapForm.Group>
              <BootstrapForm.Label htmlFor="oldPassword">Old Password</BootstrapForm.Label>
              <BootstrapForm.Control
                className={styles['form-control']}
                required
                type="password"
                name="oldPassword"
                value={inputs.oldPassword || ''}
                onChange={handleChange}
              />
            </BootstrapForm.Group>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <BootstrapForm.Group>
              <BootstrapForm.Label htmlFor="newPassword">New Password</BootstrapForm.Label>
              <BootstrapForm.Control
                className={styles['form-control']}
                required
                type="password"
                name="newPassword"
                value={inputs.newPassword || ''}
                onChange={handleChange}
              />
            </BootstrapForm.Group>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <BootstrapForm.Group>
              <BootstrapForm.Label htmlFor="confirmNewPassword">Confirm New Password</BootstrapForm.Label>
              <BootstrapForm.Control
                className={styles['form-control']}
                required
                type="password"
                name="confirmNewPassword"
                value={inputs.confirmNewPassword || ''}
                onChange={handleChange}
                isInvalid={inputs.newPassword !== inputs.confirmNewPassword}
              />
              <BootstrapForm.Control.Feedback type="invalid" className={styles['invalid-feedback']}>
                Passwords do not match.
              </BootstrapForm.Control.Feedback>
            </BootstrapForm.Group>
          </div>
        </div>
        <button type="submit" className={styles['submit-btn']}>
          SAVE
        </button>
      </BootstrapForm>
    </div>
  )
}

function ChangePassword() {
  const [showAlert, setShowAlert] = useState(0);
  const [inputs, setInputs] = useState({});
  const [validated, setValidated] = useState(false);

  function handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    setValidated(true);
    const form = event.currentTarget;
    if (form.checkValidity() === false || inputs.newPassword !== inputs.confirmNewPassword) {
      return;
    }

    const token = Cookies.get('authToken')
    const decodedToken = jwtDecode(token)
    axios
    .post(
      `${import.meta.env.VITE_SERVER_HOST}/users/change-password`,
      {
        userId: decodedToken.sub,
        oldPassword: inputs.oldPassword,
        newPassword: bcrypt.hashSync(inputs.newPassword, SALT_ROUNDS),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(() => {
      setShowAlert(200);
      setInputs({
        oldPassword: '', 
        newPassword: '', 
        confirmNewPassword: '', 
      });
    })
    .catch((error) => {
      setShowAlert(400);
      console.error('Error from server:', error);
    });
  }

  return (
    <Container fluid className={`col-sm-9 pb-4 ${styles['col-sm-9']}`}>
      <p className={`title text-center ${styles.title}`}>Change Password</p>
      <SuccessfulAlert 
      showAlert={showAlert} 
      setShowAlert={setShowAlert} />
      <ChangePasswordForm
        handleChange={handleInputChange}
        handleSubmit={handleFormSubmit}
        validated={validated}
        inputs={inputs}
      />
    </Container>
  );
}

export default ChangePassword;

SuccessfulAlert.propTypes = {
  showAlert: PropTypes.number.isRequired,
  setShowAlert: PropTypes.func.isRequired,
}

ChangePasswordForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validated: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
}