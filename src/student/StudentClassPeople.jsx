import { css } from '@emotion/react'
import Card from 'react-bootstrap/Card'
import { Container } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup'
import styled from '@emotion/styled'
import { createContext, useContext, useEffect, useState } from 'react'
import { USER_AVATAR_IMG } from '../constants/constants'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'
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
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
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

const TeacherList = () => {
  const { people } = useContext(ClassPeopleContext)
  const { creator = [{ fullname: '' }], teachers = [] } = people || {}

  return (
    <Card css={listContainer}>
      <Card.Body css={cardBody}>
        <Card.Title css={cardTitle}>
          <div css={titleText}>Teachers</div>
        </Card.Title>
        <ListGroup css={listGroup} variant="flush">
          <ListGroup.Item>
            <img
              src={USER_AVATAR_IMG[creator[0].fullname.length % 8]}
              alt="avatar"
            />
            {creator[0].fullname} (Owner)
          </ListGroup.Item>
          {createListGroupItem(teachers)}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

const StudentList = () => {
  const { people } = useContext(ClassPeopleContext)
  const { students = [] } = people || {}

  return (
    <Card css={listContainer}>
      <Card.Body css={cardBody}>
        <Card.Title css={cardTitle}>
          <div css={titleText}>Students</div>
          <div css={studentLeftContainer}>
            <div css={studentNumber}>{students.length} students</div>
          </div>
        </Card.Title>
        <ListGroup css={listGroup} variant="flush">
          {createListGroupItem(students)}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

function StudentClassPeople() {
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
      </ClassPeopleContext.Provider>
    </MyContainer>
  )
}

export default StudentClassPeople

const peopleListLoad = async (token, classid) => {
  const { data = null } = await axios
    .get(
      `${import.meta.env.VITE_SERVER_HOST}/students/class/${classid}/people`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .catch(() => {})
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
