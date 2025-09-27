'use client';

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, User, Wrench, Calendar, CheckCircle, CreditCard } from "lucide-react";

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([
    { id: 1, name: "Water Pipe Repair", price: 2500, icon: "🔧", description: "Professional plumbing services" },
    { id: 2, name: "Electrical Work", price: 3500, icon: "⚡", description: "Licensed electrical installations" },
    { id: 3, name: "House Cleaning", price: 4500, icon: "🧹", description: "Deep cleaning services" },
  ]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const steps = [
    { id: 1, title: "Customer Info", icon: User },
    { id: 2, title: "Select Service", icon: Wrench },
    { id: 3, title: "Schedule", icon: Calendar },
    { id: 4, title: "Review", icon: CheckCircle },
    { id: 5, title: "Payment", icon: CreditCard },
  ];

  useEffect(() => {
    const selected = services.find((s) => String(s.id) === String(serviceId));
    if (selected) setTotalPrice(selected.price || 0);
  }, [serviceId, services]);

  const handleNext = () => {
    if (currentStep === 1 && !customerId) {
      setMessage("Please enter Customer ID");
      return;
    }
    if (currentStep === 2 && !serviceId) {
      setMessage("Please select a service");
      return;
    }
    if (currentStep === 3 && !scheduledDate) {
      setMessage("Please select a date and time");
      return;
    }
    setMessage("");
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!customerId || !serviceId || !scheduledDate) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const booking = {
      customer: { id: Number(customerId) },
      service: { id: Number(serviceId) },
      bookingDate: new Date().toISOString(),
      scheduledDate: new Date(scheduledDate).toISOString(),
      status,
      totalPrice: Number(totalPrice),
    };

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/bookings/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create booking");
      }

      const result = await response.json();
      setMessage("✅ Booking created successfully!");
      console.log("Booking response:", result);

      // Reset form after success
      setTimeout(() => {
        setCustomerId("");
        setServiceId("");
        setScheduledDate("");
        setStatus("PENDING");
        setTotalPrice(0);
        setCurrentStep(1);
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find((s) => String(s.id) === String(serviceId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-6xl w-full">
          {/* Step Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                          : isActive
                          ? "bg-white text-purple-900 shadow-lg shadow-white/25 scale-110"
                          : "bg-white/20 text-white/50"
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      className={`text-sm font-medium transition-all duration-300 ${
                        isActive ? "text-white" : "text-white/60"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 relative">
              <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 rounded-full"></div>
              <div
                className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            {message && (
              <div
                className={`mb-6 p-4 rounded-2xl backdrop-blur-sm border ${
                  message.startsWith("❌")
                    ? "bg-red-500/20 border-red-500/30 text-red-100"
                    : "bg-green-500/20 border-green-500/30 text-green-100"
                }`}
              >
                {message}
              </div>
            )}

            {/* Step Content */}
            <div className="min-h-[400px] flex flex-col">
              {currentStep === 1 && (
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-4xl font-bold text-white mb-8 text-center">
                    Customer Information
                  </h2>
                  <div className="max-w-md mx-auto w-full">
                    <label className="block text-white/80 text-lg font-medium mb-3">
                      Customer ID
                    </label>
                    <input
                      type="number"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 px-6 text-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
                      placeholder="Enter customer ID"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-white mb-8 text-center">
                    Choose Your Service
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          String(serviceId) === String(service.id)
                            ? "bg-white/20 border-purple-400 shadow-lg shadow-purple-400/25"
                            : "bg-white/5 border-white/20 hover:bg-white/10"
                        }`}
                        onClick={() => setServiceId(String(service.id))}
                      >
                        <div className="text-center">
                          <div className="text-6xl mb-4">{service.icon}</div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {service.name}
                          </h3>
                          <p className="text-white/60 mb-4">{service.description}</p>
                          <div className="text-2xl font-bold text-purple-300">
                            LKR {service.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-4xl font-bold text-white mb-8 text-center">
                    Schedule Your Service
                  </h2>
                  <div className="max-w-md mx-auto w-full space-y-6">
                    <div>
                      <label className="block text-white/80 text-lg font-medium mb-3">
                        Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 text-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-lg font-medium mb-3">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 text-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
                      >
                        <option value="PENDING" className="bg-gray-900">PENDING</option>
                        <option value="CONFIRMED" className="bg-gray-900">CONFIRMED</option>
                        <option value="COMPLETED" className="bg-gray-900">COMPLETED</option>
                        <option value="CANCELED" className="bg-gray-900">CANCELED</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-white mb-8 text-center">
                    Review Your Booking
                  </h2>
                  <div className="max-w-2xl mx-auto bg-white/5 rounded-2xl p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">Customer ID</h3>
                        <p className="text-white text-xl font-medium">{customerId}</p>
                      </div>
                      <div>
                        <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">Service</h3>
                        <p className="text-white text-xl font-medium">{selectedService?.name}</p>
                      </div>
                      <div>
                        <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">Scheduled Date</h3>
                        <p className="text-white text-xl font-medium">
                          {scheduledDate ? new Date(scheduledDate).toLocaleString() : "Not set"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">Status</h3>
                        <p className="text-white text-xl font-medium">{status}</p>
                      </div>
                    </div>
                    <div className="border-t border-white/20 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-xl">Total Price:</span>
                        <span className="text-3xl font-bold text-purple-300">
                          LKR {totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-4xl font-bold text-white mb-8 text-center">
                    Complete Your Booking
                  </h2>
                  <div className="max-w-md mx-auto w-full text-center space-y-6">
                    <div className="text-6xl mb-4">💳</div>
                    <p className="text-white/80 text-lg">
                      Review all details and confirm your booking
                    </p>
                    <div className="bg-white/10 rounded-2xl p-6">
                      <div className="text-purple-300 text-2xl font-bold">
                        Total: LKR {totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                  currentStep === 1
                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                    : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
                }`}
              >
                <ChevronLeft size={20} />
                <span>Previous</span>
              </button>

              {currentStep < 5 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-8 py-4 rounded-2xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  <span>Next</span>
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-medium shadow-lg transition-all duration-300 ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed text-white/50"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-500/25 hover:scale-105"
                  }`}
                >
                  <span>{loading ? "Creating..." : "Complete Booking"}</span>
                  <CheckCircle size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}