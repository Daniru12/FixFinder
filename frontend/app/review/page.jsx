"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ReviewForm() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId"); // ✅ Get from URL

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment || !serviceId) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    const reviewData = {
      rating: Number(rating),
      comment,
      user: { id: 1 }, // keep your user id logic
      service: { id: Number(serviceId) }, // ✅ dynamic from URL
    };

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/reviews/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        throw new Error("❌ Failed to submit review");
      }

      setMessage("✅ Review submitted successfully!");
      setRating(5);
      setComment("");
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Submit a Review</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.startsWith("❌")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200 shadow-sm"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-200 shadow-sm"
            placeholder="Write your review here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
