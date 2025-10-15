'use client';

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  User,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  Clock,
  MapPin,
  Phone,
  Mail,
  Shield,
  Star,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { AuthContext } from '../../context/AuthContext';

export default function EnhancedBookingForm() {
  const params = useParams();
  const serviceIdFromUrl = params?.id;

  const [currentStep, setCurrentStep] = useState(1);
  const [service, setService] = useState(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState(null);

  const router = useRouter();
  const { user, token } = useContext(AuthContext);

  const customerId = user?.id;

  const steps = [
    { number: 1, title: "Service", icon: FileText, description: "Confirm service" },
    { number: 2, title: "Schedule", icon: Calendar, description: "Pick date & time" },
    { number: 3, title: "Review", icon: CreditCard, description: "Confirm details" },
    { number: 4, title: "Complete", icon: CheckCircle, description: "All done!" },
  ];

  useEffect(() => {
    if (!serviceIdFromUrl || !token) {
      setServiceLoading(false);
      return;
    }

    const fetchService = async () => {
      setServiceLoading(true);
      setServiceError(null);
      try {
        const res = await fetch(
          `http://localhost:8080/services/user/${serviceIdFromUrl}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to load service: ${res.status} ${res.statusText}`);
        }

        const serviceData = await res.json();
        setService(serviceData);
        setTotalPrice(serviceData.price || 0);
        setCurrentStep(2);
      } catch (err) {
        console.error("Service fetch error:", err);
        setServiceError(err.message || "Unable to load service details.");
      } finally {
        setServiceLoading(false);
      }
    };

    fetchService();
  }, [serviceIdFromUrl, token]);

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const canProceedToStep = (step) => {
    switch (step) {
      case 2: return service;
      case 3: return service && scheduledDate;
      case 4: return service && scheduledDate;
      default: return true;
    }
  };

  const nextStep = () => {
    if (canProceedToStep(currentStep + 1)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      showToast("Please complete all required fields", "error");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!customerId || !service?.id || !scheduledDate || !token) {
      showToast("You must be logged in and fill all fields to book.", "error");
      return;
    }

    const bookingDate = new Date().toISOString().slice(0, 19);
    const scheduledDateFormatted = new Date(scheduledDate).toISOString().slice(0, 19);

    const bookingPayload = {
      customer: { id: customerId },
      service: { id: service.id },
      bookingDate: bookingDate,
      scheduledDate: scheduledDateFormatted,
      status: "PENDING",
      totalPrice: Number(service.price)
    };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/bookings/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingPayload)
      });

      if (response.ok) {
        const result = await response.json();
        setBookingResult({
          success: true,
          bookingId: result.id || "BK" + Date.now(),
          message: "Your booking has been created successfully!"
        });
        showToast("Booking created successfully!", "success");
        setCurrentStep(4);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingResult({
        success: false,
        message: error.message || "An unexpected error occurred"
      });
      showToast(error.message || "An unexpected error occurred", "error");
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setScheduledDate("");
    setBookingResult(null);
  };

  const navigateToBookings = () => {
    router.push("/Booking/Bookings");
  };

  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6 absolute top-0 left-1/2 -ml-10"></div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading your service...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (serviceError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-red-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Service Unavailable</h2>
          <p className="text-gray-600 mb-6">{serviceError}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-all shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Service Not Found</h2>
          <p className="text-gray-600 mb-6">The requested service could not be found.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-lg hover:shadow-xl"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 transform transition-all duration-300 ${
          toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <div className={`px-6 py-4 rounded-xl shadow-2xl border-l-4 backdrop-blur-sm ${
            toast.type === 'success' ? 'bg-white/95 border-green-500' :
            toast.type === 'error' ? 'bg-white/95 border-red-500' :
            'bg-white/95 border-blue-500'
          }`}>
            <div className="flex items-center space-x-3">
              {toast.type === 'success' && (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle size={18} className="text-red-600" />
                </div>
              )}
              <span className="font-medium text-gray-800">{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-5xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md mb-4">
            <Sparkles className="text-blue-600" size={20} />
            <span className="text-sm font-semibold text-gray-700">Quick & Easy Booking</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Create Your Booking
          </h1>
          <p className="text-gray-600 text-lg">Complete your reservation in just a few steps</p>
        </div>

        {/* Customer Info Card */}
        {user && (
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 transform hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {(user.name || user.username || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{user.name || user.username || "User"}</h3>
                    <Shield className="text-green-500" size={16} />
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {user.email && (
                      <div className="flex items-center space-x-1">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {(user.phone || user.contact) && (
                      <div className="flex items-center space-x-1">
                        <Phone size={14} />
                        <span>{user.phone || user.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full font-semibold">
                  <CheckCircle size={16} />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="relative flex items-center justify-between">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full" style={{ zIndex: 0 }}>
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="relative flex flex-col items-center" style={{ zIndex: 1 }}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                    isCompleted ? 'bg-gradient-to-br from-blue-600 to-indigo-600 scale-110' :
                    isActive ? 'bg-gradient-to-br from-blue-600 to-indigo-600 scale-110 ring-4 ring-blue-200' :
                    'bg-white border-2 border-gray-300'
                  }`}>
                    <Icon size={24} className={isCompleted || isActive ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <div className="mt-3 text-center max-w-[100px]">
                    <p className={`text-sm font-bold ${
                      isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
          {!token && (
            <div className="p-6 mx-6 mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <XCircle className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-yellow-900 font-semibold">Authentication Required</p>
                  <p className="text-yellow-700 text-sm">Please log in to continue with your booking</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Service Confirmation */}
          {currentStep === 1 && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Service</h2>
                <p className="text-gray-600">Review the service you're about to book</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-700 leading-relaxed">{service.description}</p>
                  </div>
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-blue-200">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={18} className="text-blue-600" />
                    <span className="font-medium">{service.duration || "Flexible duration"}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Price</p>
                    <p className="text-3xl font-bold text-gray-900">LKR {service.price}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Schedule Your Booking</h2>
                <p className="text-gray-600">Choose your preferred date and time</p>
              </div>

              <div className="max-w-lg mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
                  <div className="mb-6">
                    <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
                      <Calendar className="text-blue-600" size={20} />
                      <span>Select Date and Time</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-600 transition-all text-gray-900 font-medium"
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                    <p className="text-xs text-gray-600 mt-2 flex items-center space-x-1">
                      <Clock size={12} />
                      <span>Booking will be confirmed within 24 hours</span>
                    </p>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Status: Pending</p>
                        <p className="text-xs text-gray-600 mt-1">Your booking will be automatically set to pending status and requires confirmation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Booking</h2>
                <p className="text-gray-600">Please verify all details before confirming</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <User className="text-blue-600" size={20} />
                        </div>
                        Customer Details
                      </h3>
                      {user && (
                        <div className="space-y-2 text-sm pl-13">
                          <p className="font-semibold text-gray-900">{user.name || user.username}</p>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Mail size={14} />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Phone size={14} />
                            <span>{user.phone || user.contact || "Not provided"}</span>
                          </div>
                          <p className="text-gray-500 font-mono text-xs pt-2 border-t">ID: {user.id || 'N/A'}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="text-indigo-600" size={20} />
                        </div>
                        Service Information
                      </h3>
                      <div className="space-y-2 text-sm pl-13">
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        <p className="text-gray-600">{service.description}</p>
                        {service.duration && (
                          <div className="flex items-center space-x-2 text-gray-600 pt-2">
                            <Clock size={14} />
                            <span>{service.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <Calendar className="text-purple-600" size={20} />
                        </div>
                        Schedule Details
                      </h3>
                      <div className="space-y-3 pl-13">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Scheduled For</p>
                          <p className="font-semibold text-gray-900">
                            {scheduledDate && new Date(scheduledDate).toLocaleString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">Status: Pending Confirmation</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
                      <h3 className="font-bold mb-4 flex items-center text-lg">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                          <CreditCard size={20} />
                        </div>
                        Payment Summary
                      </h3>
                      <div className="space-y-3 pl-13">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-100">Service Fee</span>
                          <span className="font-semibold">LKR {service.price}</span>
                        </div>
                        <div className="border-t border-white/20 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">Total Amount</span>
                            <span className="text-3xl font-bold">LKR {service.price}</span>
                          </div>
                          <p className="text-xs text-blue-100 mt-2">Payment due upon service completion</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {currentStep === 4 && (
            <div className="p-8 text-center">
              {bookingResult?.success ? (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                      <CheckCircle className="text-white" size={48} />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full mx-auto animate-ping opacity-20"></div>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
                    <p className="text-gray-600 text-lg mb-6">{bookingResult.message}</p>
                    {bookingResult.bookingId && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 inline-block border-2 border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Your Booking ID</p>
                        <p className="text-2xl font-bold text-blue-600 font-mono">{bookingResult.bookingId}</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 text-left">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="text-green-500 mr-2" size={20} />
                      What's Next?
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span>We'll notify you of any updates via email and SMS</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <XCircle className="text-white" size={48} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Booking Failed</h2>
                    <p className="text-gray-600 text-lg">{bookingResult?.message}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6 text-left border border-red-200">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <XCircle className="text-red-500 mr-2" size={20} />
                      What Can You Do?
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></div>
                        <span>Check your internet connection and try again</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></div>
                        <span>Verify that all your information is correct</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></div>
                        <span>Contact support if the problem persists</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 max-w-lg mx-auto">
                <button
                  onClick={navigateToBookings}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Users size={20} />
                  <span>View All Bookings</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={resetForm}
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Create Another Booking
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between p-8 pt-0">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`group px-8 py-3 rounded-xl flex items-center space-x-2 transition-all font-semibold ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-md hover:shadow-lg'
                }`}
              >
                <ChevronLeft size={20} className={currentStep !== 1 ? 'group-hover:-translate-x-1 transition-transform' : ''} />
                <span>Previous</span>
              </button>

              {currentStep === 3 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !token || !customerId}
                  className={`group px-8 py-3 rounded-xl text-white font-semibold transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl ${
                    loading || !token || !customerId
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>Creating Booking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Confirm Booking</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProceedToStep(currentStep + 1)}
                  className={`group px-8 py-3 rounded-xl text-white flex items-center space-x-2 transition-all font-semibold shadow-lg hover:shadow-xl ${
                    canProceedToStep(currentStep + 1)
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>Continue</span>
                  <ChevronRight size={20} className={canProceedToStep(currentStep + 1) ? 'group-hover:translate-x-1 transition-transform' : ''} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        {currentStep < 4 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-6 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full">
              <div className="flex items-center space-x-2">
                <Shield className="text-green-500" size={16} />
                <span>Secure Booking</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-blue-500" size={16} />
                <span>Instant Confirmation</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Clock className="text-purple-500" size={16} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
                        