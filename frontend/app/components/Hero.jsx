import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, MapPin, Star, Users, Shield, Play, Pause, Phone, Clock, Award } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const intervalRef = useRef(null);

  // Background images with service themes
  const backgroundImages = [
    {
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
      alt: 'Home repair services',
      title: 'Professional Home Repairs',
      subtitle: 'Expert craftsmen at your service'
    },
    {
      url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
      alt: 'Professional tools',
      title: 'Quality Guaranteed',
      subtitle: 'Professional tools & expertise'
    },
    {
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
      alt: 'Home maintenance',
      title: '24/7 Emergency Service',
      subtitle: 'We\'re here when you need us'
    },
    {
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
      alt: 'Construction work',
      title: 'Licensed & Insured',
      subtitle: 'Peace of mind guaranteed'
    },
    {
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
      alt: 'Modern home',
      title: 'Transform Your Home',
      subtitle: 'From vision to reality'
    }
  ];

  // Service locations for Sri Lanka
  const serviceLocations = [
    { name: 'Colombo', providers: 1250, color: 'bg-blue-500' },
    { name: 'Kandy', providers: 680, color: 'bg-emerald-500' },
    { name: 'Galle', providers: 420, color: 'bg-purple-500' },
    { name: 'Jaffna', providers: 380, color: 'bg-orange-500' },
    { name: 'Negombo', providers: 350, color: 'bg-red-500' },
    { name: 'Anuradhapura', providers: 290, color: 'bg-indigo-500' }
  ];

  // Mouse movement parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = ((e.clientX - rect.left - centerX) / centerX) * 15;
        const y = ((e.clientY - rect.top - centerY) / centerY) * 15;
        setMousePosition({ x, y });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Slideshow with play/pause
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
      }, 6000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [backgroundImages.length, isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      ref={heroRef}
      className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden min-h-screen flex items-center"
    >
      {/* Background with slideshow */}
      <div className="absolute inset-0">
        {/* Slideshow Images */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-20 scale-100' 
                : 'opacity-0 scale-110'
            }`}
            style={{
              backgroundImage: `url('${image.url}')`,
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
            }}
            aria-hidden="true"
          />
        ))}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-50/30 to-indigo-100/40" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-indigo-200/25 to-blue-200/25 rounded-full blur-2xl" />
      </div>

      {/* Slideshow controls */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-4">
        <button
          onClick={prevSlide}
          className="bg-white/80 hover:bg-white/95 text-gray-700 hover:text-gray-900 p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-gray-200/50 hover:border-gray-300/70 hover:scale-110 shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={togglePlayPause}
          className="bg-white/80 hover:bg-white/95 text-gray-700 hover:text-gray-900 p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-gray-200/50 hover:border-gray-300/70 hover:scale-110 shadow-lg"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
      </div>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white/95 text-gray-700 hover:text-gray-900 p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-gray-200/50 hover:border-gray-300/70 hover:scale-110 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-3 bg-white/70 backdrop-blur-md rounded-full px-6 py-3 border border-gray-200/30 shadow-lg">
        {backgroundImages.map((image, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative group transition-all duration-300 ${
              index === currentSlide 
                ? 'scale-125' 
                : 'hover:scale-110'
            }`}
            aria-label={`Go to slide ${index + 1}: ${image.title}`}
          >
            <div className={`w-4 h-4 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-blue-600 shadow-lg ring-2 ring-blue-300' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`} />
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10 w-full">
        <div className="text-center">
          {/* Dynamic slide title */}
          <div className="mb-6">
            <div className="inline-flex items-center bg-white/70 backdrop-blur-sm rounded-full px-6 py-2 border border-blue-200/50 text-sm text-gray-700 mb-4 shadow-sm">
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              {backgroundImages[currentSlide].subtitle}
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight mb-8 leading-none">
            <span 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm"
              style={{
                transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
              }}
            >
              Find Your
            </span>
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Perfect Match
              </span>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-xl animate-pulse"></div>
            </span>
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-700 tracking-wide">
              Across Sri Lanka
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 max-w-4xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed">
            {backgroundImages[currentSlide].title} - Connect with verified professionals 
            <span className="block mt-3 text-lg text-blue-600 font-medium">
              <MapPin className="inline h-5 w-5 mr-2" />
              Island-wide coverage • Instant booking • Money-back guarantee
            </span>
          </p>

          {/* Search bar */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative flex flex-col lg:flex-row shadow-2xl rounded-3xl overflow-hidden backdrop-blur-lg bg-white/95 border border-gray-200/50">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What service do you need? (e.g., fix leaky faucet, paint living room...)"
                    className="w-full pl-14 pr-6 py-6 text-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 bg-transparent placeholder-gray-400 font-medium"
                  />
                </div>
                
                <div className="flex items-center px-2">
                  <div className="hidden lg:block w-px h-12 bg-gray-200 mx-4"></div>
                  <button
                    type="button"
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-10 py-6 flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl font-bold text-lg rounded-2xl lg:rounded-none lg:rounded-r-3xl relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <Search className="h-6 w-6 mr-3 relative z-10" />
                    <span className="relative z-10">Find Services</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Search suggestions */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
              {['Emergency repair', 'House cleaning', 'A/C installation', 'Garden maintenance'].map((suggestion) => (
                <button
                  key={suggestion}
                  className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full border border-blue-200/50 hover:border-blue-300/70 transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Simple location cards */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Service Coverage Across Sri Lanka</h2>
              <p className="text-gray-600">Professional services available from Jaffna to Matara</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl">
              {/* Location grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {serviceLocations.map((location, index) => (
                  <div
                    key={location.name}
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30 hover:border-gray-300/50 transition-all duration-300 group hover:bg-white/80 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-3">
                      <div className={`w-4 h-4 ${location.color} rounded-full mr-3`}></div>
                      <h3 className="text-lg font-semibold text-gray-800">{location.name}</h3>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{location.providers}+</div>
                    <div className="text-sm text-gray-600">Service Providers</div>
                  </div>
                ))}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/30">
                  <div className="text-2xl font-bold text-blue-600 mb-1">4,200+</div>
                  <div className="text-sm text-gray-600">Service Providers</div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/30">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Emergency Service</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/30">
                  <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
                  <div className="text-sm text-gray-600">Coverage Rate</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200/30">
                  <div className="text-2xl font-bold text-orange-600 mb-1">3 Languages</div>
                  <div className="text-sm text-gray-600">Support Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { 
                  icon: Users, 
                  number: '4,200+', 
                  label: 'Verified Professionals', 
                  color: 'text-blue-600',
                  subtitle: 'Licensed & background checked'
                },
                { 
                  icon: Star, 
                  number: '4.8★', 
                  label: 'Customer Rating', 
                  color: 'text-yellow-500',
                  subtitle: 'Based on 50k+ reviews'
                },
                { 
                  icon: Shield, 
                  number: '100%', 
                  label: 'Money-back Guarantee', 
                  color: 'text-green-600',
                  subtitle: 'Full satisfaction promise'
                },
                { 
                  icon: Clock, 
                  number: '< 2hrs', 
                  label: 'Average Response', 
                  color: 'text-purple-600',
                  subtitle: 'Emergency services faster'
                }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:border-gray-300/70 transition-all duration-300 group hover:bg-white/80 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <stat.icon className={`h-8 w-8 ${stat.color} mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`} />
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.subtitle}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Call-to-action */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-blue-100/70 to-purple-100/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 max-w-4xl mx-auto shadow-xl">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Ready to Experience Sri Lanka's Best Service Network?</h3>
                <p className="text-gray-600 text-lg mb-2">Join thousands of happy customers from Colombo to Jaffna</p>
                <div className="flex items-center justify-center text-sm text-blue-600 font-medium">
                  <Award className="w-4 h-4 mr-2" />
                  Winner: Best Home Services Platform Sri Lanka 2024
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Browse All Services
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  <Users className="w-5 h-5 mr-2" />
                  Join as Service Provider
                </button>
              </div>

              {/* Contact info */}
              <div className="mt-6 pt-6 border-t border-gray-200/50 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Hotline: +94 11 777 8888</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  <span>HQ: Colombo 03</span>
                </div>
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2 text-purple-600" />
                  <span>24/7 Emergency Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(90deg); }
          50% { transform: translateY(-16px) rotate(180deg); }
          75% { transform: translateY(-8px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
};

export default Hero;