'use client';
import React, { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(""); // store user role
  const [error, setError] = useState(""); // error message

  const token = localStorage.getItem("token"); // JWT token

  useEffect(() => {
    if (!token) {
      console.error("No token found, please login first.");
      setLoading(false);
      return;
    }

    // Decode token to get role (simple base64 decode of JWT payload)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role || "");
    } catch (err) {
      console.error("Failed to parse token:", err);
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
        if (!res.ok) throw new Error("Unauthorized or failed request");
        return res.json();
      })
      .then((data) => setBookings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Confirm booking (only providers can confirm)
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

      if (!res.ok) {
        throw new Error("Failed to confirm booking.");
      }

      const updatedBooking = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updatedBooking : b))
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Remove booking
  const removeBooking = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to remove booking");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading bookings...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Booking ID</th>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Service</th>
                <th className="border px-4 py-2">Booking Date</th>
                <th className="border px-4 py-2">Scheduled Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Total Price</th>
                {role === "PROVIDER" && <th className="border px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="text-center">
                  <td className="border px-4 py-2">{b.id}</td>
                  <td className="border px-4 py-2">{b.customer.fullName}</td>
                  <td className="border px-4 py-2">{b.service.name}</td>
                  <td className="border px-4 py-2">{new Date(b.bookingDate).toLocaleString()}</td>
                  <td className="border px-4 py-2">{new Date(b.scheduledDate).toLocaleString()}</td>
                  <td className="border px-4 py-2">{b.status}</td>
                  <td className="border px-4 py-2">Rs. {b.totalPrice}</td>
                  {role === "PROVIDER" && (
                    <td className="border px-4 py-2 space-x-2">
                      {b.status !== "CONFIRMED" && (
                        <button
                          onClick={() => confirmBooking(b.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        onClick={() => removeBooking(b.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
