'use client';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './Home/page';

export default function HomePage() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '20px' }}>
       <Home />
      
    </div>
  );
}
