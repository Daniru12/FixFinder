'use client';
import React, { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // token stored after login

    if (!token) {
      console.error("No token found, please login first.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/bookings/my", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,  // attach JWT
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or failed request");
        }
        return res.json();
      })
      .then((data) => setBookings(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading bookings...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
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
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="text-center">
                  <td className="border px-4 py-2">{b.id}</td>
                  <td className="border px-4 py-2">{b.customer.fullName}</td>
                  <td className="border px-4 py-2">{b.service.name}</td>
                  <td className="border px-4 py-2">
                    {new Date(b.bookingDate).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(b.scheduledDate).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">{b.status}</td>
                  <td className="border px-4 py-2">Rs. {b.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
