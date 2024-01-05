import { Link } from 'react-router-dom'
import styles from './MatchaNavBar.module.css'
import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChalkboardUser,
  faGraduationCap,
  faBell,
  faPlus,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons'
import CreateClassModal from '../teacher/CreateClassModal'
import JoinClassModal from '../student/JoinClassModal'
import Notification from './Notification'
import { css } from '@emotion/react'
import { ROLES } from '../constants/constants'

const NavbarContext = createContext()

function AddClassSection() {
  const { role, isSignin } = useContext(NavbarContext)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const modalBasedOnRole = () => {
    if (role === ROLES.teacher) {
      return <CreateClassModal show={show} handleClose={handleClose} />
    } else if (role === ROLES.student) {
      return <JoinClassModal show={show} handleClose={handleClose} />
    }
    return null
  }

  if (!isSignin) {
    return null
  }
  if (role === ROLES.teacher || role === ROLES.student) {
    return (
      <>
        <Nav.Link className={`${styles['dropdown']}`}>
          <FontAwesomeIcon icon={faPlus} onClick={handleShow} />
        </Nav.Link>
        {modalBasedOnRole()}
      </>
    )
  } else {
    return null
  }
}

function NotificationSection() {
  const { role, isSignin } = useContext(NavbarContext)

  const notificationDropdown = css`
    & .dropdown-menu {
      padding: 0rem;

      @media (max-width: 576px) {
        transform: translateX(5%);
      }
    }
  `

  if (!isSignin) {
    return null
  }
  if (role === ROLES.teacher || role === ROLES.student) {
    return (
      <>
        <NavDropdown
          css={notificationDropdown}
          title={<FontAwesomeIcon icon={faBell} />}
          align={'end'}
          className={`${styles['dropdown']}`}>
          <Notification />
        </NavDropdown>
      </>
    )
  } else {
    return null
  }
}

function AccountSection() {
  const { role, isSignin, setIsSignin } = useContext(NavbarContext)

  let accountIcon
  if (role === ROLES.student) {
    accountIcon = (
      <FontAwesomeIcon className={styles['role-icon']} icon={faGraduationCap} />
    )
  } else if (role === ROLES.teacher) {
    accountIcon = (
      <FontAwesomeIcon
        className={styles['role-icon']}
        icon={faChalkboardUser}
      />
    )
  } else if (role === ROLES.admin) {
    accountIcon = (
      <FontAwesomeIcon className={styles['role-icon']} icon={faUserTie} />
    )
  } else {
    null
  }

  function signOut() {
    Cookies.remove('authToken')
    Cookies.remove('socialToken')
    setIsSignin(false)
    window.location.href = '/'
  }

  if (isSignin) {
    return (
      <>
        <NavDropdown
          title={accountIcon}
          align={'end'}
          className={`${styles['dropdown']}`}>
          {role === ROLES.student || role === ROLES.teacher ? (
            <Link
              className={`${styles['dropdown-item']} dropdown-item`}
              to={'/profile/detail'}>
              Profile
            </Link>
          ) : null}
          <NavDropdown.Item
            className={`${styles['dropdown-item']}`}
            onClick={signOut}>
            Sign out
          </NavDropdown.Item>
        </NavDropdown>
      </>
    )
  } else {
    return (
      <>
        <Link className={`${styles['dropdown']} nav-link`} to={'/signin'}>
          Sign In
        </Link>
        <Link className={`${styles['dropdown']} nav-link`} to={'/signup'}>
          Sign Up
        </Link>
      </>
    )
  }
}

function MyNavBar() {
  const { isSignin, setIsSignin } = useContext(NavbarContext)

  return (
    <>
      <header>
        <Navbar className={`${styles['nav']} `}>
          <Navbar.Brand className={`${styles['left']}`}>
            <Link to={'/'}>MATCHA</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`${styles['right']}`}>
            <Nav className={`ms-auto`}>
              <AddClassSection></AddClassSection>
              <NotificationSection></NotificationSection>
              <AccountSection
                isSignin={isSignin}
                setIsSignin={setIsSignin}></AccountSection>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </>
  )
}

function MatchaNavBar() {
  const [isSignin, setIsSignin] = useState(false)
  const role = localStorage.getItem('role')

  useEffect(() => {
    const token = Cookies.get('authToken')
    if (token) {
      setIsSignin(true)
    } else {
      setIsSignin(false)
    }
  }, [])

  return (
    <>
      <NavbarContext.Provider
        value={{
          role: role,
          isSignin: isSignin,
          setIsSignin: setIsSignin,
        }}>
        <MyNavBar isSignin={isSignin} setIsSignin={setIsSignin} />
      </NavbarContext.Provider>
    </>
  )
}

export default MatchaNavBar
