import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import styles from './App.module.css'
import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { jwtDecode } from 'jwt-decode'

const NavbarContext = createContext()

function AddClass() {
  const { isSignin } = useContext(NavbarContext)

  if (!isSignin) {
    return null
  }
  return (
    <>
      <Nav.Link className={`${styles['dropdown']}`}>Add</Nav.Link>
    </>
  )
}

function Notification() {
  const { isSignin } = useContext(NavbarContext)

  if (!isSignin) {
    return null
  }
  return (
    <>
      <Nav.Link className={`${styles['dropdown']}`}>Notification</Nav.Link>
    </>
  )
}

function AccountSection() {
  const { isSignin, setIsSignin } = useContext(NavbarContext)

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
          title="User"
          id={`${styles['basic-nav-dropdown']}`}
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
      const decodedToken = jwtDecode(token)
      console.log(Date.now(), decodedToken.exp)
      if (Date.now() >= decodedToken.exp * 1000) {
        Cookies.remove('authToken')
        window.location.href = '/'
        setIsSignin(false)
        return
      }
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
