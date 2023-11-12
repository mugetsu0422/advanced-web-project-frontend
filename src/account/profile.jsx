import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import './profile.css';

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

    // Add your validation logic here

    // Add your fetch logic here

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Phone:', phone);
    console.log('Address:', address);
  };

  return (
    <div className="profile">
      <div className="row">
        <div className="col-sm-9 pb-4">
          <p className="title text-center">Hồ sơ</p>
          <form className="profile-form" onSubmit={handleSubmit}>
            {msg && (
              <Alert variant="success" className="text-center pr-0" dismissible>
                {msg}
              </Alert>
            )}
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtName">Tên</Form.Label>
                  <Form.Control
                    type="text"
                    id="txtName"
                    placeholder={name}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtPassword">Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    id="txtPassword"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtPhone">Điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    id="txtPhone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label htmlFor="txtAddress">Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    id="txtAddress"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="submit-button">
              <Button type="submit" className="btn btn-profile">
                Lưu
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
