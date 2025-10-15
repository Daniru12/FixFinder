'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../utils/api';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'ROLE_USER',
    serviceType: '',
    address: '',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    isValid: false
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];
    
    if (password.length === 0) {
      return { score: 0, feedback: '', isValid: false };
    }
    
    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Lowercase letter');
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Uppercase letter');
    }
    
    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Number');
    }
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Special character');
    }
    
    // Determine strength level
    let strengthText = '';
    let isValid = false;
    
    if (score <= 2) {
      strengthText = 'Weak';
    } else if (score === 3) {
      strengthText = 'Fair';
    } else if (score === 4) {
      strengthText = 'Good';
      isValid = true;
    } else if (score === 5) {
      strengthText = 'Strong';
      isValid = true;
    }
    
    return {
      score,
      feedback: feedback.length > 0 ? `Missing: ${feedback.join(', ')}` : '',
      isValid,
      strengthText
    };
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    // Check password strength when password changes
    if (e.target.name === 'password') {
      const strength = checkPasswordStrength(e.target.value);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Check password strength before submission
    if (form.password && !passwordStrength.isValid) {
      setError('Password is too weak. Please make it stronger.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await API.post('/auth/register', form);

      if (res.status === 200 || res.status === 201) {
        setSuccess('Registration successful. Redirecting to login...');
        setForm({
          username: '',
          password: '',
          email: '',
          fullName: '',
          role: 'ROLE_USER',
          serviceType: '',
          address: '',
          phone: ''
        });

        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, rgba(6, 95, 70, 0.85) 0%, rgba(8, 145, 178, 0.85) 100%),
          url('/images/repair-bg.jpg') center/cover fixed
        `,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-12 h-12 bg-white/5 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-white/8 rounded-full animate-float animation-delay-4000"></div>
        <div className="absolute bottom-20 right-24 w-14 h-14 bg-white/3 rounded-full animate-float animation-delay-6000"></div>
      </div>

      {/* Main landscape container */}
      <div className="relative z-10 w-full max-w-7xl">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row min-h-[800px]">
            
            {/* Left side - Branding & Info */}
            <div className="lg:w-2/5 bg-gradient-to-br from-cyan-600 to-teal-700 text-white p-8 lg:p-12 flex flex-col justify-between">
              <div className="flex-1 flex flex-col justify-center">
                {/* Logo */}
                <div className="text-center lg:text-left mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-2xl border border-white/30">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                    </svg>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-3">FixFinder</h1>
                  <p className="text-cyan-100 text-lg font-light">Join Our Professional Repair Community</p>
                </div>

                {/* Features List */}
                <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Trusted Platform</h3>
                      <p className="text-cyan-100 text-sm">Verified professionals and secure service</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Multiple Roles</h3>
                      <p className="text-cyan-100 text-sm">Join as User, Provider, or Admin</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Instant Access</h3>
                      <p className="text-cyan-100 text-sm">Start immediately after registration</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom text */}
              <div className="text-center lg:text-left mt-8 pt-6 border-t border-white/20">
                <p className="text-cyan-100 text-sm">
                  Already trusted by 500+ professionals and 10,000+ customers worldwide
                </p>
              </div>
            </div>

            {/* Right side - Registration Form */}
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="max-w-2xl w-full mx-auto">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                  <p className="text-gray-600">Join FixFinder today and get started</p>
                </div>

                {/* Success message */}
                {success && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-emerald-700 text-sm">{success}</p>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl animate-shake">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition placeholder-gray-400 pr-12"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Username *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        placeholder="Choose a username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition placeholder-gray-400 pr-12"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition placeholder-gray-400 pr-12"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition placeholder-gray-400 pr-12"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Password - Full width */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Password *</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition placeholder-gray-400 pr-12"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {form.password && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Password Strength</span>
                          <span className={`text-sm font-semibold ${
                            passwordStrength.score <= 2
                              ? 'text-red-600'
                              : passwordStrength.score === 3
                              ? 'text-yellow-600'
                              : passwordStrength.score === 4
                              ? 'text-blue-600'
                              : 'text-green-600'
                          }`}>
                            {passwordStrength.strengthText}
                          </span>
                        </div>
                        
                        {/* Strength Bar */}
                        <div className="flex space-x-1 mb-3">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                level <= passwordStrength.score
                                  ? passwordStrength.score <= 2
                                    ? 'bg-red-400'
                                    : passwordStrength.score === 3
                                    ? 'bg-yellow-400'
                                    : passwordStrength.score === 4
                                    ? 'bg-blue-400'
                                    : 'bg-green-400'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        
                        {/* Password Requirements */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`flex items-center ${form.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {form.password.length >= 8 ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              )}
                            </svg>
                            8+ characters
                          </div>
                          <div className={`flex items-center ${/[a-z]/.test(form.password) ? 'text-green-600' : 'text-gray-400'}`}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {/[a-z]/.test(form.password) ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              )}
                            </svg>
                            Lowercase letter
                          </div>
                          <div className={`flex items-center ${/[A-Z]/.test(form.password) ? 'text-green-600' : 'text-gray-400'}`}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {/[A-Z]/.test(form.password) ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              )}
                            </svg>
                            Uppercase letter
                          </div>
                          <div className={`flex items-center ${/\d/.test(form.password) ? 'text-green-600' : 'text-gray-400'}`}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {/\d/.test(form.password) ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              )}
                            </svg>
                            Number
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Account Type *</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                    >
                      <option value="ROLE_USER">User / Customer</option>
                      <option value="ROLE_PROVIDER">Service Provider</option>
                      <option value="ROLE_ADMIN">Administrator</option>
                    </select>
                  </div>

                  {/* Service Type - Only show for providers */}
                  {form.role === 'ROLE_PROVIDER' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Service Type *</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="serviceType"
                          placeholder="e.g. Plumbing, Electrical, etc."
                          value={form.serviceType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition placeholder-gray-400 pr-12"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address - Full width */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        placeholder="Enter your complete address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition placeholder-gray-400 pr-12"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button - Full width */}
                  <div className="lg:col-span-2 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading || (form.password && !passwordStrength.isValid)}
                      className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Create Account
                          <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <a href="/login" className="text-cyan-600 hover:text-cyan-800 font-semibold transition-colors">
                      Sign In Here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}