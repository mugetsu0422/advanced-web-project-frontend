import styles from '../teacher/TeacherClassNavBar.module.css'
import { Outlet, Link, useParams, useLocation } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { css } from '@emotion/react'

const myNavLink = css`
  &.active {
    color: #71aca9 !important;
    transition:
      font-weight 0.2s ease-in-out,
      color 0.2s ease-in-out;
  }
`

function StudentClassNavBar() {
  const { id = null } = useParams()
  let { pathname } = useLocation()

  const segments = pathname.split('/')
  const sectionPosition = 4

  return (
    <>
      <Container fluid className="d-flex mx-0 ps-md-5 my-3">
        <Nav
          variant="underline"
          defaultActiveKey={segments[sectionPosition]}
          className={`${styles['nav']}`}>
          <Nav.Item className={`${styles['nav-item']}`}>
            <Link
              className={`text-decoration-none`}
              to={`/student/class/${id}`}>
              <Nav.Link
                css={myNavLink}
                className={`px-3 ${styles['nav-link']}`}
                as={'div'}
                eventKey={id}
                href="#">
                Details
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item className={`${styles['nav-item']}`}>
            <Link
              className={`text-decoration-none`}
              to={`/student/class/${id}/grade-structure`}>
              <Nav.Link
                css={myNavLink}
                className={`px-3 ${styles['nav-link']}`}
                as={'div'}
                eventKey="grade-structure">
                Grade structure
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item className={`${styles['nav-item']}`}>
            <Link
              className={`text-decoration-none`}
              to={`/student/class/${id}/scoreboard`}>
              <Nav.Link
                css={myNavLink}
                className={`px-3 ${styles['nav-link']}`}
                as={'div'}
                eventKey="scoreboard">
                Scoreboard
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item className={`${styles['nav-item']}`}>
            <Link
              className={`text-decoration-none`}
              to={`/student/class/${id}/people`}>
              <Nav.Link
                css={myNavLink}
                className={`px-3 ${styles['nav-link']}`}
                as={'div'}
                eventKey="people">
                People
              </Nav.Link>
            </Link>
          </Nav.Item>
        </Nav>
      </Container>
      <Outlet />
    </>
  )
}

export default StudentClassNavBar
