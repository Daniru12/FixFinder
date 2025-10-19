'use client';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { userAPI, serviceAPI, bookingAPI } from '../../utils/api';
import { Package, Calendar, Clock, CheckCircle, TrendingUp, User } from 'lucide-react';

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
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.username && token) {
      loadProfile();
      fetchStats();
    }
  }, [user, token, router]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const [servicesRes, bookingsRes] = await Promise.all([
        serviceAPI.getMyServices(token).catch(() => ({ data: [] })),
        bookingAPI.getProviderBookings(token).catch(() => ({ data: [] }))
      ]);

      const services = servicesRes.data || [];
      const bookings = bookingsRes.data || [];

      setStats({
        totalServices: services.length,
        activeServices: services.filter(s => s.status === 'ACTIVE').length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
        confirmedBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
        completedBookings: bookings.filter(b => b.status === 'COMPLETED').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

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
          username: profile.username,
          email: profile.email,
          role: profile.role,
          available: profile.available,
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
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-teal-600" />
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Current Status */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className={`w-3 h-3 rounded-full ${profile.available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Current Status</h3>
            <p className={`text-2xl font-bold ${profile.available ? 'text-green-600' : 'text-red-600'}`}>
              {profile.available ? 'Online' : 'Offline'}
            </p>
          </div>

          {/* Total Services */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              {loadingStats ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
              ) : (
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800">{stats.totalServices}</p>
                </div>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Services</h3>
            <p className="text-xs text-gray-500">{stats.activeServices} active</p>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              {loadingStats ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
              ) : (
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800">{stats.totalBookings}</p>
                </div>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Bookings</h3>
            <p className="text-xs text-gray-500">{stats.confirmedBookings} confirmed</p>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              {loadingStats ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
              ) : (
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800">{stats.pendingBookings}</p>
                </div>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Requests</h3>
            <p className="text-xs text-gray-500">Awaiting response</p>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Completed Bookings */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-teal-600 mr-2" />
                  <h3 className="text-gray-700 text-sm font-medium">Completed</h3>
                </div>
                {loadingStats ? (
                  <div className="animate-pulse h-8 w-20 bg-teal-200 rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-teal-700">{stats.completedBookings}</p>
                )}
              </div>
              <div className="text-teal-600">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700 text-sm font-medium mb-2">Success Rate</h3>
                {loadingStats ? (
                  <div className="animate-pulse h-8 w-20 bg-blue-200 rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-blue-700">
                    {stats.totalBookings > 0 
                      ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
                      : 0}%
                  </p>
                )}
              </div>
              <div className="text-blue-600">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Services */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700 text-sm font-medium mb-2">Active Services</h3>
                {loadingStats ? (
                  <div className="animate-pulse h-8 w-20 bg-purple-200 rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-purple-700">{stats.activeServices}</p>
                )}
              </div>
              <div className="text-purple-600">
                <Package className="w-12 h-12" />
              </div>
            </div>
          </div>
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
