import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_number: '',
    password: '',
    password_confirmation: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {user: formData}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
        
      localStorage.setItem('token', response.data.token);
      window.location.href = '/';
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || "Unknown error");
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="text"
          name="contact_number"
          placeholder="Contact Number"
          value={formData.contact_number}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
          className="register-input"
        />
        <button type="submit" className="register-button">Register</button>
      </form>
      <p className="register-footer">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
