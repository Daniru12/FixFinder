'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('../login');
    } else if (user.role !== 'ROLE_ADMIN') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'ROLE_ADMIN') {
    return <p className="text-gray-500 mt-10 text-center">Checking access...</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-8 text-lg">Welcome, {user.username}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => router.push('./users')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded shadow"
        >
          User Management
        </button>
        <button
          onClick={() => router.push('./bookings')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded shadow"
        >
          Booking Management
        </button>
        <button
          onClick={() => router.push('./services')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded shadow"
        >
          Service Management
        </button>
      </div>

      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
      >
        Logout
      </button>
    </div>
  );
}
