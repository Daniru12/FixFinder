import React from 'react';
import { ShieldCheck, Users, Clock, Award, Star, Heart, TrendingUp, MessageCircle } from 'lucide-react';

const indicators = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-white" />,
    title: 'Verified Providers',
    description: 'All service providers undergo a thorough verification process',
    stats: '500+ Verified',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Users className="h-8 w-8 text-white" />,
    title: '25,000+ Users',
    description: 'Join our growing community of satisfied customers',
    stats: '98% Satisfaction',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Clock className="h-8 w-8 text-white" />,
    title: 'Quick Response',
    description: 'Get connected with service providers within minutes',
    stats: '< 5 Min Average',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: <Award className="h-8 w-8 text-white" />,
    title: 'Satisfaction Guarantee',
    description: 'We ensure quality service or your money back',
    stats: '100% Guaranteed',
    gradient: 'from-purple-500 to-pink-500',
  },
];

const additionalStats = [
  {
    icon: <Star className="h-6 w-6 text-yellow-400" />,
    value: '4.9/5',
    label: 'Average Rating',
  },
  {
    icon: <Heart className="h-6 w-6 text-red-500" />,
    value: '95%',
    label: 'Repeat Customers',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-green-500" />,
    value: '50+',
    label: 'Cities Covered',
  },
  {
    icon: <MessageCircle className="h-6 w-6 text-blue-500" />,
    value: '10K+',
    label: 'Reviews',
  },
];

const TrustIndicators = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ShieldCheck className="h-4 w-4" />
            Trusted by Thousands
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Millions Choose{' '}
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              FixFinder
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the way you find trusted service professionals. 
            With our rigorous vetting process and customer-first approach, 
            your satisfaction is our top priority.
          </p>
        </div>

        {/* Main Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent"
            >
              {/* Gradient Background Effect on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${indicator.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Animated Icon Container */}
              <div className={`relative h-20 w-20 rounded-2xl bg-gradient-to-br ${indicator.gradient} mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {indicator.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                {indicator.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {indicator.description}
              </p>
              <div className="text-sm font-semibold text-gray-500">
                {indicator.stats}
              </div>

              {/* Hover Border Effect */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${indicator.gradient} bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
            </div>
          ))}
        </div>

        {/* Additional Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Impact in Numbers
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real results that demonstrate our commitment to excellence and customer satisfaction
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {additionalStats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-lg bg-white group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial & CTA Section */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-10 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            
            <blockquote className="text-xl font-medium mb-6 italic">
              "FixFinder completely transformed how I find reliable service providers. 
              The quality and professionalism are unmatched. I found my perfect home 
              service expert in under 5 minutes!"
            </blockquote>
            
            <div className="mb-8">
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-teal-100">Homeowner, Colombo</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                Join Our Community
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-teal-600 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105">
                Become a Provider
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm font-medium mb-6">
            TRUSTED AND RECOMMENDED BY
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Professional</div>
            <div className="text-2xl font-bold text-gray-400">Trusted</div>
            <div className="text-2xl font-bold text-gray-400">Verified</div>
            <div className="text-2xl font-bold text-gray-400">Awarded</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;