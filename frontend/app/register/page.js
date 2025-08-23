'use client';
import { useState } from 'react';
import API from '../utils/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '', fullName: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('User registered. Please login.');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
