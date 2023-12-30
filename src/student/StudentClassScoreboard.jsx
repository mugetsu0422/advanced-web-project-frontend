import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './StudentClassScoreboard.module.css'
import { FormOutlined, EyeOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Modal, Alert, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import Cookies from 'js-cookie'

const AddReviewModal = ({ show, handleClose, handleSubmit, alertMessage }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className={`border-0 `} closeButton>
        <Modal.Title className={`ms-2`}>Request review</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`pb-0 pt-0`}>
        {alertMessage && (
          <Alert
            variant={alertMessage.type}
            className={styles['alert']}
            dismissible>
            {alertMessage.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="expectationGrade">
            <Form.Control
              type="text"
              placeholder="Enter expectation grade"
              className={styles['input']}
            />
          </Form.Group>
          <Form.Group controlId="explanation">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter explanation"
              className={styles['input']}
            />
          </Form.Group>
          <div className="row justify-content-end">
            <div className="col-auto">
              <button
                type="submit"
                className={styles['modal-btn']}
                onClick={() => handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

const StudentClassScoreboard = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = Cookies.get('authToken')
  const [showAlert, setShowAlert] = useState('')
  const [isMapped, setSetIsMapped] = useState(false)
  const [allGrades, setAllGrades] = useState([])
  const [overallGrade, setOverallGrade] = useState(0)
  const [addGradeCompositionID, setAddGradeCompositionID] = useState('')
  const [addCurrentGrade, setAddCurrentGrade] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalAlert, setModalAlert] = useState(null)

  const fetchData = () => {
    axios
      .get(
        `${import.meta.env.VITE_SERVER_HOST}/students/class/${id}/all-grade`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setAllGrades(response.data.grades)
        if (!response.data.student)
          showAlertFunction(
            'You have not map your student ID into your account',
            'warning'
          )
        else setSetIsMapped(true)
      })
      .catch((err) => {
        showAlertFunction(err.response.data.message, 'danger')
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const calculateOverallGrade = () => {
      let sum = 0
      allGrades.forEach((grade) => {
        if (grade.grade !== null && grade.scale !== null) {
          sum += (grade.grade * grade.scale) / 100
        }
      })
      setOverallGrade(Number(sum.toFixed(2)))
    }
    calculateOverallGrade()
  }, [allGrades])

  const showAlertFunction = (message, type = 'info', dismissible = true) => {
    setShowAlert({ message, type })
    if (dismissible) {
      setTimeout(() => {
        setShowAlert('')
      }, 5000)
    }
  }

  const handleViewReview = (gradeid, userId) => {
    const searchParams = new URLSearchParams()
    searchParams.set('gradeid', gradeid)
    searchParams.set('userid', userId)
    navigate(
      `${location.pathname}/grade-review/detail?${searchParams.toString()}`
    )
  }

  const handleAddReview = (gradeCompositionID, currentGrade, isFinalized) => {
    if (!isMapped) {
      showAlertFunction(
        "You haven't mapped your student ID into your account",
        'warning'
      )
    } else if (!isFinalized) {
      showAlertFunction("Can't request review for non-finalized grade", 'danger')
    } else {
      handleShowModal(gradeCompositionID, currentGrade)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalAlert(null)
  }

  const handleShowModal = (gradeCompositionID, currentGrade) => {
    setAddGradeCompositionID(gradeCompositionID)
    setAddCurrentGrade(currentGrade)
    setShowModal(true)
  }

  const handleSubmitModal = async (event) => {
    event.preventDefault()
    const form = event.target
    const expectationGrade = form.elements.expectationGrade.value
    const explanation = form.elements.explanation.value

    // Check if expectationGrade is a number
    if (isNaN(expectationGrade)) {
      setModalAlert({
        message: 'Expectation grade must be a number',
        type: 'danger',
      })
      return
    }

    await axios
      .post(
        `${
          import.meta.env.VITE_SERVER_HOST
        }/students/class/${id}/grade-review-detail`,
        {
          GradeCompositionID: addGradeCompositionID,
          CurrentGrade: addCurrentGrade,
          ExpectationGrade: expectationGrade,
          Explanation: explanation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        showAlertFunction('Review added', 'success')
        fetchData()
      })
      .catch(() => {
        showAlertFunction('Error requesting review', 'danger')
      })
    handleCloseModal()
  }

  return (
    <>
      <AddReviewModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmitModal}
        alertMessage={modalAlert}
      />
      <div className={styles.gradeTableContainer}>
        {showAlert && (
          <Alert
            variant={showAlert.type}
            className={styles['alert']}
            dismissible>
            {showAlert.message}
          </Alert>
        )}
        <table className={styles.gradeTable}>
          <thead>
            <tr className={styles['non-draggable']}>
              <th>Name</th>
              <th>Grade Scale (%)</th>
              <th>Grade</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {allGrades.map((grade, index) => (
              <tr key={index}>
                <td>{grade.name}</td>
                <td>{grade.scale}</td>
                <td>
                  {grade.review && grade.review.isFinal === false
                    ? 'Under review'
                    : grade.grade
                    ? grade.grade
                    : 'Not graded'}
                </td>
                <td className={styles['operation-cell']}>
                  {grade.review ? (
                    <>
                      <Button
                        className={styles['review-button']}
                        onClick={() =>
                          handleViewReview(
                            grade.gradeCompositionID,
                            grade.review.userID
                          )
                        }>
                        <EyeOutlined />
                        View review
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className={styles['review-button']}
                        onClick={() =>
                          handleAddReview(
                            grade.gradeCompositionID,
                            grade.grade,
                            grade.isFinalized
                          )
                        }>
                        <FormOutlined />
                        Request review
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            <tr className={`${styles['non-draggable']} ${styles['overall-row']}`}>
              <td>Overall</td>
              <td></td>
              <td>{overallGrade}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default StudentClassScoreboard
