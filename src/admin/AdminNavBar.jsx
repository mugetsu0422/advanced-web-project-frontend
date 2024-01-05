import styles from './AdminNavBar.module.css'
import { Outlet, Link, useLocation } from 'react-router-dom'
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

function AdminNavBar() {
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
            <Link className={`text-decoration-none`} to={`/admin`}>
              <Nav.Link
                css={myNavLink}
                className={`px-3 ${styles['nav-link']}`}
                as={'div'}
                eventKey="admin"
                href="#">
                Teacher Account Management
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item className={`${styles['nav-item']}`}>
            <Link
              className={`text-decoration-none`}
              to={`/admin/student-account-management`}>
              <Nav.Link
                css={myNavLink}
                className={`px-3 ${styles['nav-link']}`}
                as={'div'}
                eventKey="student-account-management">
                Student Account Management
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item className={`${styles['nav-item']}`}>
            <Link
              className={`text-decoration-none`}
              to={`/admin/class-management`}>
              <Nav.Link
                css={myNavLink}
                className={`px-3 ${styles['nav-link']}`}
                as={'div'}
                eventKey="class-management">
                Class Management
              </Nav.Link>
            </Link>
          </Nav.Item>
        </Nav>
      </Container>
      <Outlet />
    </>
  )
}

export default AdminNavBar
