import { Outlet, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import styles from './Profile.module.css'
import axios from 'axios'
import Cookies from 'js-cookie'

const ProfilePage = () => {
  const [activeMenu, setActiveMenu] = useState('');
  const location = useLocation();
  const [role, setRole] = useState('')

  useEffect(() => {
    const token = Cookies.get('authToken')

    if (token) {
      axios
        .get(`${import.meta.env.VITE_SERVER_HOST}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRole(response.data.role)
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })
    }
  }, [])

  useEffect(() => {
    const pathname = location.pathname;
    const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1);
    
    switch (lastSegment) {
      case 'detail':
        setActiveMenu('detail');
        break;
      case 'change-password':
        setActiveMenu('change-password');
        break;
      case 'email-activation':
        setActiveMenu('email-activation');
        break;
      case 'map-studentid':
        setActiveMenu('map-studentid');
        break;
      default:
        setActiveMenu('detail');
        break;
    }
  }, [location]);

  return (
    <div className={styles.profile}>
      <div className={`row`}>
        <div className="col-sm-3">
          <Card>
            <ul className="list-group list-group-flush">
              <Link
                to="detail"
                className={`${styles['profile-item']} ${
                  activeMenu === 'detail' ? styles['active-menu'] : ''
                }`}>
                Profile
              </Link>
              <Link
                to="change-password"
                className={`${styles['profile-item']} ${
                  activeMenu === 'change-password' ? styles['active-menu'] : ''
                }`}>
                Change password
              </Link>
              <Link
                to="email-activation"
                className={`${styles['profile-item']} ${
                  activeMenu === 'email-activation' ? styles['active-menu'] : ''
                }`}>
                Email activation
              </Link>
              {role == 'student' && (<Link
                to="map-studentid"
                className={`${styles['profile-item']} ${
                  activeMenu === 'map-studentid' ? styles['active-menu'] : ''
                }`}>
                Map student ID
              </Link>)}
            </ul>
          </Card>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default ProfilePage
