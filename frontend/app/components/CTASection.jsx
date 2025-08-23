import React from 'react';
import Link from 'next/link';
import { UserIcon, BriefcaseIcon } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-teal-500 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Hire a Fixer Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 mb-6">
              <UserIcon size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Hire a Fixer
            </h3>
            <p className="text-gray-600 mb-6">
              Find skilled professionals for all your home repair and
              maintenance needs. Get quotes, check reviews, and book services
              with just a few clicks.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Find Services
            </Link>
          </div>

          {/* Become a Provider Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-teal-100 text-teal-600 mb-6">
              <BriefcaseIcon size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Become a Service Provider
            </h3>
            <p className="text-gray-600 mb-6">
              Grow your business by joining our network of trusted service
              providers. Get connected with customers looking for your specific
              skills and services.
            </p>
            <Link
              href="/add-service"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
              Register as Provider
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;