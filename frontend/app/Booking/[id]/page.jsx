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
  Clock
} from "lucide-react";
import { AuthContext } from '../../context/AuthContext';

export default function EnhancedBookingForm() {
  const params = useParams();
  const serviceIdFromUrl = params?.id;

  const [currentStep, setCurrentStep] = useState(1);
  const [service, setService] = useState(null); // Holds fetched service
  const [scheduledDate, setScheduledDate] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState(null);

  const router = useRouter();
  const { user, token } = useContext(AuthContext);

  // ✅ Real customer ID — no fallback
  const customerId = user?.id;

  const steps = [
    { number: 1, title: "Service Selection", icon: FileText, description: "Confirm your service" },
    { number: 2, title: "Schedule Booking", icon: Calendar, description: "Set date and time" },
    { number: 3, title: "Review Details", icon: CreditCard, description: "Confirm your booking" },
    { number: 4, title: "Confirmation", icon: CheckCircle, description: "Booking complete" },
  ];

  // 🔁 Fetch service by ID on mount
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
        setCurrentStep(2); // Auto-advance to scheduling
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
      console.log("Booking validation failed:", { customerId, serviceId: service?.id, scheduledDate, token: !!token, user });
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
      status: status,
      totalPrice: Number(service.price)
    };

    console.log("Booking payload:", bookingPayload);
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
    setStatus("PENDING");
    setBookingResult(null);
    // Re-fetch service if needed
  };

  const navigateToBookings = () => {
    showToast("Navigating to all bookings...", "info");
    router.push("/Booking/Bookings");
  };

  // 🟡 Loading service
  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading service details...</p>
        </div>
      </div>
    );
  }

  // 🔴 Service fetch error
  if (serviceError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center border border-red-200">
          <XCircle className="text-red-500 mx-auto mb-3" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Service</h2>
          <p className="text-gray-600 mb-4">{serviceError}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // 🟢 Service not found
  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
          <FileText className="text-gray-400 mx-auto mb-3" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-600">The requested service could not be found.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border-l-4 ${
          toast.type === 'success' ? 'bg-white border-blue-600 text-gray-800' :
          toast.type === 'error' ? 'bg-white border-red-500 text-gray-800' :
          'bg-white border-blue-600 text-gray-800'
        }`}>
          <div className="flex items-center space-x-2">
            {toast.type === 'success' && <CheckCircle size={18} className="text-blue-600" />}
            {toast.type === 'error' && <XCircle size={18} className="text-red-500" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Booking</h1>
          <p className="text-gray-600">Schedule your service in a few simple steps</p>
        </div>

        {/* Customer Info Card */}
        {user && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {(user.name || user.username || "U").charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name || user.username || "User"}</h3>
                  <p className="text-gray-600 text-sm">{user.email || ""}</p>
                  <p className="text-gray-600 text-sm">{user.phone || user.contact || ""}</p>
                </div>
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                  Verified
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                      isCompleted ? 'bg-blue-600 border-blue-600 text-white' :
                      isActive ? 'bg-blue-600 border-blue-600 text-white' :
                      'bg-white border-gray-300 text-gray-400'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-medium ${
                        isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`absolute top-6 left-1/2 w-full h-0.5 -translate-y-0.5 ${
                      isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                    }`} style={{ left: '50%', width: 'calc(100% - 48px)', marginLeft: '24px' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {!token && (
            <div className="p-6 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg mx-6 mt-6">
              <div className="flex items-center">
                <XCircle className="text-yellow-600 mr-3" size={20} />
                <span className="text-yellow-800 font-medium">You are not logged in. Please login to create a booking.</span>
              </div>
            </div>
          )}

          {/* Step 1: Service Confirmation (auto-skipped, but kept for UX clarity) */}
          {currentStep === 1 && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Service</h2>
                <p className="text-gray-600">You're about to book the following service:</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-700 mb-3">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Clock size={14} className="mr-1" /> {service.duration || "N/A"}
                  </span>
                  <span className="text-xl font-bold text-gray-900">LKR {service.price}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Booking</h2>
                <p className="text-gray-600">Select your preferred date and time</p>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELED">Canceled</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Booking</h2>
                <p className="text-gray-600">Please confirm your booking details</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <User className="mr-2 text-blue-600" size={18} />
                        Customer Information
                      </h3>
                      {user && (
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-gray-800">{user.name || user.username}</p>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-gray-600">{user.phone || user.contact || "N/A"}</p>
                          <p className="text-gray-600 font-mono">ID: {user.id || 'N/A'}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="mr-2 text-blue-600" size={18} />
                        Service Details
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-gray-800">{service.name}</p>
                        <p className="text-gray-600">{service.description}</p>
                        {service.duration && (
                          <p className="text-gray-600">Duration: {service.duration}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Calendar className="mr-2 text-blue-600" size={18} />
                        Schedule
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-gray-800">
                          {scheduledDate && new Date(scheduledDate).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-gray-600">Status: {status}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CreditCard className="mr-2 text-blue-600" size={18} />
                        Payment
                      </h3>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-gray-900">LKR {service.price}</p>
                        <p className="text-sm text-gray-600">Payment due upon service completion</p>
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
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed</h2>
                    <p className="text-gray-600 mb-4">{bookingResult.message}</p>
                    {bookingResult.bookingId && (
                      <div className="bg-blue-50 rounded-lg p-4 inline-block">
                        <p className="text-blue-800 font-medium">
                          Booking ID: <span className="font-mono">{bookingResult.bookingId}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Failed</h2>
                    <p className="text-gray-600">{bookingResult?.message}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 max-w-md mx-auto">
                <button
                  onClick={navigateToBookings}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <Users size={18} />
                  <span>View All Bookings</span>
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
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
                className={`px-6 py-2 rounded-md flex items-center space-x-2 transition-colors font-medium ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>

              {currentStep === 3 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !token || !customerId}
                  className={`px-6 py-2 rounded-md text-white font-medium transition-colors flex items-center space-x-2 ${
                    loading || !token || !customerId
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProceedToStep(currentStep + 1)}
                  className={`px-6 py-2 rounded-md text-white flex items-center space-x-2 transition-colors font-medium ${
                    canProceedToStep(currentStep + 1)
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}