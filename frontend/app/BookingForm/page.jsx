'use client';

import { useState, useEffect } from "react";

export default function BookingForm() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch services or use dummy data
    setServices([
      { id: 1, name: "Water Pipe Repair", price: 2500 },
      { id: 2, name: "Electrical Work", price: 3500 },
      { id: 3, name: "House Cleaning", price: 4500 },
    ]);
  }, []);

  useEffect(() => {
    const selected = services.find((s) => String(s.id) === String(serviceId));
    if (selected) setTotalPrice(selected.price || 0);
  }, [serviceId, services]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !customerEmail || !serviceId || !scheduledDate) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const booking = {
      customer: { username: customerName, email: customerEmail },
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
      setMessage("Booking created successfully!");
      console.log("Booking response:", result);

      // Reset form
      setCustomerName("");
      setCustomerEmail("");
      setServiceId("");
      setScheduledDate("");
      setStatus("PENDING");
      setTotalPrice(0);
    } catch (error) {
      console.error("Booking error:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-4">Create Booking</h1>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Customer Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
              required
            >
              <option value="">-- Choose a service --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — LKR {s.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Scheduled Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Total Price (LKR)</label>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              className="w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
              step="0.01"
              min="0"
              required
            />
          </div>

          <button
            type="submit"
            className={`px-5 py-2 rounded-lg text-white font-medium shadow ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
