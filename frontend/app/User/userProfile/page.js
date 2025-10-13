'use client';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    address: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.username && token) {
      fetch(`http://localhost:8080/users/profile/${user.username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch profile');
          }
          return res.json();
        })
        .then((data) => {
          setProfile(data);
          setEditForm({
            fullName: data.fullName || '',
            address: data.address || '',
            phone: data.phone || ''
          });
        })
        .catch((err) => console.error(err));
    }
  }, [user, token, router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      fullName: profile.fullName || '',
      address: profile.address || '',
      phone: profile.phone || ''
    });
  };

  const handleSave = async () => {
    if (!profile?.id || !token) return;
    
    setIsLoading(true);
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
          phone: editForm.phone
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
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
          <p className="mt-4 text-cyan-700 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-t-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-3xl font-bold text-cyan-600">
                  {profile.fullName?.charAt(0) || profile.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{profile.fullName || profile.username}</h1>
                <p className="text-cyan-100 text-sm mt-1">@{profile.username}</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="px-6 py-2.5 bg-white text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
              <div className="flex items-center space-x-2 text-gray-800">
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{profile.email}</span>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</label>
              <div className="flex items-center space-x-2">
                <span className="px-4 py-1.5 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 rounded-full text-sm font-semibold">
                  {profile.role}
                </span>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter full name"
                />
              ) : (
                <p className="text-gray-800 font-medium py-2">{profile.fullName || 'Not provided'}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-800">
                  <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">{profile.phone || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Service Type</label>
              <div className="flex items-center space-x-2 text-gray-800">
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{profile.serviceType}</span>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Availability</label>
              <div className="flex items-center space-x-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  profile.available 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {profile.available ? '✓ Available' : '✗ Unavailable'}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter address"
                />
              ) : (
                <div className="flex items-start space-x-2 text-gray-800">
                  <svg className="w-5 h-5 text-cyan-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{profile.address || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}