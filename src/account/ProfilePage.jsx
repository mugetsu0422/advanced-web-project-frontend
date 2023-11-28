import { Outlet, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import styles from './Profile.module.css';

const ProfilePage = () => {
  const [activeMenu, setActiveMenu] = useState('detail');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div className={styles.profile}>
      <div className={`row`}>
        <div className="col-sm-3">
          <Card>
            <ul className="list-group list-group-flush">
              <Link to="detail"
                className={`${styles['profile-item']} ${activeMenu === 'detail' ? styles['active-menu'] : ''}`}
                onClick={() => handleMenuClick('detail')}
              >
                Profile
              </Link>
              <Link to="changePassword"
                className={`${styles['profile-item']} ${activeMenu === 'changePassword' ? styles['active-menu'] : ''}`}
                onClick={() => handleMenuClick('changePassword')}
              >
                Change password
              </Link>
            </ul>
          </Card>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePage;
