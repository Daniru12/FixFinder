'use client';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProviderDashboard() {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.username && token) {
      fetch(`http://localhost:8080/users/profile/${user.username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch profile');
          return res.json();
        })
        .then((data) => setProfile(data))
        .catch((err) => console.error(err));
    }
  }, [user, token, router]);

  if (!profile) {
    return <p className="text-center mt-10">Loading provider details...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Provider Dashboard
        </h1>
        <p className="text-gray-600">Welcome, {profile.fullName || user.username}</p>
      </div>

      {/* Provider Details */}
      <div className="p-6 bg-white shadow rounded-xl mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Provider Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p><span className="font-medium">Username:</span> {profile.username}</p>
          <p><span className="font-medium">Full Name:</span> {profile.fullName}</p>
          <p><span className="font-medium">Email:</span> {profile.email}</p>
          <p><span className="font-medium">Phone:</span> {profile.phone}</p>
          <p><span className="font-medium">Service Type:</span> {profile.serviceType}</p>
          <p><span className="font-medium">Address:</span> {profile.address}</p>
          <p><span className="font-medium">Available:</span> {profile.available ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-sm font-medium text-gray-500">Total Services</h2>
          <p className="text-2xl font-bold text-gray-800">12</p>
        </div>
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-sm font-medium text-gray-500">Active Bookings</h2>
          <p className="text-2xl font-bold text-gray-800">5</p>
        </div>
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-sm font-medium text-gray-500">Pending Requests</h2>
          <p className="text-2xl font-bold text-gray-800">3</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Services</h3>
          <p className="text-gray-600 text-sm mb-4">Add, edit, or remove the services you provide.</p>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700">
            Go to Services
          </button>
        </div>

        <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">View Bookings</h3>
          <p className="text-gray-600 text-sm mb-4">Check active and past bookings from customers.</p>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700">
            Go to Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
