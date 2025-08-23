import React from 'react';
import { SearchIcon } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
        }}
        aria-hidden="true"
      />
      
      {/* Foreground Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Find Trusted Service Providers Near You
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-teal-100">
            Connect with skilled professionals for all your home repair and maintenance needs.
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex flex-col md:flex-row shadow-xl rounded-lg overflow-hidden">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Find a fixer near you..."
                  className="w-full px-5 py-4 text-gray-700 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 flex items-center justify-center transition duration-150 ease-in-out"
              >
                <SearchIcon className="h-5 w-5 mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="mt-8">
            <div className="inline-flex flex-wrap justify-center gap-2 md:gap-4">
              {['Plumber', 'Electrician', 'Carpenter', 'AC Repair', 'Painter'].map((category) => (
                <button
                  key={category}
                  type="button"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full px-4 py-2 text-sm font-medium transition duration-200 ease-in-out"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;