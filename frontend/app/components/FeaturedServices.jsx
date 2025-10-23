'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2, Star, MapPin } from 'lucide-react';

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

  // Function to get a placeholder image if service image is not available
  const getServiceImage = (service) => {
    // Check if service has images from backend
    if (service.images) {
      // Handle if images is a string (single image URL)
      if (typeof service.images === 'string') {
        return service.images;
      }
      // Handle if images is an array
      if (Array.isArray(service.images) && service.images.length > 0) {
        return service.images[0];
      }
    }
    
    // Category-based placeholder images from Unsplash
    const categoryImages = {
      photography: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      development: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      writing: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      plumbing: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      electrical: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      carpentry: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      default: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    };

    const category = service.category?.toLowerCase();
    return categoryImages[category] || categoryImages.default;
  };

  const ServiceCard = ({ service }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const imageUrl = getServiceImage(service);
    const rating = service.rating || 4.5; // Default rating if not available
    const reviewCount = service.reviewCount || 0;

    return (
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-teal-100">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            </div>
          )}
          <img
            src={imageError ? 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' : imageUrl}
            alt={service.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
              {service.category || 'Service'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
              {service.name}
            </h3>
            <div className="text-teal-600 font-bold text-lg">
              LKR {service.price?.toLocaleString() || 'N/A'}
            </div>
          </div>

          {/* Provider Info */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin size={14} className="mr-1" />
            <span className="text-sm">{service.user?.username || 'Professional'}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium text-gray-900">{rating}</span>
              </div>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          {/* View Details Button */}
          <Link 
            href={`/service/${service.id}`}
            className="mt-4 w-full bg-teal-50 text-teal-600 hover:bg-teal-100 font-medium py-2 px-4 rounded-lg text-center block transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="text-teal-600">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover top-rated service providers trusted by thousands of customers
          </p>
        </div>

        {/* Header with View All Link */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Popular This Week
            </h3>
            <p className="text-gray-600 mt-2">Handpicked quality services for you</p>
          </div>
          <Link
            href="/service"
            className="group flex items-center gap-2 bg-white text-teal-600 hover:bg-teal-50 border border-teal-200 hover:border-teal-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            View All Services
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
              <div className="absolute inset-0 border-4 border-teal-100 rounded-full animate-ping"></div>
            </div>
            <span className="mt-4 text-lg text-gray-600">Loading featured services...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchFeaturedServices}
              className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Service Cards Grid */}
        {!loading && !error && (
          <>
            {services.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Services Available</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We're working on adding new featured services. Check back soon!
                </p>
                <Link
                  href="/service"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                  Browse All Services
                  <ChevronRight size={20} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        {!loading && !error && services.length > 0 && (
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to find your perfect service?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of satisfied customers who found their ideal service provider through us.
              </p>
              <Link
                href="/service"
                className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                Explore All Services
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedServices;