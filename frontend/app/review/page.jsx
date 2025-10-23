"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ReviewForm() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

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
      user: { id: 1 },
      service: { id: Number(serviceId) },
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

      setTimeout(() => {
        window.location.href = `/service/${serviceId}`;
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">Share Your Experience</h2>
            <p className="text-indigo-100 mt-2">Your feedback helps others make informed decisions</p>
          </div>

          <div className="p-8">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg border-l-4 ${
                  message.startsWith("❌")
                    ? "bg-red-50 border-red-500 text-red-700"
                    : "bg-green-50 border-green-500 text-green-700"
                }`}
              >
                <p className="font-medium">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  How would you rate this service?
                </label>
                <div className="flex items-center gap-4">
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-lg font-medium"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-8 h-8 ${
                          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Share your thoughts
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm resize-none"
                  placeholder="Tell us about your experience with this service. What did you like? What could be improved?"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {comment.length} characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Your review will be visible to other users and service providers
        </p>
      </div>
    </div>
  );
}