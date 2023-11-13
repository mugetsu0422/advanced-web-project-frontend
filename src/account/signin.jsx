import styles from './signin.module.css';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { Form as BootstrapForm } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

function SuccessfulAlert({ showAlert, setShowAlert }) {
    if (showAlert) {
        return (
            <Alert variant='success' onClose={() => setShowAlert(false)} dismissible>
                <strong>Successfully sign in</strong>
            </Alert>
        )
    }
    return null
}

function SigninForm({ handleChange, handleSubmit, validated, inputs }) {
    return (
        <>
            <BootstrapForm id="signin-form" noValidate validated={validated} onSubmit={handleSubmit} >
                <div className={styles['form-div']}>
                    <BootstrapForm.Group controlId="username" className={styles['my-input-group']}>
                        <BootstrapForm.Label></BootstrapForm.Label>
                        <BootstrapForm.Control
                            className={styles['my-input']}
                            required
                            type="text"
                            name='username'
                            placeholder="Username"
                            defaultValue={inputs.username || ""}
                            onChange={handleChange}
                        />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group controlId="password" className='my-input-group'>
                        <BootstrapForm.Label></BootstrapForm.Label>
                        <BootstrapForm.Control
                            className={styles['my-input']}
                            required
                            type="password"
                            name='password'
                            placeholder="Password"
                            autoComplete='on'
                            defaultValue={inputs.password || ""}
                            onChange={handleChange}
                        />
                    </BootstrapForm.Group>
                    <button className={styles['signin-btn']} type="submit" form="signin-form">SIGN IN</button>
                    <div className={styles['info-div']}>
                        <p>No account yet? <Link style={{ textDecoration: 'none' }} to={'/signup'}>Sign up</Link ></p>
                    </div>
                </div>
            </BootstrapForm>
        </>
    )
}

function Signin() {
    const [showAlert, setShowAlert] = useState(false)
    const [inputs, setInputs] = useState({});
    const [validated, setValidated] = useState(false);

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    function handleSubmit(event) {
        event.preventDefault();
        setValidated(true)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            return
        }

        // Send HTTP Request
        // If successful
        setShowAlert(true)
        // If not successful
    }

    return (
        <>
            <Container fluid className={`${styles["container-fluid"]}`}>
                <SuccessfulAlert showAlert={showAlert} setShowAlert={setShowAlert}></SuccessfulAlert>
                <SigninForm handleChange={handleChange} handleSubmit={handleSubmit} validated={validated} inputs={inputs}></SigninForm>
            </Container>
        </>
    );
}

export default Signin;

SuccessfulAlert.propTypes = {
    showAlert: PropTypes.bool.isRequired,
    setShowAlert: PropTypes.func.isRequired,
}

SigninForm.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    validated: PropTypes.bool.isRequired,
    inputs: PropTypes.object.isRequired,
}