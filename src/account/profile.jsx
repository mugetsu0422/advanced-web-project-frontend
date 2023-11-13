import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import styles from './profile.module.css';

const Profile = ({ name, email, msg }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, phone, address } = formData;

  };

  return (
    <div className={styles.profile}>
    <div className={`row ${styles.row}`}>
      <div className={`col-sm-9 pb-4 ${styles.colSm9}`}>
        <p className={`title text-center ${styles.title}`}>Profile</p>
        <form className={`profile-form ${styles.profileForm}`} onSubmit={handleSubmit}>
          {msg && (
            <Alert variant="success" className={`text-center pr-0 ${styles.alert}`} dismissible>
              {msg}
            </Alert>
            )}
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtName">Username</Form.Label>
                  <Form.Control
                    type="text"
                    id="txtName"
                    placeholder={name}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.formControl}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtEmail">Email</Form.Label>
                  <Form.Control
                    type="email"
                    id="txtEmail"
                    placeholder={email}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.formControl}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtPassword">Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="txtPassword"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={styles.formControl}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtPhone">Telephone</Form.Label>
                  <Form.Control
                    type="text"
                    id="txtPhone"
                    value={formData.phone}
                    onChange={(e) => {
                      const input = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, phone: input });
                    }}
                    className={styles.formControl}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtAddress">Address</Form.Label>
                  <Form.Control
                    type="text"
                    id="txtAddress"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={styles.formControl}
                  />
                </Form.Group>
              </div>
            </div>
            <button type="submit" className={styles.submitBtn}>
              SAVE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
