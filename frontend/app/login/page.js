'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post('/auth/login', { username, password });
    const { token, role } = res.data;

    login(token); // Save token in context

    if (role === 'ROLE_ADMIN') {
      router.push('/admin-dashboard');
    } else {
      router.push('/');
    }
  } catch (err) {
    alert('Login failed');
  }
};


  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
