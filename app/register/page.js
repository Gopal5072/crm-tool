// app/register/page.jsx or wherever your register page is

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Sales',
    founderCode: '',
  });

  const [showFounderCode, setShowFounderCode] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'role') {
      setShowFounderCode(value === 'Founder');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/register', formData);
      if (response.status === 201) {
        router.push('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          value={formData.fullName}
          required
        />
        <br />
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <br />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          value={formData.confirmPassword}
          required
        />
        <br />
        <select
          name="role"
          onChange={handleChange}
          value={formData.role}
          required
        >
          <option value="Sales">Sales</option>
          <option value="Founder">Founder</option>
        </select>
        <br />
        {showFounderCode && (
          <input
            type="text"
            name="founderCode"
            placeholder="Enter Founder Secret Code"
            onChange={handleChange}
            value={formData.founderCode}
            required
            style={{
              border: '1px solid black',
              padding: '5px',
              marginTop: '8px',
              backgroundColor: '#f1f1f1',
            }}
          />
        )}
        <br />
        <button type="submit" style={{ marginTop: '10px' }}>Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RegisterPage;
