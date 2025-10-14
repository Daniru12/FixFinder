"use client";

import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Reviews Component
 * @param {number} serviceId - The ID of the service to fetch reviews for
 */
export default function Reviews({ serviceId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;

    const fetchReviews = async () => {
      try {
        // Fetch all reviews for the service
        const res = await axios.get(`http://localhost:8080/reviews/service/${serviceId}`);
        setReviews(res.data || []);

        // Fetch average rating
        const avgRes = await axios.get(`http://localhost:8080/reviews/service/${serviceId}/average`);
        setAverageRating(avgRes.data || 0);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [serviceId]);

  if (loading) {
    return <p className="text-gray-500 mt-4">Loading reviews...</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-2">Reviews</h2>
      <p className="text-gray-600 mb-4">Average Rating: {averageRating.toFixed(1)} ⭐</p>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border p-4 rounded-xl bg-gray-50">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{r.user?.username || "Anonymous"}</span>
                <span className="text-yellow-500 font-bold">{r.rating} ⭐</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
