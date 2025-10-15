'use client';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Wrench, 
  CheckCircle, 
  XCircle,
  Edit3,
  Save,
  X,
  Shield,
  Briefcase,
  Clock
} from 'lucide-react';

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
          username: profile.username,
          email: profile.email,
          role: profile.role,
          serviceType: profile.serviceType,
          available: profile.available,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse opacity-10 mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium text-lg">Loading your profile...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          
            
          </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Enhanced Header Section */}
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-8 py-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                    <span className="text-4xl font-bold text-white">
                      {profile.fullName?.charAt(0) || profile.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white ${
                    profile.available 
                      ? 'bg-emerald-500' 
                      : 'bg-rose-500'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    {profile.fullName || profile.username}
                  </h2>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <span className="flex items-center text-sm bg-white/10 px-3 py-1 rounded-full">
                      @{profile.username}
                    </span>
                    <span className="flex items-center text-sm bg-white/10 px-3 py-1 rounded-full">
                      <Shield className="w-3 h-3 mr-1" />
                      {profile.role}
                    </span>
                  </div>
                </div>
              </div>
              {!isEditing && (
              <button
                onClick={() => router.push('/Booking/Bookings')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                My Bookings
              </button>
            )}
              
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30 hover:border-white/40 hover:scale-105"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Personal Information Section */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Full Name */}
                    <div className="group">
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Full Name</label>
                      <div className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                        isEditing 
                          ? 'bg-blue-50 border-2 border-blue-100' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <div className={`p-2 rounded-lg ${
                          isEditing ? 'bg-blue-100' : 'bg-gray-200'
                        }`}>
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="fullName"
                            value={editForm.fullName}
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent text-gray-900 font-medium outline-none placeholder-gray-400"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <span className="text-gray-900 font-medium">
                            {profile.fullName || 'Not provided'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="group">
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Email Address</label>
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50">
                        <div className="p-2 rounded-lg bg-gray-200">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-gray-900 font-medium">{profile.email}</span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="group">
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Phone Number</label>
                      <div className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                        isEditing 
                          ? 'bg-blue-50 border-2 border-blue-100' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <div className={`p-2 rounded-lg ${
                          isEditing ? 'bg-blue-100' : 'bg-gray-200'
                        }`}>
                          <Phone className="w-4 h-4 text-blue-600" />
                        </div>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent text-gray-900 font-medium outline-none placeholder-gray-400"
                            placeholder="Enter phone number"
                          />
                        ) : (
                          <span className="text-gray-900 font-medium">
                            {profile.phone || 'Not provided'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="group">
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Address</label>
                      <div className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                        isEditing 
                          ? 'bg-blue-50 border-2 border-blue-100' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <div className={`p-2 rounded-lg ${
                          isEditing ? 'bg-blue-100' : 'bg-gray-200'
                        }`}>
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            value={editForm.address}
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent text-gray-900 font-medium outline-none placeholder-gray-400"
                            placeholder="Enter your address"
                          />
                        ) : (
                          <span className="text-gray-900 font-medium">
                            {profile.address || 'Not provided'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Details Section */}
              <div className="space-y-6">
                {/* Role Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    Account Role
                  </h3>
                  <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${
                    profile.role === 'Admin' 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : profile.role === 'Professional' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {profile.role}
                  </div>
                </div>

                {/* Service Type Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                    Service Type
                  </h3>
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Wrench className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-900 font-medium">{profile.serviceType}</span>
                  </div>
                </div>

                {/* Availability Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Availability Status
                  </h3>
                  <div className={`flex items-center space-x-3 p-3 rounded-xl ${
                    profile.available 
                      ? 'bg-emerald-50 border border-emerald-200' 
                      : 'bg-rose-50 border border-rose-200'
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      profile.available ? 'bg-emerald-100' : 'bg-rose-100'
                    }`}>
                      {profile.available ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                    <span className={`font-semibold ${
                      profile.available ? 'text-emerald-800' : 'text-rose-800'
                    }`}>
                      {profile.available ? 'Available for Work' : 'Currently Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:from-blue-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-gray-300"
                >
                  <X className="w-5 h-5 mr-2" />
                  Discard Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}