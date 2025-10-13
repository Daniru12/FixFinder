'use client';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { userAPI } from '../../utils/api';

export default function ProviderDashboard() {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    address: '',
    phone: '',
    serviceType: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.username && token) {
      loadProfile();
    }
  }, [user, token, router]);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile(user.username, token);
      setProfile(response.data);
      setEditForm({
        fullName: response.data.fullName || '',
        address: response.data.address || '',
        phone: response.data.phone || '',
        serviceType: response.data.serviceType || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      fullName: profile.fullName || '',
      address: profile.address || '',
      phone: profile.phone || '',
      serviceType: profile.serviceType || ''
    });
  };

  const handleSave = async () => {
    if (!profile?.id || !token) return;
    
    setIsUpdating(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/users/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...profile,
          fullName: editForm.fullName,
          address: editForm.address,
          phone: editForm.phone,
          serviceType: editForm.serviceType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityToggle = async () => {
    if (!profile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newAvailability = !profile.available;
      await userAPI.updateAvailability(newAvailability, token);
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        available: newAvailability
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <p className="text-center mt-10">Loading provider details...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Provider Dashboard
            </h1>
            <p className="text-gray-600">Welcome, {profile.fullName || user.username}</p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Availability Status */}
      <div className="p-6 bg-white shadow rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Availability Status</h2>
            <p className="text-sm text-gray-600 mt-1">
              Toggle your availability to let customers know if you're accepting new bookings
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${profile.available ? 'text-green-600' : 'text-red-600'}`}>
              {profile.available ? 'Available' : 'Unavailable'}
            </span>
            <button
              onClick={handleAvailabilityToggle}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                profile.available ? 'bg-teal-600' : 'bg-gray-200'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.available ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Provider Details */}
      <div className="p-6 bg-white shadow rounded-xl mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Provider Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Username:</span> {profile.username}
          </div>
          
          <div>
            <span className="font-medium">Full Name:</span>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={editForm.fullName}
                onChange={handleInputChange}
                className="ml-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter full name"
              />
            ) : (
              <span className="ml-2">{profile.fullName}</span>
            )}
          </div>
          
          <div>
            <span className="font-medium">Email:</span> {profile.email}
          </div>
          
          <div>
            <span className="font-medium">Phone:</span>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                className="ml-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter phone number"
              />
            ) : (
              <span className="ml-2">{profile.phone}</span>
            )}
          </div>
          
          <div>
            <span className="font-medium">Service Type:</span>
            {isEditing ? (
              <input
                type="text"
                name="serviceType"
                value={editForm.serviceType}
                onChange={handleInputChange}
                className="ml-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter service type"
              />
            ) : (
              <span className="ml-2">{profile.serviceType}</span>
            )}
          </div>
          
          <div>
            <span className="font-medium">Address:</span>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editForm.address}
                onChange={handleInputChange}
                className="ml-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter address"
              />
            ) : (
              <span className="ml-2">{profile.address}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="font-medium">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              profile.available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {profile.available ? 'Available for bookings' : 'Not accepting bookings'}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-sm font-medium text-gray-500">Current Status</h2>
          <div className="flex items-center mt-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${profile.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className={`text-lg font-bold ${profile.available ? 'text-green-600' : 'text-red-600'}`}>
              {profile.available ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
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
      <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
  <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Services</h3>
  <p className="text-gray-600 text-sm mb-4">
    Add, edit, or remove the services you provide.
  </p>
  <button
    onClick={() => router.push('./providerServices')}
    className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700"
  >
    Go to Services
  </button>
</div>

    </div>
  );
}
