'use client';
import { useState, useRef, useEffect } from 'react';

export default function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // Slow down the video slightly
    }
  }, []);

  const services = [
    {
      name: 'Electrical',
      icon: '⚡',
      description: 'Professional electrical repairs and installations'
    },
    {
      name: 'Plumbing',
      icon: '🔧',
      description: 'Pipe repairs, installations, and maintenance'
    },
    {
      name: 'Painting',
      icon: '🎨',
      description: 'Interior and exterior painting services'
    },
    {
      name: 'Carpentry',
      icon: '🪵',
      description: 'Woodwork and furniture repairs'
    },
    {
      name: 'AC Repair',
      icon: '❄️',
      description: 'Air conditioning service and maintenance'
    },
    {
      name: 'Appliance',
      icon: '🏠',
      description: 'Home appliance repairs and service'
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover"
          poster="/images/hero-poster.jpg" // Fallback image
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          <source src="/videos/hero-background.webm" type="video/webm" />
          {/* Fallback image if video doesn't load */}
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-fallback.jpg')"
            }}
          />
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Gradient overlays for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/20"></div>
      </div>

      {/* Loading spinner */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Main Heading */}
        <div className="mb-8">
          
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              FIXFINDER
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl font-light mb-6 text-gray-200 max-w-4xl mx-auto leading-relaxed">
            One Platform for All Your 
            <span className="text-cyan-300 font-semibold"> Home Repair Services</span>
          </p>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connecting you with trusted professionals for electrical, plumbing, painting, 
            and all essential home services. Fast, reliable, and hassle-free.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="group px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
            <span>Find Services Now</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          
          <button className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
            <span>Become a Provider</span>
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-12 text-gray-200">
            All Services in One Place
          </h3>
          
          
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">500+</div>
            <div className="text-sm text-gray-300">Trusted Professionals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-teal-400 mb-2">10K+</div>
            <div className="text-sm text-gray-300">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">24/7</div>
            <div className="text-sm text-gray-300">Service Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-teal-400 mb-2">50+</div>
            <div className="text-sm text-gray-300">Cities Covered</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-teal-400 rounded-full opacity-40 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-cyan-300 rounded-full opacity-50 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-teal-300 rounded-full opacity-30 animate-float animation-delay-3000"></div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }

        /* Smooth video fade-in */
        video {
          opacity: ${isVideoLoaded ? 1 : 0};
          transition: opacity 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}