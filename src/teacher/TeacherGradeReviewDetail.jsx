import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import styles from './TeacherGradeReviewDetail.module.css'
import {
  LeftOutlined,
  SendOutlined,
  SaveOutlined,
  EditOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { Alert } from 'react-bootstrap'
import { Input, Button } from 'antd'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import avatar2 from '../assets/user-avatar/2.png'
import moment from 'moment'

const TeacherGradeReviewDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const params = new URLSearchParams(location.search)
  const userIdFromUrl = params.get('userid')
  const gradeIdFromUrl = params.get('gradeid')
  const token = Cookies.get('authToken')
  const [showAlert, setShowAlert] = useState('')
  const [gradeReviewDetails, setGradeReviewDetails] = useState({
    studentName: '',
    studentID: '',
    gradeComposition: '',
    currentGrade: '',
    expectedGrade: '',
    updatedGrade: '',
    studentExplanation: '',
    isFinal: '',
  })
  const [updatedGrade, setUpdatedGrade] = useState('')
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const fetchData = async () => {
    await axios
      .get(
        `${
          import.meta.env.VITE_SERVER_HOST
        }/teachers/class/${id}/grade-review-detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            gradeCompositionID: gradeIdFromUrl,
            userID: userIdFromUrl,
          },
        }
      )
      .then((response) => {
        const data = response.data
        setGradeReviewDetails({
          studentName: data.userFullName,
          studentID: data.studentID,
          gradeComposition: data.gradeCompositionName,
          currentGrade: data.currentGrade,
          expectedGrade: data.expectedGrade,
          updatedGrade: data.updatedGrade,
          studentExplanation: data.explanation,
          isFinal: data.isFinal,
        })
      })
      .catch((error) => {
        showAlertFunction(error.response.data.message, 'danger')
      })
  }

  const fetchComments = async () => {
    await axios
      .get(
        `${
          import.meta.env.VITE_SERVER_HOST
        }/teachers/class/${id}/grade-review-comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            gradeCompositionID: gradeIdFromUrl,
            userID: userIdFromUrl,
          },
        }
      )
      .then((response) => {
        setComments(response.data.comments)
      })
      .catch((error) => {
        showAlertFunction(error.response.data.message, 'danger')
      })
  }

  useEffect(() => {
    fetchData()
    fetchComments()
  }, [])

  const showAlertFunction = (message, type = 'info', dismissible = true) => {
    setShowAlert({ message, type })
    if (dismissible) {
      setTimeout(() => {
        setShowAlert('')
      }, 5000)
    }
  }

  const handleBack = () => {
    const currentPath = location.pathname
    const newPath = currentPath.replace(/\/[^/]+$/, '')
    navigate(newPath)
  }

  const handleSave = async () => {
    if (!/^\d+(\.\d+)?$/.test(updatedGrade)) {
      showAlertFunction('Please enter a valid number for the grade', 'danger')
      return
    }
    setIsEditing(false)
    await axios
      .put(
        `${
          import.meta.env.VITE_SERVER_HOST
        }/teachers/class/${id}/grade-review-detail`,
        {
          gradeCompositionID: gradeIdFromUrl,
          userID: userIdFromUrl,
          updatedGrade: updatedGrade,
          isFinal: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        showAlertFunction('Final score updated', 'success')
        fetchData()
      })
      .catch(() => {
        showAlertFunction('Error update score', 'danger')
      })
  }

  const handleEdit = () => {
    if (gradeReviewDetails.isFinal === true) {
      showAlertFunction('Can not update score after finalize', 'danger')
      return
    }
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setUpdatedGrade('')
  }

  const handleComment = async () => {
    if (gradeReviewDetails.isFinal === true) {
      showAlertFunction('Can not comment after finalize', 'danger')
      return
    }
    const token = Cookies.get('authToken')

    await axios
      .post(
        `${
          import.meta.env.VITE_SERVER_HOST
        }/teachers/class/${id}/grade-review-comments`,
        {
          gradeCompositionID: gradeIdFromUrl,
          userID: userIdFromUrl,
          commentContent: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        fetchComments()
        setNewComment('')
      })
      .catch(() => {
        showAlertFunction('Error adding comment', 'danger')
      })
  }

  return (
    <div className={styles['detail-container']}>
      <Button
        className={`${styles['button']} ${styles['back-button']}`}
        onClick={() => handleBack()}>
        <LeftOutlined />
        Back
      </Button>

      <div className={styles['section-separator']} />
      {showAlert && (
        <Alert variant={showAlert.type} className={styles['alert']} dismissible>
          {showAlert.message}
        </Alert>
      )}

      <div className={styles['section']}>
        <h4 className={styles['section-title']}>Grade Review Details</h4>
        <div className={styles['section-row']}>
          <div className={styles['detail-topic']}>Student Name: </div>
          <div className={styles['detail-value']}>
            {gradeReviewDetails.studentName}
          </div>
        </div>
        <div className={styles['section-row']}>
          <div className={styles['detail-topic']}>Student ID: </div>
          <div className={styles['detail-value']}>
            {gradeReviewDetails.studentID}
          </div>
        </div>
        <div className={styles['section-row']}>
          <div className={styles['detail-topic']}>Grade Composition: </div>
          <div className={styles['detail-value']}>
            {gradeReviewDetails.gradeComposition}
          </div>
        </div>
        <div className={styles['section-row']}>
          <div className={styles['detail-topic']}>Current Grade: </div>
          <div className={styles['detail-value']}>
            {gradeReviewDetails.currentGrade}
          </div>
        </div>
        <div className={styles['section-row']}>
          <div className={styles['detail-topic']}>Expected Grade: </div>
          <div className={styles['detail-value']}>
            {gradeReviewDetails.expectedGrade}
          </div>
        </div>
        <div className={styles['section-row']}>
          <div className={styles['detail-topic']}>Student Explanation: </div>
          <div className={styles['detail-value']}>
            {gradeReviewDetails.studentExplanation}
          </div>
        </div>
      </div>

      <div className={styles['section']}>
        <div className={styles['final-grade']}>
          <div>Final grade:</div>
          {isEditing ? (
            <>
              <Input
                className={styles['input']}
                value={
                  isEditing
                    ? updatedGrade
                    : gradeReviewDetails.isFinal
                    ? gradeReviewDetails.updatedGrade
                    : ''
                }
                onChange={(e) => setUpdatedGrade(e.target.value)}
                disabled={!isEditing}
              />
              <Button className={styles['button']} onClick={handleSave}>
                <SaveOutlined />
                Save
              </Button>
              <Button
                className={`${styles['button']} ${styles['cancel-button']}`}
                onClick={handleCancel}>
                <CloseOutlined />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Input
                className={styles['input']}
                value={
                  gradeReviewDetails.isFinal
                    ? gradeReviewDetails.updatedGrade
                    : ''
                }
                disabled
              />
              <Button className={styles['button']} onClick={handleEdit}>
                <EditOutlined />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      <div className={styles['section-separator']} />

      <div className={styles['comment-section']}>
        <h4 className={styles['section-title']}>Comment Section</h4>
        {comments.map((comment, index) => (
          <div key={index} className={styles['comment']}>
            <div className={styles['comment-row']}>
              <img src={avatar2} alt="Avatar" className={styles['avatar']} />
              <div className={styles['comment-info']}>
                <div className={styles['sender-info']}>
                  <div className={styles['sender-name']}>
                    {comment.authorName}
                  </div>
                  <div className={styles['comment-time']}>
                    {moment(comment.createTime).fromNow()}
                  </div>
                </div>
                <p className={styles['comment-content']}>
                  {comment.commentContent}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className={styles['new-comment']}>
          <img src={avatar2} alt="Your Avatar" className={styles['avatar']} />
          <Input.TextArea
            className={styles['input']}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={gradeReviewDetails.isFinal}
          />
          <Button className={styles['button']} onClick={handleComment}>
            <SendOutlined />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TeacherGradeReviewDetail
