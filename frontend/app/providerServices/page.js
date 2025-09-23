'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext'; // adjust path

export default function MyServicesPage() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:8080/services/user/my-services', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch services');
        return res.json();
      })
      .then((data) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, token, router]);

  if (loading) {
    return <p className="text-center py-10">Loading your services...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Services</h1>
        <button
          onClick={() => router.push('/create-service')}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          + Create Service
        </button>
      </div>

      {services.length === 0 ? (
        <p className="text-center text-gray-600">You have not added any services yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition"
            >
              {service.images && (
                <img
                  src={service.images}
                  alt={service.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{service.description}</p>
              <p className="font-medium text-blue-600">Category: {service.category}</p>
              <p className="font-medium text-green-600">Status: {service.status}</p>
              <p className="text-lg font-bold mt-2">${service.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
