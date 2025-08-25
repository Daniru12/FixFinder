import React from 'react';
import { ShieldCheck, Users, Clock, Award } from 'lucide-react';

const indicators = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-teal-600" />,
    title: 'Verified Providers',
    description:
      'All service providers undergo a thorough verification process',
  },
  {
    icon: <Users className="h-8 w-8 text-teal-600" />,
    title: '10,000+ Users',
    description: 'Join our growing community of satisfied customers',
  },
  {
    icon: <Clock className="h-8 w-8 text-teal-600" />,
    title: 'Quick Response',
    description: 'Get connected with service providers within minutes',
  },
  {
    icon: <Award className="h-8 w-8 text-teal-600" />,
    title: 'Satisfaction Guarantee',
    description: 'We ensure quality service or your money back',
  },
];

const TrustIndicators = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose FixFinder</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to connecting you with trusted professionals while providing a seamless experience.
          </p>
        </div>

        {/* Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon Circle */}
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-4">
                {indicator.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {indicator.title}
              </h3>
              <p className="text-gray-600">{indicator.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;