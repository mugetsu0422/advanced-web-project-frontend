/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { css } from '@emotion/react'
import Alert from 'react-bootstrap/Alert'
import { useParams, useSearchParams } from 'react-router-dom'

const token = Cookies.get('authToken')

const invitationContainer = css`
  margin-top: 5rem;
  display: grid;
  place-items: center;
`

const invitationCard = css`
  width: 80%;
  max-width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 0.5rem;
  padding: 2rem;
  border: 3px solid #afd3d2;
  box-shadow:
    0 2px 4px 0 rgba(0, 0, 0, 0.2),
    0 3px 10px 0 rgba(0, 0, 0, 0.19);
`

const invitationCardTitleText = css`
  text-align: center;

  @media (max-width: 576px) {
    font-size: 1.2rem;
  }
`

const invitationCardNormalText = css`
  text-align: center;

  @media (max-width: 576px) {
    font-size: 0.8rem;
  }
`

const btnGroup = css`
  display: flex;
  gap: 1rem;
`

const closeBtn = css`
  color: white;
  font-size: 1.25rem;
  font-weight: bold;

  @media (max-width: 576px) {
    font-size: 1rem;
  }
`

const joinBtn = css`
  background-color: #71aca9;
  color: white;
  border: 2px solid #71aca9;
  font-size: 1.25rem;
  font-weight: bold;

  @media (max-width: 576px) {
    font-size: 1rem;
  }

  &:hover,
  :active {
    background-color: #5aa3a1 !important;
    border: 2px solid #5aa3a1 !important;
  }
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

function JoinClassByLink() {
  const [showAlert, setShowAlert] = useState(null)
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [classData, setClassData] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}/students/join-class`,
        { code: searchParams.get('code') },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
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

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_SERVER_HOST
        }/students/join-class/${id}?code=${searchParams.get('code')}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setClassData(res.data)
      })
      .catch(() => {
        // Class not found
        window.location.href = '/'
      })
  }, [id, searchParams])

  if (!classData) {
    return null
  }
  return (
    <div css={invitationContainer}>
      <MyAlert showAlert={showAlert} setShowAlert={setShowAlert} />
      <form id="join-class-form" onSubmit={handleSubmit}></form>
      <div css={invitationCard}>
        <h1 css={invitationCardTitleText}>Classroom Invitation</h1>
        <p css={invitationCardNormalText}>
          {` You have been invited to join the class `}{' '}
          <span className="fw-bold">{classData.name}</span>
        </p>
        <p css={invitationCardNormalText}>Do you accept the invitation?</p>
        <div css={btnGroup}>
          <Button
            onClick={() => {
              window.location.href = '/'
            }}
            css={closeBtn}
            variant="secondary">
            Cancel
          </Button>
          <Button css={joinBtn} type="submit" form="join-class-form">
            Join
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JoinClassByLink
