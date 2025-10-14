"use client";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // 👈 Add this

export default function ServiceDetailsPage({ params }) {
  const { id } = use(params);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // 👈 Initialize router

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/services/user/${id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      )
      .then((res) => {
        setService(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [id]);

  const handleBookNow = () => {
    router.push(`/Booking/${id}`);
  };

  const handleWriteReview = () => {
    router.push(`/review/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-700 text-lg font-medium">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Error</h2>
          </div>
          <p className="text-gray-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-4xl">?</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Service Not Found</h2>
          <p className="text-gray-600">No service found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Service Details
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Image Section */}
          {service.images && (
            <div className="relative h-96 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <img
                src={service.images}
                alt={service.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <h2 className="text-4xl font-bold text-white mb-2">{service.name}</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    service.status === 'active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {service.status}
                  </span>
                  <span className="px-4 py-1.5 bg-teal-500/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                    {service.category}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            {/* Price Banner */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm font-medium mb-1">Service Price</p>
                  <p className="text-4xl font-bold">${service.price}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl">💰</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-100">
                <p className="text-teal-600 text-sm font-semibold mb-1 uppercase tracking-wide">ID</p>
                <p className="text-gray-800 font-mono text-lg">{service.id}</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-100">
                <p className="text-teal-600 text-sm font-semibold mb-1 uppercase tracking-wide">Category</p>
                <p className="text-gray-800 text-lg font-medium">{service.category}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-teal-600 font-bold text-lg mb-3 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3 text-white">
                  📝
                </span>
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>

            {/* Provider Info */}
            {service.user && (
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 text-white mb-6">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 backdrop-blur-sm">
                    👤
                  </span>
                  Provider
                </h3>
                <p className="text-xl font-semibold">
                  {service.user.username || service.user.email || service.user.name}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleBookNow}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
              >
                📅 Book Now
              </button>
              <button
                onClick={handleWriteReview}
                className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                ✍️ Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}