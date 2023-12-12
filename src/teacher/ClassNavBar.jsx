import styles from './ClassNavBar.module.css'
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

function ClassNavBar() {
  const { id = null } = useParams()
  let { pathname } = useLocation()

  const segments = pathname.split('/')

  return (
    <>
      <Container fluid className="d-flex mx-0 ps-md-5 my-3">
        <Nav
          variant="underline"
          defaultActiveKey={segments[segments.length - 1]}
          className={`${styles['nav']}`}>
          <Nav.Item className={`${styles['nav-item']}`}>
            <Link
              className={`text-decoration-none`}
              to={`/teacher/class/${id}`}>
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
              className={`text-decoration-none`}>
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
              className={`text-decoration-none`}>
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
              className={`text-decoration-none`}>
              <Nav.Link
                css={myNavLink}
                className={`px-3 ${styles['nav-link']}`}
                as={'div'}
                eventKey="finalize">
                Finalize
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item className={`${styles['nav-item']}`}>
            <Link
              className={`text-decoration-none`}>
              <Nav.Link
                css={myNavLink}
                className={`px-3 ${styles['nav-link']}`}
                as={'div'}
                eventKey="requests">
                Requests
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item className={`${styles['nav-item']}`}>
            <Link
              className={`text-decoration-none`}
              to={`/teacher/class/${id}/people`}>
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

export default ClassNavBar
