import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Homeowner',
    content:
      "FixFinder helped me find a reliable plumber within hours. The service was excellent and the price was reasonable. I'll definitely use this platform again!",
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Thompson',
    role: 'Business Owner',
    content:
      "As a small business owner, I've gained consistent clients through FixFinder. The platform is easy to use and has significantly improved my customer reach.",
    avatar:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', // Fixed: removed leading space
    rating: 4,
  },
  {
    id: 3,
    name: 'Lisa Rodriguez',
    role: 'Apartment Renter',
    content:
      'Found an electrician to fix my wiring issues through FixFinder. The booking process was smooth, and the service provider was professional and skilled.',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', // Fixed: removed leading space
    rating: 5,
  },
];

const TestimonialSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how FixFinder has helped homeowners find reliable service providers and professionals grow their business.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md relative overflow-hidden"
            >
              {/* Quote Icon Background */}
              <div className="absolute top-6 right-6 text-teal-500 opacity-20 pointer-events-none">
                <Quote size={48} />
              </div>

              {/* User Info */}
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-700 relative z-10">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;