import { useState, useEffect } from 'react'
import BootstrapForm from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import styles from './StudentMapStudentID.module.css'
import Cookies from 'js-cookie'
import axios from 'axios'

function MappingStatus({ isMapped, setIsMapped }) {
  if (isMapped == true) {
    return (
      <Alert variant="info" className={styles['successful-alert']}>
        <strong>Student ID mapped</strong>
      </Alert>
    )
  } else {
    return (
      <Alert variant="warning" className={styles['successful-alert']}>
        <strong>Student ID not mapped yet</strong>
      </Alert>
    )
  }
}

function StudentIdMappingForm({
  studentId,
  isMapped,
  handleInputChange,
  handleSaveStudentId,
}) {
  return (
    <div className={styles['profile-form']}>
      <BootstrapForm onSubmit={handleSaveStudentId}>
        <div className="row">
          <div className="col-md-12">
            <BootstrapForm.Group>
              <BootstrapForm.Label>Student ID</BootstrapForm.Label>
              <BootstrapForm.Control
                className={styles['form-control']}
                required
                type="text"
                name="studentId"
                value={studentId}
                onChange={handleInputChange}
                disabled={isMapped}
              />
            </BootstrapForm.Group>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button
              type="submit"
              className={styles['submit-btn']}
              disabled={isMapped}>
              Save
            </button>
          </div>
        </div>
      </BootstrapForm>
    </div>
  )
}

function StudentMapStudentID() {
  const [showAlert, setShowAlert] = useState('')
  const [studentId, setStudentId] = useState('')
  const [isMapped, setIsMapped] = useState(false)

  useEffect(() => {
    const token = Cookies.get('authToken')
    if (token) {
      axios
        .get(`${import.meta.env.VITE_SERVER_HOST}/students/studentid`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.length == 0) return
          setStudentId(response.data.studentID)
          setIsMapped(true)
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
    setStudentId(event.target.value)
  }

  const handleSaveStudentId = (event) => {
    event.preventDefault()

    if (isMapped == true) return
    if (!studentId) return

    const token = Cookies.get('authToken')
    if (token) {
      axios
        .post(
          `${import.meta.env.VITE_SERVER_HOST}/students/studentid`,
          { studentid: studentId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.success == true) {
            setIsMapped(true)
            showAlertFunction('Student ID mapped successfully!', 'success')
          } else {
            showAlertFunction(response.data.message, 'danger')
          }
        })
        .catch((error) => {
          showAlertFunction(
            'An error occurred while mapping student ID',
            'danger'
          )
        })
    }
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
      <p className={`title text-center ${styles.title}`}>Student ID Mapping</p>
      <MappingStatus isMapped={isMapped} setIsMapped={setIsMapped} />
      <StudentIdMappingForm
        studentId={studentId}
        isMapped={isMapped}
        handleInputChange={handleInputChange}
        handleSaveStudentId={handleSaveStudentId}
      />
    </Container>
  )
}

export default StudentMapStudentID
