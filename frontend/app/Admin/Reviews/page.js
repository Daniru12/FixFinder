'use client';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, Star, Trash2 } from 'lucide-react';

export default function AdminReviewManagement() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'ROLE_ADMIN') {
        router.push('/login');
        return;
      }
      loadReviews();
    }
  }, [user, authLoading]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/reviews/admin/all`,
        {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        }
      );
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/reviews/admin/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        }
      );
      loadReviews();
    } catch (err) {
      setError(err.message || 'Failed to delete review');
    }
  };

  if (authLoading) return <p className="text-center py-10">Loading...</p>;

  if (!user || user.role !== 'ROLE_ADMIN')
    return <p className="text-center py-10">Checking access...</p>;

  if (loading) return <p className="text-center py-10">Loading reviews...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Review Management</h1>
            <p className="text-gray-600 mt-2">View and delete all user reviews</p>
          </div>
          <button
            onClick={() => router.push('./admin-dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-800 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No reviews found in the system.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{review.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {review.user?.username || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {review.service?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500 flex items-center">
                        <Star className="w-4 h-4 mr-1" /> {review.rating}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{review.comment}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-900 transition"
                          title="Delete Review"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
