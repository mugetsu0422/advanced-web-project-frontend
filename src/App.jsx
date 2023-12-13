import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import styles from './App.module.css'
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
} from '@fortawesome/free-solid-svg-icons'
import CreateClassModal from './teacher/CreateClassModal'

const NavbarContext = createContext()
const role = localStorage.getItem('role')

function AddClass() {
  const { isSignin } = useContext(NavbarContext)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const modalBasedOnRole = () => {
    if (role === 'teacher') {
      return <CreateClassModal show={show} handleClose={handleClose} />
    } else if (role === 'student') {
      console.log('student')
    }
    return null
  }

  if (!isSignin) {
    return null
  }
  if (role === 'teacher' || role === 'student') {
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

function Notification() {
  const { isSignin } = useContext(NavbarContext)

  if (!isSignin) {
    return null
  }
  if (role === 'teacher' || role === 'student') {
    return (
      <>
        <Nav.Link className={`${styles['dropdown']}`}>
          <FontAwesomeIcon icon={faBell} />
        </Nav.Link>
      </>
    )
  } else {
    return null
  }
}

function AccountSection() {
  const { isSignin, setIsSignin } = useContext(NavbarContext)

  let accountIcon
  if (role === 'student') {
    accountIcon = (
      <FontAwesomeIcon className={styles['role-icon']} icon={faGraduationCap} />
    )
  } else if (role === 'teacher') {
    accountIcon = (
      <FontAwesomeIcon
        className={styles['role-icon']}
        icon={faChalkboardUser}
      />
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
          <Link
            className={`${styles['dropdown-item']} dropdown-item`}
            to={'/profile/detail'}>
            Profile
          </Link>
          <NavDropdown.Item
            className={`${styles['dropdown-item']}`}
            onClick={signOut}>
            Sign Out
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
      <Navbar expand="md" className={`${styles['nav']} `}>
        <Navbar.Brand className={`${styles['left']}`}>
          <Link to={'/'}>MATCHA</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className={`${styles['right']}`}>
          <Nav className={`ms-auto`}>
            <AddClass></AddClass>
            <Notification></Notification>
            <AccountSection
              isSignin={isSignin}
              setIsSignin={setIsSignin}></AccountSection>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

function App() {
  const [isSignin, setIsSignin] = useState(false)

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
          isSignin: isSignin,
          setIsSignin: setIsSignin,
        }}>
        <MyNavBar isSignin={isSignin} setIsSignin={setIsSignin} />
      </NavbarContext.Provider>
      <Outlet />
    </>
  )
}

export default App
