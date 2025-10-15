'use client';
import React, { useEffect, useState, useContext } from "react";
import { Search, Filter, Calendar, User, Package, Clock, DollarSign, CheckCircle, XCircle, Edit, Trash2, Eye, MapPin, Phone, Mail, Star, MessageSquare, Download, Share2, MoreVertical } from "lucide-react";
import { AuthContext } from '../../context/AuthContext';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("cards");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (!token || !user) {
      console.error("No token or user found, please login first.");
     
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/bookings/my", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Unauthorized. Please login again.");
          } else if (res.status === 403) {
            throw new Error("Access denied.");
          } else {
            throw new Error("Failed to fetch bookings.");
          }
        }
        return res.json();
      })
      .then((data) => {
        setBookings(data || []);
        setFilteredBookings(data || []);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token, user]);

  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (dateFilter !== "ALL") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.scheduledDate);
        const bookingDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
        
        switch (dateFilter) {
          case "TODAY":
            return bookingDay.getTime() === today.getTime();
          case "WEEK":
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return bookingDay >= today && bookingDay <= weekFromNow;
          case "MONTH":
            const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
            return bookingDay >= today && bookingDay <= monthFromNow;
          default:
            return true;
        }
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const confirmBooking = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/confirm/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CONFIRMED" }),
      });

      if (res.status === 403) {
        throw new Error("You are not authorized to confirm this booking.");
      }

      if (res.status === 404) {
        throw new Error("Booking not found.");
      }

      if (!res.ok) {
        throw new Error("Failed to confirm booking.");
      }

      const updatedBooking = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updatedBooking : b))
      );

      setError("");
    } catch (err) {
      console.error("Error confirming booking:", err);
      setError(err.message);
    }
  };

  const removeBooking = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 403) {
        throw new Error("You are not authorized to delete this booking.");
      }

      if (res.status === 404) {
        throw new Error("Booking not found.");
      }

      if (!res.ok) {
        throw new Error("Failed to remove booking.");
      }

      setBookings((prev) => prev.filter((b) => b.id !== id));
      setError("");
      setShowDetailsModal(false);
    } catch (err) {
      console.error("Error removing booking:", err);
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-700 border-amber-200";
      case "CONFIRMED": return "bg-blue-50 text-blue-700 border-blue-200";
      case "COMPLETED": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED": return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED": return <XCircle className="w-4 h-4" />;
      case "COMPLETED": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getServiceImage = (serviceName) => {
    const images = {
      'cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      'plumbing': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
      'electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      'painting': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
      'carpentry': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
      'default': 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400'
    };
    
    const key = Object.keys(images).find(k => serviceName?.toLowerCase().includes(k));
    return images[key] || images.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Glassmorphism */}
        <div className="mb-8 backdrop-blur-md bg-white/70 rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Service Appointments
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Manage and track all your service bookings
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button className="px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-gray-200">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                New Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 backdrop-blur-md bg-red-50/80 border-2 border-red-200 rounded-2xl p-4 shadow-lg animate-pulse">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="group backdrop-blur-md bg-white/70 rounded-2xl p-5 shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                  Active
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group backdrop-blur-md bg-white/70 rounded-2xl p-5 shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{bookings.filter(b => b.status === "PENDING").length}</p>
                <p className="text-xs text-amber-600 mt-1">Awaiting confirmation</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group backdrop-blur-md bg-white/70 rounded-2xl p-5 shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900">{bookings.filter(b => b.status === "CONFIRMED").length}</p>
                <p className="text-xs text-blue-600 mt-1">Ready to go</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group backdrop-blur-md bg-white/70 rounded-2xl p-5 shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">Rs. {bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">All time</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search with Animation */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search appointments by customer, service, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>

            {/* Filters with Better Styling */}
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-gray-700"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">⏳ Pending</option>
                <option value="CONFIRMED">✓ Confirmed</option>
                <option value="COMPLETED">✓ Completed</option>
                <option value="CANCELLED">✗ Cancelled</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-gray-700"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">📅 Today</option>
                <option value="WEEK">📆 This Week</option>
                <option value="MONTH">🗓️ This Month</option>
              </select>

              <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-5 py-3 text-sm font-medium transition-all ${
                    viewMode === "cards"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-5 py-3 text-sm font-medium border-l-2 border-gray-200 transition-all ${
                    viewMode === "table"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bookings Display */}
        {filteredBookings.length === 0 ? (
          <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/20 p-16 text-center">
            <div className="inline-block p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
              <Calendar className="w-16 h-16 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
              Create New Appointment
            </button>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="group backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                {/* Service Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getServiceImage(booking.service.name)}
                    alt={booking.service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 backdrop-blur-md ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1.5">{booking.status}</span>
                    </span>
                  </div>

                  {/* Booking ID */}
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-lg">
                      #{booking.id}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Service Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    {booking.service.name}
                  </h3>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {booking.customer.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{booking.customer.fullName}</p>
                      <p className="text-xs text-gray-500">Customer</p>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Booked:</span>
                      <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-indigo-50 p-2 rounded-lg">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-gray-900">
                        {new Date(booking.scheduledDate).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mb-4">
                    <span className="text-sm font-medium text-gray-600">Total Amount</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Rs. {booking.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    
                    {/* Show Edit button for PENDING status for all users */}
                    {booking.status === "PENDING" && (
                      <button
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium shadow-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                    
                    {/* Provider-specific actions */}
                    {(user?.role === "PROVIDER" || user?.role === "ROLE_PROVIDER") && (
                      <>
                        {booking.status !== "CONFIRMED" && booking.status !== "COMPLETED" && (
                          <button
                            onClick={() => confirmBooking(booking.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all font-medium shadow-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => removeBooking(booking.id)}
                          className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    {/* Consumer can cancel pending bookings */}
                    {(user?.role === "CUSTOMER" || user?.role === "ROLE_CUSTOMER" || (!user?.role?.includes("PROVIDER"))) && 
                     booking.status === "PENDING" && (
                      <button
                        onClick={() => removeBooking(booking.id)}
                        className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Enhanced Table View */
          <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Appointment</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Scheduled</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 bg-indigo-100 rounded-full text-sm font-bold text-indigo-700">
                          #{booking.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {booking.customer.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{booking.customer.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.service.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(booking.scheduledDate).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1.5">{booking.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        Rs. {booking.totalPrice.toLocaleString()}
                      </td>
                      {(user?.role === "PROVIDER" || user?.role === "ROLE_PROVIDER") && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {booking.status === "PENDING" && (
                              <button
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit Appointment"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {booking.status !== "CONFIRMED" && booking.status !== "COMPLETED" && (
                              <button
                                onClick={() => confirmBooking(booking.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Confirm Booking"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => removeBooking(booking.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                      
                      {/* Consumer Actions */}
                      {(user?.role === "CUSTOMER" || user?.role === "ROLE_CUSTOMER" || (!user?.role?.includes("PROVIDER"))) && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {booking.status === "PENDING" && (
                              <>
                                <button
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit Appointment"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeBooking(booking.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Cancel Booking"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Image */}
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img
                src={getServiceImage(selectedBooking.service.name)}
                alt={selectedBooking.service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg"
              >
                <XCircle className="w-6 h-6 text-gray-700" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-bold text-gray-900 shadow-lg">
                    Appointment #{selectedBooking.id}
                  </span>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 backdrop-blur-md ${getStatusColor(selectedBooking.status)}`}>
                    {getStatusIcon(selectedBooking.status)}
                    <span className="ml-2">{selectedBooking.status}</span>
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedBooking.service.name}</h2>
                <p className="text-white/90 text-sm">Complete appointment details and information</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Customer Information
                </h3>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {selectedBooking.customer.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{selectedBooking.customer.fullName}</p>
                      <p className="text-sm text-gray-600">Valued Customer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 pt-3 border-t border-indigo-200">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm">{selectedBooking.customer.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm">{selectedBooking.customer.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-600" />
                  Service Details
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Service Name</span>
                    <span className="font-bold text-gray-900">{selectedBooking.service.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">{selectedBooking.service.category || 'General'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                    <span className="text-gray-600">Service Description</span>
                  </div>
                  <p className="text-sm text-gray-700 bg-white/50 p-3 rounded-xl">
                    {selectedBooking.service.description || 'Professional service provided by experienced technicians.'}
                  </p>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Schedule Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Booking Date</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 ml-11">
                      {new Date(selectedBooking.bookingDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-indigo-500 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Scheduled For</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 ml-11">
                      {new Date(selectedBooking.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                      <br />
                      <span className="text-indigo-600">
                        {new Date(selectedBooking.scheduledDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  Payment Information
                </h3>
                <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Service Price</span>
                    <span className="text-xl font-bold text-gray-900">Rs. {selectedBooking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-purple-200">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Rs. {selectedBooking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                  <MessageSquare className="w-5 h-5" />
                  Contact {(user?.role === "PROVIDER" || user?.role === "ROLE_PROVIDER") ? 'Customer' : 'Provider'}
                </button>
                
                {/* Edit button for pending appointments */}
                {selectedBooking.status === "PENDING" && (
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                    <Edit className="w-5 h-5" />
                    Edit Appointment
                  </button>
                )}
                
                {/* Provider-specific actions */}
                {(user?.role === "PROVIDER" || user?.role === "ROLE_PROVIDER") && selectedBooking.status !== "CONFIRMED" && selectedBooking.status !== "COMPLETED" && (
                  <button
                    onClick={() => {
                      confirmBooking(selectedBooking.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Confirm Booking
                  </button>
                )}
                
                {/* Delete/Cancel button - show for providers always, for consumers only if pending */}
                {((user?.role === "PROVIDER" || user?.role === "ROLE_PROVIDER") || selectedBooking.status === "PENDING") && (
                  <button
                    onClick={() => removeBooking(selectedBooking.id)}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}