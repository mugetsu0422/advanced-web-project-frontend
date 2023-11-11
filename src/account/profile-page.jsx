import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import '../index.css';

const Profile = ({ name, email, msg }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email } = formData;

    if (name.length === 0 && email.length === 0) {
      alert('Vui lòng nhập tên hoặc email');
      return;
    }

    if (email.length === 0) {
    } else {
      fetch(`/account/is-available?email=${email}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data) {
            alert(`${email} đã tồn tại.`);
          } else {

          }
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  return (
    <div className="profile">
      <div className="row">
        <div className="col-sm-3">
          <Card>
            <Card.Header className="profile-item student-name">{name}</Card.Header>
            <ul className="list-group list-group-flush">
              <Link to="/student/profile" className="profile-item">
                <li className="list-group-item active-menu">Hồ sơ</li>
              </Link>
              <Link to="/student/security" className="profile-item">
                <li className="list-group-item">Bảo mật</li>
              </Link>
              <Link to="/student/watchlist" className="profile-item">
                <li className="list-group-item">Watchlist</li>
              </Link>
              <Link to="/student/my-courses" className="profile-item">
                <li className="list-group-item">Khóa học đã mua</li>
              </Link>
            </ul>
          </Card>
        </div>

        <div className="col-sm-9 pb-4">
          <p className="title text-center">Hồ sơ</p>
          <form className="profile-form" onSubmit={handleSubmit}>
            {msg && (
              <Alert variant="success" className="text-center pr-0" dismissible>
                {msg}
              </Alert>
            )}
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
