import { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ setAuthToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });

      
      const token = response.data.token;
      if (!token) throw new Error("No token received");

      localStorage.setItem('token', token);
      setAuthToken(token);
      window.location.href = '/dashboard';
    }
    catch (error) {
      console.error('Login failed:', error.response?.data?.message || "Unknown error");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="login-footer">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;