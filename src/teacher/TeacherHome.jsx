import styles from '../student/StudentHome.module.css'
import PropTypes from 'prop-types'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Pagination from 'react-bootstrap/Pagination'
import a from '../assets/class-card/class-card-1.png'
import { getVisiblePage } from '../utils/helper'
import { CLASS_GET_LIMIT, VISIBLE_PAGES } from '../constants/constants'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const token = Cookies.get('authToken')

const loadClassNum = async () => {
  const { data } = await axios
    .get(`${import.meta.env.VITE_SERVER_HOST}/teachers/class/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((err) => {
      console.error(err)
    })
  return data
}

const loadClasses = async (offset = 0, limit = CLASS_GET_LIMIT) => {
  const { data } = await axios
  .get(
    `${
      import.meta.env.VITE_SERVER_HOST
    }/teachers/class?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  .catch((err) => {
    console.error(err)
  })
  return data
}

function ClassList({ list }) {
  // const { list } = useLoaderData()
  return (
    <>
      {list.map((ele, idx) => {
        return (
          <Col className="mb-4 d-flex" key={idx}>
            <ClassCard classElement={ele} />
          </Col>
        )
      })}
    </>
  )
}

function ClassCard({ classElement }) {
  return (
    <>
      <Card className={`${styles['class-card']}`}>
        <Card.Header className={`${styles['class-card-header']}`}>
          {/* <Card.Img
            className={`${styles['class-card-img']}`}
            variant="top"
            src={a}
          /> */}
          <Card.Title className={`${styles['truncate-text-one-line']}`}>
            {classElement.name}
          </Card.Title>
        </Card.Header>
        <Card.Body className={`${styles['class-card-body']}`}>
          <Card.Text className={`${styles['truncate-text-multi-line']}`}>
            {classElement.description}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}

const PaginationComponent = ({ count, curPage, setCurPage }) => {
  const totalPages = Math.ceil(count / CLASS_GET_LIMIT)
  const pages = getVisiblePage(totalPages, VISIBLE_PAGES, curPage)

  const handlePagination = async (destPage) => {
    if (destPage == 0 || destPage == totalPages + 1) {
      return
    }
    setCurPage(destPage)
  }

  const items = pages.map((ele, idx) => {
    if (ele.value === curPage) {
      return (
        <Pagination.Item
          key={idx}
          linkClassName={`${styles['page-btn']} ${styles['selected']}`}
          active={true}>
          {ele.value}
        </Pagination.Item>
      )
    }
    return (
      <Pagination.Item
        key={idx}
        onClick={() => setCurPage(ele.value)}
        linkClassName={`${styles['page-btn']}`}>
        {ele.value}
      </Pagination.Item>
    )
  })

  return (
    <Pagination
      className={`${styles['pagination']} d-flex justify-content-center align-items-center`}>
      <Pagination.First
        disabled={curPage === 1}
        onClick={() => setCurPage(1)}
        linkClassName={`${styles['page-btn']}`}
      />
      <Pagination.Prev
        disabled={curPage === 1}
        onClick={() => handlePagination(curPage - 1)}
        linkClassName={`${styles['page-btn']}`}
      />
      {items}
      <Pagination.Next
        disabled={curPage === totalPages}
        onClick={() => handlePagination(curPage + 1)}
        linkClassName={`${styles['page-btn']}`}
      />
      <Pagination.Last
        disabled={curPage === totalPages}
        onClick={() => setCurPage(totalPages)}
        linkClassName={`${styles['page-btn']}`}
      />
    </Pagination>
  )
}

function TeacherHome() {
  const [curPage, setCurPage] = useState(1)
  const [count, setCount] = useState(0)
  const [classes, setClasses] = useState([])

  useEffect(() => {
    loadClassNum().then((res) => {
      setCount(res)
    })
  }, [])

  useEffect(() => {
    const offset = (curPage - 1) * CLASS_GET_LIMIT
    loadClasses(offset, CLASS_GET_LIMIT).then((res) => {
      setClasses(res)
    })
  }, [curPage])

  return (
    <Container fluid className={`${styles['container-fluid']} pt-4 px-5`}>
      <Row xs="1" sm="2" md="3" lg="4">
        <ClassList list={classes} />
      </Row>

      <PaginationComponent
        count={count}
        curPage={curPage}
        setCurPage={setCurPage}
        setClasses={setClasses}
      />
    </Container>
  )
}

export default TeacherHome

ClassList.propTypes = {
  list: PropTypes.array.isRequired,
}

ClassCard.propTypes = {
  classElement: PropTypes.object.isRequired,
}

PaginationComponent.propTypes = {
  count: PropTypes.number.isRequired,
  curPage: PropTypes.number.isRequired,
  setCurPage: PropTypes.func.isRequired,
}
