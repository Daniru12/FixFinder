'use client';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

export default function HomePage() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Home Page</h1>
      {user ? (
        <p>You are logged in as {user.username} with role {user.role}</p>
      ) : (
        <p>Please login to access features</p>
      )}
    </div>
  );
}
