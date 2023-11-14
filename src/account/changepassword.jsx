import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Card, Alert } from 'react-bootstrap';
import styles from './profile.module.css';
import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../constants/constants';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (oldPassword === 'currentPassword') {
      console.log('Password change logic goes here');
    } else {
      setError('Old password is incorrect');
    }
  };

  return (
    <div className={styles.profile}>
      <div className={`row`}>
        <div className="col-sm-3">
          <Card>
            <ul className="list-group list-group-flush">
              <Link to="/profile" className={`${styles['profile-item']}`}>
                Profile
              </Link>
              <Link to="/profile/changePassword" className={`${styles['profile-item']} ${styles['active-menu']}`}>
                Change password
              </Link>
            </ul>
          </Card>
        </div>
        <div className={`col-sm-9 pb-4 ${styles['col-sm-9']}`}>
          <p className={`title text-center ${styles.title}`}>Change Password</p>
          <form className={`profile-form ${styles['profile-form']}`} onSubmit={handleSubmit}>
            {error && (
              <Alert variant="danger" className={`text-center pr-0 ${styles.alert}`} dismissible>
                {error}
              </Alert>
            )}
            <div className="row">
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label htmlFor="oldPassword">Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={styles['form-control']}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label htmlFor="newPassword">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles['form-control']}
                  />
                </Form.Group>
              </div>
            </div>
            <button type="submit" className={styles['submit-btn']}>
                SAVE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
