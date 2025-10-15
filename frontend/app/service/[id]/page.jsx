"use client";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import BookingButton from "../../components/BookingButton";
import Reviews from "../../components/review";
import { 
  Star, 
  Clock, 
  Shield, 
  CheckCircle, 
  MapPin, 
  User, 
  ArrowLeft,
  Image as ImageIcon,
  Calendar,
  DollarSign
} from "lucide-react";

export default function ServiceDetailsPage({ params }) {
  const { id } = use(params);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const router = useRouter();

  const handleBookNow = () => {
    router.push(`/Booking/${id}`);
  };

  const handleWriteReview = () => {
    router.push(`/review?serviceId=${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/services/user/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      })
      .then((res) => {
        setService(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse opacity-10 mx-auto"></div>
          </div>
          <p className="text-gray-700 font-medium text-lg mt-4">Loading service details...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Error</h2>
              <p className="text-gray-600 text-sm">Failed to load service</p>
            </div>
          </div>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-4xl">?</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Create image array from service images
  const serviceImages = service.images 
    ? (Array.isArray(service.images) ? service.images : [service.images])
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Services</span>
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Gallery & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="relative h-96 lg:h-[500px] overflow-hidden">
                  {serviceImages.length > 0 ? (
                    <img
                      src={serviceImages[activeImage]}
                      alt={service.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No Image Available</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${
                        service.status === "active" 
                          ? "bg-green-500/90 text-white border-green-600" 
                          : "bg-gray-500/90 text-white border-gray-600"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-blue-500/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-blue-600">
                      {service.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Thumbnails */}
              {serviceImages.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {serviceImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        activeImage === index 
                          ? 'border-blue-500 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${service.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section - Moved to left column below image */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Customer Reviews
                </h2>
                <button
                  onClick={handleWriteReview}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  <span>✍️</span>
                  <span>Write Review</span>
                </button>
              </div>
              <Reviews serviceId={id} />
            </div>
          </div>

          {/* Right Column - Service Details */}
          <div className="space-y-6">
            {/* Service Header */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                {service.name}
              </h1>
              
              {/* Price Section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-2">Service Price</p>
                    <div className="flex items-baseline space-x-2">
                      <DollarSign className="w-6 h-6" />
                      <p className="text-4xl font-bold">{service.price}</p>
                    </div>
                    <p className="text-blue-100 text-sm mt-2">All inclusive pricing</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl">💎</span>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide">Status</p>
                      <p className="text-gray-800 font-medium capitalize">{service.status}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-green-600 text-xs font-semibold uppercase tracking-wide">Category</p>
                      <p className="text-gray-800 font-medium">{service.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service ID */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-600 text-sm font-semibold mb-1 uppercase tracking-wide">Service ID</p>
                <p className="text-gray-800 font-mono text-sm">{service.id}</p>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">📝</span>
                </div>
                Service Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>

            {/* Provider Info Card */}
            {service.user && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Service Provider
                </h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {service.user.username?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {service.user.username || service.user.email || service.user.name}
                      </p>
                      <p className="text-green-600 font-medium text-sm">Verified Provider</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200">
                <BookingButton service={service} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}