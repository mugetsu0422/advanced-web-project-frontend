/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import axios from 'axios'
import { css } from '@emotion/react'
import Alert from 'react-bootstrap/Alert'

const joinClassForm = css`
  width: 100%;
`

const myInput = css`
  border: 2px solid #afd3d2;
  margin: 5px 0 5px 0;
  padding: 10px;
  max-width: 100%;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem #5aa3a1;
    border-color: #afd3d2;
  }
`

const closeBtn = css`
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
`

const joinBtn = css`
  background-color: #71aca9;
  color: white;
  border: 2px solid #71aca9;
  font-size: 1.25rem;
  font-weight: bold;

  &:hover,
  :active {
    background-color: #5aa3a1 !important;
    border: 2px solid #5aa3a1 !important;
  }
`

const note = css`
  font-size: 0.8rem;
`

function MyAlert({ showAlert, setShowAlert }) {
  if (!showAlert) {
    return null
  }
  if (showAlert.code == 201) {
    return (
      <Alert variant="success" onClose={() => setShowAlert(0)} dismissible>
        <strong>{showAlert.msg}</strong>
      </Alert>
    )
  } else {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(0)} dismissible>
        <strong>{showAlert.msg}</strong>
      </Alert>
    )
  }
}

function JoinClassForm({ inputs, handleChange, handleSubmit }) {
  return (
    <>
      <form
        css={joinClassForm}
        id="join-class-form"
        onSubmit={handleSubmit}>
        <div>
          <input
            css={myInput}
            required
            type="text"
            name="code"
            id="code"
            maxLength={10}
            placeholder="Invitation code"
            value={inputs.code || ''}
            onChange={handleChange}
          />
        </div>
      </form>
    </>
  )
}

function JoinClassModal({ show, handleClose }) {
  const [inputs, setInputs] = useState({})
  const [showAlert, setShowAlert] = useState(null)

  const handleChange = (e) => {
    const name = e.target.name
    let value = e.target.value
    // Remove non-alphanumeric characters using a regular expression
    value = value.replace(/[^a-zA-Z0-9]/g, '')
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const token = Cookies.get('authToken')
    axios
      .post(`${import.meta.env.VITE_SERVER_HOST}/students/join-class`, inputs, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        window.location.href = `/student/class/${res.data}`
      })
      .catch((err) => {
        setShowAlert({
          code: err.response.data.statusCode,
          msg: err.response.data.message,
        })
      })
  }

  return (
    <Modal show={show} onHide={handleClose} centered={true}>
      <Modal.Header className={`border-0 `} closeButton>
        <Modal.Title className={`ms-2`}>Join class</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`pb-0 pt-0`}>
        <div className={`m-auto ms-2`}>
          <MyAlert showAlert={showAlert} setShowAlert={setShowAlert} />
          <JoinClassForm
            inputs={inputs}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
        <div css={note} className={`ms-2 mt-2`}>
          Use a class invitation code of 10 letters or numbers, with no spaces
          or symbols
        </div>
      </Modal.Body>
      <Modal.Footer className={`border-0`}>
        <Button onClick={handleClose} css={closeBtn} variant="secondary">
          Close
        </Button>
        <Button css={joinBtn} type="submit" form="join-class-form">
          Join
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default JoinClassModal

JoinClassForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  inputs: PropTypes.object.isRequired,
}

JoinClassModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}
