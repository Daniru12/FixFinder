'use client';
import React, { useEffect, useState } from "react";
import { Search, Filter, Calendar, User, Package, Clock, DollarSign, CheckCircle, XCircle, Edit, Trash2, Eye } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'

  const token = localStorage.getItem("token"); // JWT token

  useEffect(() => {
    if (!token) {
      console.error("No token found, please login first.");
      setError("Please login to view your bookings.");
      setLoading(false);
      return;
    }

    // Decode token to get role (simple base64 decode of JWT payload)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role || "");
    } catch (err) {
      console.error("Failed to parse token:", err);
      setError("Invalid authentication token. Please login again.");
      setLoading(false);
      return;
    }

    // Fetch bookings for the logged-in user
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
  }, [token]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
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
      
      // Clear any existing error
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
      
      // Clear any existing error
      setError("");
    } catch (err) {
      console.error("Error removing booking:", err);
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED": return "bg-blue-100 text-blue-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED": return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
        <p className="text-gray-600">Manage and track all your bookings in one place</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer, service, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">This Week</option>
              <option value="MONTH">This Month</option>
            </select>

            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3 py-2 text-sm ${viewMode === "cards" ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-700"}`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 text-sm border-l border-gray-300 ${viewMode === "table" ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-700"}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === "PENDING").length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === "CONFIRMED").length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Display */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Booking #{booking.id}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">{booking.status}</span>
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-center mb-3">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">{booking.customer.fullName}</span>
                </div>

                {/* Service Info */}
                <div className="flex items-center mb-3">
                  <Package className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{booking.service.name}</span>
                </div>

                {/* Dates */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-2" />
                    <span>Booked: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-900 font-medium">
                    <Clock className="w-3 h-3 mr-2" />
                    <span>Scheduled: {new Date(booking.scheduledDate).toLocaleString()}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-lg font-bold text-gray-900">Rs. {booking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                {role === "PROVIDER" && (
                  <div className="flex space-x-2 pt-4 border-t border-gray-100">
                    <button className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </button>
                    <button className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                    {booking.status !== "CONFIRMED" && (
                      <button
                        onClick={() => confirmBooking(booking.id)}
                        className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => removeBooking(booking.id)}
                      className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  {role === "PROVIDER" && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.customer.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(booking.scheduledDate).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rs. {booking.totalPrice.toLocaleString()}</td>
                    {role === "PROVIDER" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        {booking.status !== "CONFIRMED" && (
                          <button
                            onClick={() => confirmBooking(booking.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeBooking(booking.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
  );
}