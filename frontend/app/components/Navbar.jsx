'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#333', color: '#fff' }}>
      <div>
        <Link href="/">Home</Link>
      </div>
      <div>
        {user ? (
          <>
            <span>Welcome, {user.username} ({user.role})</span>
            <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register" style={{ marginLeft: '10px' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
