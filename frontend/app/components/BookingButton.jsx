'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function BookingButton({ service, className = "" }) {
  const [isBooking, setIsBooking] = useState(false);
  const router = useRouter();
  const { user, token } = useContext(AuthContext);

  const handleBookNow = () => {
    if (!token || !user) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    if (user.role === 'PROVIDER') {
      alert('Providers cannot book their own services');
      return;
    }

    // Navigate to booking page with service ID
    router.push(`/Booking/${service.id}`);
  };

  const handleQuickBook = async () => {
    if (!token || !user) {
      router.push('/login');
      return;
    }

    if (user.role === 'PROVIDER') {
      alert('Providers cannot book their own services');
      return;
    }

    setIsBooking(true);
    
    try {
      const bookingData = {
        customer: { id: user.id },
        service: { id: service.id },
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19), // Tomorrow
        status: "PENDING",
        totalPrice: service.price
      };

      const response = await fetch("http://localhost:8080/api/bookings/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Booking created successfully! Booking ID: ${result.id}`);
        router.push('/Booking/Bookings');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.message || "An error occurred while creating the booking");
    } finally {
      setIsBooking(false);
    }
  };

  if (!service) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Service Info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-gray-900">{service.name}</h3>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          <span>{service.duration || 'Duration not specified'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-1" />
          <span>{service.user?.fullName || service.user?.username || 'Provider'}</span>
        </div>
        <div className="text-lg font-bold text-gray-900">
          LKR {service.price?.toLocaleString() || 'Price not set'}
        </div>
      </div>

      {/* Booking Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleBookNow}
          disabled={!token || !user || user.role === 'PROVIDER'}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Now</span>
        </button>
        
        <button
          onClick={handleQuickBook}
          disabled={!token || !user || user.role === 'PROVIDER' || isBooking}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isBooking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Booking...</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              <span>Quick Book (Tomorrow)</span>
            </>
          )}
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="text-xs text-gray-500 text-center">
          Booking as: {user.fullName || user.username}
        </div>
      )}
    </div>
  );
}
