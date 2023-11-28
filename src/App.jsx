import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import styles from './App.module.css'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { ThreeDotsVertical } from 'react-bootstrap-icons'
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types'

function AccountSection({ isSignin, setIsSignin }) {
  function showDropdown() { }
  function signOut() {
    Cookies.remove('authToken')
    Cookies.remove('socialToken')
    setIsSignin(false)
    window.location.href = '/'
  }

  if (isSignin) {
    return (
      <>
        <Dropdown className={`${styles['dropdown']}`}>
          <div className={`${styles['right']}`} onClick={showDropdown}>
            User
          </div>
          <ThreeDotsVertical
            className={`${styles['more-icon']}`}></ThreeDotsVertical>
          <div className={`${styles['dropdown-content']}`}>
            <Link
              className={`${styles['dropdown-item']} dropdown-item`}
              to={'/profile'}>
              Profile
            </Link>
            <Dropdown.Item
              className={`${styles['dropdown-item']}`}
              onClick={signOut}>
              Sign Out
            </Dropdown.Item>
          </div>
        </Dropdown>
      </>
    )
  } else {
    return (
      <>
        <Link to={'/signin'} className={`${styles['right']}`}>
          Log in
        </Link>
      </>
    )
  }
}

function App() {
  const [isSignin, setIsSignin] = useState(false)

  useEffect(() => {
    if (Cookies.get('authToken')) {
      setIsSignin(true)
    } else {
      setIsSignin(false)
    }
  }, [])

  return (
    <>
      <div className={`${styles['nav']}`}>
        <Link to={'/'} className={`${styles['left']}`}>
          MATCHA
        </Link>
        <nav className={`${styles['navbar']}`}>
          <Link to={'#'}>1</Link>
          <Link to={'#'}>2</Link>
          <Link to={'#'}>3</Link>
        </nav>
        <AccountSection
          isSignin={isSignin}
          setIsSignin={setIsSignin}></AccountSection>
      </div>
      <Outlet />
    </>
  )
}

export default App

AccountSection.propTypes = {
  isSignin: PropTypes.bool.isRequired,
  setIsSignin: PropTypes.func.isRequired,
}
