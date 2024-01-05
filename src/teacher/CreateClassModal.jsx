import styles from './CreateClassModal.module.css'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Form as BootstrapForm } from 'react-bootstrap'
import formImg from '../assets/Professor-rafiki.png'
import { useState } from 'react'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { makeCode } from '../utils/helper'
import { CLASS_CODE_LENGTH } from '../constants/constants'

function CreateClassForm({ inputs, handleChange, handleSubmit, validated }) {
  return (
    <>
      <BootstrapForm
        id="create-class-form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}>
        <div className={styles['form-div']}>
          <BootstrapForm.Group
            controlId="name"
            className={styles['my-input-group']}>
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className={styles['my-input']}
              required
              type="text"
              name="name"
              placeholder="Name"
              value={inputs.name || ''}
              onChange={handleChange}
            />
          </BootstrapForm.Group>
          <BootstrapForm.Group
            controlId="description"
            className={styles['my-input-group']}>
            <BootstrapForm.Label></BootstrapForm.Label>
            <BootstrapForm.Control
              className={styles['my-input']}
              as="textarea"
              name="description"
              placeholder="Description"
              rows={9}
              maxLength={300}
              spellCheck={false}
              value={inputs.description || ''}
              onChange={handleChange}
            />
          </BootstrapForm.Group>
        </div>
      </BootstrapForm>
    </>
  )
}

function CreateClassModal({ show, handleClose }) {
  const [inputs, setInputs] = useState({})
  const [validated, setValidated] = useState(false)

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidated(true)
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      return
    }

    const token = Cookies.get('authToken')
    const decodedToken = jwtDecode(token)
    const code = makeCode(CLASS_CODE_LENGTH)
    const _class = { ...inputs, creator: decodedToken.sub, code: code }
    axios
      .post(`${import.meta.env.VITE_SERVER_HOST}/teachers/class`, _class, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        window.location.href = `/teacher/class/${res.data.id}`
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <Modal
      contentClassName={`${styles['modal']}`}
      show={show}
      onHide={handleClose}
      centered={true}
      size="lg">
      <Modal.Header className={`border-0 pb-0 `} closeButton>
        <Modal.Title className={`ms-5`}>Create class</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`pb-0 pt-0`}>
        <Row>
          <Col className={`d-none d-lg-block pe-0`}>
            <img
              src={formImg}
              alt="create-class"
              className={`${styles['form-img']}`}
            />
          </Col>
          <Col className={`m-auto`} xs={10} lg={6}>
            <CreateClassForm
              inputs={inputs}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              validated={validated}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className={`border-0`}>
        <Button
          onClick={handleClose}
          className={styles['close-btn']}
          variant="secondary">
          Close
        </Button>
        <Button
          className={styles['create-btn']}
          type="submit"
          form="create-class-form">
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateClassModal

CreateClassForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validated: PropTypes.bool.isRequired,
  inputs: PropTypes.object.isRequired,
}

CreateClassModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}
