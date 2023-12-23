import { css } from '@emotion/react'
import Card from 'react-bootstrap/Card'
import { Container } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup'
import styled from '@emotion/styled'
import { PersonPlus } from 'react-bootstrap-icons'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { createContext, useContext, useEffect, useState } from 'react'
import { ROLES, USER_AVATAR_IMG } from '../constants/constants'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'

const ClassPeopleContext = createContext()

const MyContainer = styled(Container)`
  display: grid;
  place-items: center;
`

const listContainer = css`
  width: 80%;
  border: none;
  max-width: 70rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const cardBody = css`
  padding: 0rem;
`

const cardTitle = css`
  font-size: 2rem;
  color: #71aca9;
  border-bottom: 1px solid #71aca9;
  display: flex;
  justify-content: space-between;

  @media (max-width: 576px) {
    font-size: 1.2rem;
  }
`

const titleText = css`
  display: grid;
  place-items: center;
  margin-left: 1rem;
  font-weight: 600;
`

const studentLeftContainer = css`
  display: flex;
`

const studentNumber = css`
  display: grid;
  place-items: center;
  font-size: 1rem;
  margin-right: 1rem;

  @media (max-width: 576px) {
    font-size: 0.8rem;
  }
`

const iconContainer = css`
  width: 3.5rem;
  height: 3.5rem;
  display: grid;
  place-items: center;
  border-radius: 50%;

  &:hover {
    cursor: pointer;
    background-color: #aacdaf4c;
  }

  @media (max-width: 576px) {
    width: 2.25rem;
    height: 2.25rem;
  }
`

const listGroup = css`
  & div {
    font-weight: 500;
    color: #3c4043 !important;
    display: flex;
    align-items: center;
  }
  & img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-right: 1rem;
  }
`

const myInputGroup = css`
  display: grid;
  place-items: center;
  width: 100%;
  height: fit-content;
`

const myInput = css`
  border: 2px solid #afd3d2;
  margin: 5px 0 5px 0;
  padding: 10px;
  width: 100%;

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

  @media (max-width: 576px) {
    font-size: 1rem;
  }
`

const addBtn = css`
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

  @media (max-width: 576px) {
    font-size: 1rem;
  }
`

const TeacherList = () => {
  const { people, setPersonType, setShowModal } = useContext(ClassPeopleContext)
  const { creator = [{ fullname: '' }], teachers = [] } = people || {}

  return (
    <Card css={listContainer}>
      <Card.Body css={cardBody}>
        <Card.Title css={cardTitle}>
          <div css={titleText}>Teachers</div>
          <div
            css={iconContainer}
            onClick={() => {
              setPersonType(ROLES.teacher)
              setShowModal(true)
            }}>
            <PersonPlus />
          </div>
        </Card.Title>
        <ListGroup css={listGroup} variant="flush">
          <ListGroup.Item>
            <img src={USER_AVATAR_IMG[creator[0].fullname.length % 8]} alt="avatar" />
            {creator[0].fullname} (Owner)
          </ListGroup.Item>
          {createListGroupItem(teachers)}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

const StudentList = () => {
  const { people, setPersonType, setShowModal } = useContext(ClassPeopleContext)
  const { students = [] } = people || {}

  return (
    <Card css={listContainer}>
      <Card.Body css={cardBody}>
        <Card.Title css={cardTitle}>
          <div css={titleText}>Students</div>
          <div css={studentLeftContainer}>
            <div css={studentNumber}>{students.length} students</div>
            <div
              css={iconContainer}
              onClick={() => {
                setPersonType(ROLES.student)
                setShowModal(true)
              }}>
              <PersonPlus />
            </div>
          </div>
        </Card.Title>
        <ListGroup css={listGroup} variant="flush">
          {createListGroupItem(students)}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

function MyAlert() {
  const { showAlert, setShowAlert } = useContext(ClassPeopleContext)
  if (!showAlert) {
    return null
  }
  if (showAlert.code == 201) {
    return (
      <Alert variant="success" onClose={() => setShowAlert(0)} dismissible>
        <strong>{showAlert.msg}</strong>
      </Alert>
    )
  } else if (showAlert.code == 400) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(0)} dismissible>
        <strong>{showAlert.msg}</strong>
      </Alert>
    )
  }
  return null
}

const AddPersonForm = () => {
  const { inputs, handleChange, handleSubmit } = useContext(ClassPeopleContext)

  return (
    <>
      <form id="add-person-form" onSubmit={handleSubmit}>
        <div>
          <div css={myInputGroup}>
            <input
              css={myInput}
              required
              type="email"
              name="email"
              placeholder="Email"
              value={inputs.email || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </>
  )
}

const AddPersonModal = () => {
  const { showModal, setShowModal, personType } = useContext(ClassPeopleContext)

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invite {personType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MyAlert />
          <AddPersonForm />
        </Modal.Body>
        <Modal.Footer>
          <Button
            css={closeBtn}
            variant="secondary"
            onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            type="submit"
            css={addBtn}
            onClick={() => null}
            form="add-person-form">
            Invite
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

function TeacherClassPeople() {
  const [showModal, setShowModal] = useState(false)
  const [personType, setPersonType] = useState(null)
  const [inputs, setInputs] = useState({})
  const [showAlert, setShowAlert] = useState(null)
  const [people, setPeople] = useState(null)
  const { id } = useParams()
  const token = Cookies.get('authToken')

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}/teachers/class/${id}/people`,
        {
          email: inputs.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        // If successful
        setShowAlert({
          code: 201,
          msg: 'Successfully add',
        })
      })
      .catch((err) => {
        // If not successful (not found email or already in class)
        setShowAlert({ code: 400, msg: err.response.data.message })
      })
  }

  useEffect(() => {
    peopleListLoad(token, id).then((res) => {
      setPeople(res)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MyContainer fluid>
      <ClassPeopleContext.Provider
        value={{
          people: people,
          personType: personType,
          setPersonType: setPersonType,
          showModal: showModal,
          setShowModal: setShowModal,
          inputs: inputs,
          handleChange: handleChange,
          handleSubmit: handleSubmit,
          showAlert: showAlert,
          setShowAlert: setShowAlert,
        }}>
        <TeacherList />
        <StudentList />
        <AddPersonModal />
      </ClassPeopleContext.Provider>
    </MyContainer>
  )
}

export default TeacherClassPeople

const peopleListLoad = async (token, classid) => {
  const { data = null } = await axios
    .get(
      `${import.meta.env.VITE_SERVER_HOST}/teachers/class/${classid}/people`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .catch((err) => {
      // Dont have access to this class
      if (err.response.status == 404) {
        window.location.href = '/teacher'
        return {}
      }
    })
  return data
}

const createListGroupItem = (list) => {
  return list.map((ele, idx) => {
    return (
      <ListGroup.Item key={idx}>
        <img src={USER_AVATAR_IMG[ele.fullname.length % 8]} alt="avatar" />
        {ele.fullname}
      </ListGroup.Item>
    )
  })
}
