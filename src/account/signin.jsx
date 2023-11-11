import "./signin.css"
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { Form as BootstrapForm } from 'react-bootstrap';

function SuccessfulAlert({ showAlert, setShowAlert }) {
    if (showAlert) {
        return (
            <Alert variant='success' onClose={() => setShowAlert(false)} dismissible>
                <strong>Successful login</strong>
            </Alert>
        )
    }
    return null
}

function SigninForm({ handleChange, handleSubmit, validated, inputs }) {
    return (
        <>
            <BootstrapForm id="login-form" noValidate validated={validated} onSubmit={handleSubmit} >
                <div className='form-div'>
                    <BootstrapForm.Group controlId="username" className='my-input-group'>
                        <BootstrapForm.Label></BootstrapForm.Label>
                        <BootstrapForm.Control
                            className='my-input'
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
                            className='my-input'
                            required
                            type="password"
                            name='password'
                            placeholder="Password"
                            autoComplete='on'
                            defaultValue={inputs.password || ""}
                            onChange={handleChange}
                        />
                    </BootstrapForm.Group>
                    <button className="login-btn" type="submit" form="login-form">LOG IN</button>
                    <div className="info-div">
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

        const username = form.username.value;
        const password = form.password.value;

        // Send HTTP Request
        // If successful
        setShowAlert(true)
        // If not successful
    }

    return (
        <>
            <div className="container-fluid">
                <SuccessfulAlert showAlert={showAlert} setShowAlert={setShowAlert}></SuccessfulAlert>
                <SigninForm handleChange={handleChange} handleSubmit={handleSubmit} validated={validated} inputs={inputs}></SigninForm>
            </div>
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