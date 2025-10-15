'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BookingButton from '../components/BookingButton';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/services/user/all')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch services');
        return res.json();
      })
      .then((data) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Available Services
        </h1>

        {services.length === 0 ? (
          <p className="text-center text-gray-500">No services available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Service Image */}
                {service.images && service.images.length > 0 ? (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={service.images[0]} // Assuming images is an array of URLs
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}

                {/* Service Info */}
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800">{service.name}</h2>
                  <p className="mt-2 text-gray-600 line-clamp-2">{service.description}</p>

                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <p><span className="font-medium">Category:</span> {service.category}</p>
                    <p><span className="font-medium">Status:</span> {service.status}</p>
                    <p><span className="font-medium">Provider:</span> {service.user?.username || 'N/A'}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      LKR {service.price?.toLocaleString() || 'Price not set'}
                    </span>
                    <BookingButton serviceId={service.id} />
                  </div>

                  <div className="mt-4 text-center">
                    <Link
                      href={`/service/${service.id}`}
                      className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}