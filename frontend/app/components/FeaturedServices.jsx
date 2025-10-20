'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import ServiceCard from './ServiceCard';

const FeaturedServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/services/user/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      
      // Filter only active services and limit to 4 for featured section
      const activeServices = data
        .filter(service => service.status === 'ACTIVE')
        .slice(0, 4);
      
      setServices(activeServices);
    } catch (err) {
      console.error('Error fetching featured services:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and View All Link */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Featured Service Providers
          </h2>
          <Link
            href="/service"
            className="flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            View All
            <ChevronRight size={20} className="ml-1" />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <span className="ml-3 text-gray-600">Loading featured services...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load services. Please try again later.</p>
            <button
              onClick={fetchFeaturedServices}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Service Cards Grid */}
        {!loading && !error && (
          <>
            {services.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No featured services available at the moment.</p>
                <Link
                  href="/service"
                  className="inline-block mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  Browse All Services
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    id={service.id}
                    name={service.name}
                    category={service.category}
                    image={service.images}
                    rating={service.rating || 0}
                    reviewCount={0}
                    location={service.user?.username || 'Provider'}
                    price={`LKR ${service.price?.toLocaleString() || 'N/A'}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedServices;