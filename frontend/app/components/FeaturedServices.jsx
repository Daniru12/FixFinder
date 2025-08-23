import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ServiceCard from './ServiceCard';

// Sample featured services data
const featuredServices = [
  {
    id: '1',
    name: "John's Plumbing Solutions",
    category: 'Plumbing',
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
    rating: 4.8,
    reviewCount: 124,
    location: 'New York, NY',
    price: '$50/hr',
  },
  {
    id: '2',
    name: 'ElectriTech Services',
    category: 'Electrical',
    image:
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
    rating: 4.7,
    reviewCount: 98,
    location: 'Chicago, IL',
    price: '$65/hr',
  },
  {
    id: '3',
    name: "Mike's Carpentry",
    category: 'Carpentry',
    image:
      'https://images.unsplash.com/photo-1601564921647-b446262b08f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    reviewCount: 87,
    location: 'Austin, TX',
    price: '$55/hr',
  },
  {
    id: '4',
    name: 'Cool Air AC Repair',
    category: 'AC Repair',
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    rating: 4.6,
    reviewCount: 112,
    location: 'Miami, FL',
    price: '$70/hr',
  },
];

const FeaturedServices = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and View All Link */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Featured Service Providers
          </h2>
          <Link
            href="/services"
            className="flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            View All
            <ChevronRight size={20} className="ml-1" />
          </Link>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;