import React from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Homeowner',
    content:
      "FixFinder helped me find a reliable plumber within hours. The service was excellent and the price was reasonable. I'll definitely use this platform again!",
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Thompson',
    role: 'Business Owner',
    content:
      "As a small business owner, I've gained consistent clients through FixFinder. The platform is easy to use and has significantly improved my customer reach.",
    avatar:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4,
  },
  {
    id: 3,
    name: 'Lisa Rodriguez',
    role: 'Apartment Renter',
    content:
      'Found an electrician to fix my wiring issues through FixFinder. The booking process was smooth, and the service provider was professional and skilled.',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'Property Manager',
    content:
      'Managing multiple properties used to be challenging until I found FixFinder. Now I have trusted professionals for all maintenance needs in one place.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5,
  },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-teal-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-teal-600" />
            Trusted by Thousands
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our <span className="text-teal-600">Users Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how FixFinder has transformed the way homeowners find reliable service 
            providers and helped professionals grow their businesses.
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Gradient Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-teal-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-teal-500 opacity-10 transform group-hover:scale-110 transition-transform duration-300">
                <Quote size={64} />
              </div>

              {/* User Info */}
              <div className="flex items-center mb-6 relative z-10">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-4 ring-white shadow-md"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <Quote size={12} className="text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-teal-600 font-medium">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400 transform hover:scale-110 transition-transform'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-700 text-lg leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-teal-200 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 text-teal-500 opacity-10">
                      <Quote size={48} />
                    </div>

                    {/* User Info */}
                    <div className="flex items-center mb-6">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white shadow-md"
                        loading="lazy"
                      />
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-teal-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>

                    {/* Testimonial Content */}
                    <p className="text-gray-700 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-teal-50 hover:border-teal-200 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-teal-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-teal-50 hover:border-teal-200 transition-colors"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">500+</div>
            <div className="text-gray-600">Service Providers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">95%</div>
            <div className="text-gray-600">Repeat Business</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;