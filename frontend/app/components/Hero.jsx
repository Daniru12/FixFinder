import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, MapPin, Star, Users, Shield, Play, Pause, Phone, Clock, Award } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRotation, setMapRotation] = useState({ x: 0, y: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const heroRef = useRef(null);
  const intervalRef = useRef(null);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  // Enhanced background images with more variety
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

  // Sri Lankan service locations with accurate lat/lng coordinates
  const sriLankanLocations = [
    { 
      id: 1, 
      city: 'Colombo', 
      province: 'Western Province',
      lat: 6.9271,
      lng: 79.8612,
      x: 48, 
      y: 70, 
      providers: 1250, 
      color: 'bg-blue-500',
      mapColor: '#3b82f6',
      population: '752,993',
      services: ['Home Repair', 'Cleaning', 'Plumbing', 'Electrical', 'Gardening']
    },
    { 
      id: 2, 
      city: 'Kandy', 
      province: 'Central Province',
      lat: 7.2906,
      lng: 80.6337,
      x: 52, 
      y: 58, 
      providers: 680, 
      color: 'bg-emerald-500',
      mapColor: '#10b981',
      population: '125,351',
      services: ['Construction', 'Renovation', 'Landscaping', 'Painting']
    },
    { 
      id: 3, 
      city: 'Galle', 
      province: 'Southern Province',
      lat: 6.0535,
      lng: 80.2210,
      x: 48, 
      y: 78, 
      providers: 420, 
      color: 'bg-purple-500',
      mapColor: '#8b5cf6',
      population: '99,478',
      services: ['Home Maintenance', 'Cleaning', 'Security Systems']
    },
    { 
      id: 4, 
      city: 'Jaffna', 
      province: 'Northern Province',
      lat: 9.6615,
      lng: 80.0255,
      x: 50, 
      y: 25, 
      providers: 380, 
      color: 'bg-orange-500',
      mapColor: '#f97316',
      population: '88,138',
      services: ['Electrical', 'Plumbing', 'Solar Installation']
    },
    { 
      id: 5, 
      city: 'Negombo', 
      province: 'Western Province',
      lat: 7.2083,
      lng: 79.8358,
      x: 46, 
      y: 68, 
      providers: 350, 
      color: 'bg-red-500',
      mapColor: '#ef4444',
      population: '142,449',
      services: ['Beach Property Maintenance', 'Tourism Services', 'Cleaning']
    },
    { 
      id: 6, 
      city: 'Anuradhapura', 
      province: 'North Central Province',
      lat: 8.3114,
      lng: 80.4037,
      x: 50, 
      y: 42, 
      providers: 290, 
      color: 'bg-indigo-500',
      mapColor: '#6366f1',
      population: '63,208',
      services: ['Agricultural Services', 'Home Repair', 'Well Drilling']
    },
    { 
      id: 7, 
      city: 'Trincomalee', 
      province: 'Eastern Province',
      lat: 8.5874,
      lng: 81.2152,
      x: 60, 
      y: 45, 
      providers: 240, 
      color: 'bg-pink-500',
      mapColor: '#ec4899',
      population: '99,135',
      services: ['Marine Services', 'Coastal Property Maintenance']
    },
    { 
      id: 8, 
      city: 'Batticaloa', 
      province: 'Eastern Province',
      lat: 7.7102,
      lng: 81.7088,
      x: 62, 
      y: 60, 
      providers: 220, 
      color: 'bg-teal-500',
      mapColor: '#14b8a6',
      population: '95,489',
      services: ['Lagoon Area Services', 'Fishing Equipment Repair']
    },
    { 
      id: 9, 
      city: 'Matara', 
      province: 'Southern Province',
      lat: 5.9549,
      lng: 80.5550,
      x: 50, 
      y: 82, 
      providers: 310, 
      color: 'bg-yellow-500',
      mapColor: '#eab308',
      population: '58,651',
      services: ['Coastal Services', 'Tourism Property Maintenance']
    },
    { 
      id: 10, 
      city: 'Ratnapura', 
      province: 'Sabaragamuwa Province',
      lat: 6.6828,
      lng: 80.4000,
      x: 48, 
      y: 68, 
      providers: 180, 
      color: 'bg-cyan-500',
      mapColor: '#06b6d4',
      population: '52,170',
      services: ['Gem Mining Equipment', 'Rural Services', 'Agricultural Tools']
    }
  ];

  // Particle system for floating elements
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.3 + 0.1,
    speed: Math.random() * 2 + 0.5,
    direction: Math.random() * 360
  }));

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dpoWZdYCOVCGDg&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        // Fallback: show a message or alternative map
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize Google Map
  useEffect(() => {
    if (mapLoaded && mapRef.current && !googleMapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 7,
        center: { lat: 7.8731, lng: 80.7718 }, // Sri Lanka center
        mapTypeId: 'terrain',
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'water',
            elementType: 'all',
            stylers: [{ color: '#dde8f0' }]
          },
          {
            featureType: 'landscape',
            elementType: 'all',
            stylers: [{ color: '#f5f7fa' }]
          },
          {
            featureType: 'landscape.natural',
            elementType: 'all',
            stylers: [{ color: '#f0f4f8' }]
          },
          {
            featureType: 'road',
            elementType: 'all',
            stylers: [{ color: '#e2e8f0' }, { lightness: 20 }]
          }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      });

      googleMapRef.current = map;

      // Add markers for each location
      sriLankanLocations.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: `${location.city} - ${location.providers} providers`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: location.mapColor,
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 10
          },
          animation: window.google.maps.Animation.DROP
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 320px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="width: 12px; height: 12px; background: ${location.mapColor}; border-radius: 50%; margin-right: 8px;"></div>
                <h3 style="margin: 0; color: #1f2937; font-size: 18px; font-weight: bold;">${location.city}</h3>
              </div>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">${location.province}</p>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px; margin-bottom: 10px;">
                <p style="margin: 0; color: #059669; font-weight: 600; font-size: 14px;">👥 ${location.providers} service providers available</p>
              </div>
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">Population: ${location.population}</p>
              <div style="margin-top: 12px;">
                <p style="margin: 0 0 6px 0; font-weight: 600; color: #374151; font-size: 13px;">🛠️ Available Services:</p>
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                  ${location.services.slice(0, 3).map(service => 
                    `<span style="background: ${location.mapColor}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">${service}</span>`
                  ).join('')}
                  ${location.services.length > 3 ? 
                    `<span style="color: ${location.mapColor}; font-size: 11px; font-weight: 500; background: #f8fafc; padding: 3px 8px; border-radius: 12px;">+${location.services.length - 3} more</span>` : ''}
                </div>
                <button style="background: ${location.mapColor}; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; width: 100%;">
                  View All Services in ${location.city}
                </button>
              </div>
            </div>
          `
        });

        // Add click event to marker
        marker.addListener('click', () => {
          // Close all other info windows
          if (window.currentInfoWindow) {
            window.currentInfoWindow.close();
          }
          infoWindow.open(map, marker);
          window.currentInfoWindow = infoWindow;
          setSelectedLocation(location);
          
          // Smooth pan to marker
          map.panTo({ lat: location.lat, lng: location.lng });
        });

        // Add hover effects for desktop
        if (window.innerWidth > 768) {
          marker.addListener('mouseover', () => {
            marker.setIcon({
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: location.mapColor,
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 4,
              scale: 12
            });
          });

          marker.addListener('mouseout', () => {
            marker.setIcon({
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: location.mapColor,
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 3,
              scale: 10
            });
          });
        }
      });

      // Add a custom control for service categories
      const serviceControl = document.createElement('div');
      serviceControl.innerHTML = `
        <div style="background: white; margin: 10px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 8px;">
          <div style="font-weight: bold; font-size: 12px; color: #374151; margin-bottom: 4px;">🏠 Service Types</div>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            <span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Repair</span>
            <span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Cleaning</span>
            <span style="background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Construction</span>
          </div>
        </div>
      `;
      map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(serviceControl);
    }
  }, [mapLoaded, sriLankanLocations]);

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
        setMapRotation({ x: y * 0.3, y: x * 0.3 });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Enhanced slideshow with play/pause
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
      {/* Light Theme Dynamic Animated Background */}
      <div className="absolute inset-0">
        {/* Slideshow Images with Light Overlay */}
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
        
        {/* Light Theme Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-50/30 to-indigo-100/40" />
        
        {/* Floating Particles - Light Theme */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-blue-400/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `float ${8 + particle.speed}s ease-in-out infinite`,
              animationDelay: `${particle.id * 0.5}s`
            }}
          />
        ))}

        {/* Light Theme Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-indigo-200/25 to-blue-200/25 rounded-full blur-2xl" />
      </div>

      {/* Light Theme Slideshow Controls */}
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

      {/* Light Theme Slide Indicators */}
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
            
            {/* Light Theme Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700/30">
                {image.title}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Content with Light Theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10 w-full">
        <div className="text-center">
          {/* Dynamic Slide Title - Light Theme */}
          <div className="mb-6" style={{animation: 'slideInUp 0.8s ease-out forwards'}}>
            <div className="inline-flex items-center bg-white/70 backdrop-blur-sm rounded-full px-6 py-2 border border-blue-200/50 text-sm text-gray-700 mb-4 shadow-sm">
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              {backgroundImages[currentSlide].subtitle}
            </div>
          </div>

          {/* Light Theme Main Heading */}
          <div style={{animation: 'fadeInUp 1s ease-out forwards'}}>
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
          </div>

          {/* Light Theme Subtitle */}
          <div style={{animation: 'fadeInUp 1s ease-out 0.3s forwards', opacity: 0}}>
            <p className="mt-8 max-w-4xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed">
              {backgroundImages[currentSlide].title} - Connect with verified professionals 
              <span className="block mt-3 text-lg text-blue-600 font-medium">
                <MapPin className="inline h-5 w-5 mr-2" />
                Island-wide coverage • Instant booking • Money-back guarantee
              </span>
            </p>
          </div>

          {/* Light Theme Enhanced Search Bar */}
          <div className="mt-12 max-w-3xl mx-auto" style={{animation: 'fadeInUp 1s ease-out 0.5s forwards', opacity: 0}}>
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
            
            {/* Light Theme Search Suggestions */}
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

          {/* Real Google Map - Sri Lanka Service Coverage */}
          <div className="mt-16" style={{animation: 'fadeInUp 1s ease-out 0.7s forwards', opacity: 0}}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Service Coverage Across Sri Lanka</h2>
              <p className="text-gray-600">Professional services available from Jaffna to Matara</p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl">
                {/* Google Map Container */}
                <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
                  
                  {/* Map Loading State */}
                  {!mapLoaded && (
                    <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-2xl">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading Sri Lanka Service Map...</p>
                        <p className="text-sm text-gray-500 mt-2">Connecting to Google Maps API</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Google Map */}
                  <div 
                    ref={mapRef}
                    className={`h-[500px] w-full rounded-2xl transition-opacity duration-500 ${
                      mapLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Map Controls Overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-xl">
                    <div className="flex items-center font-semibold mb-1 text-gray-800">
                      🗺️ Interactive Service Map
                    </div>
                    <div className="text-xs opacity-90 text-gray-600">Click markers for service details</div>
                  </div>

                  {/* Emergency Hotline */}
                  <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm rounded-xl p-3 border border-red-300/50 shadow-xl text-white">
                    <div className="flex items-center text-sm font-bold">
                      <Phone className="w-4 h-4 mr-2" />
                      Emergency: 1919
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-xl">
                    <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center">
                      🇱🇰 Sri Lanka Service Network
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center text-gray-600">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        Metro areas (1000+ providers)
                      </div>
                      <div className="flex items-center text-gray-600">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                        Provincial capitals (500-999)
                      </div>
                      <div className="flex items-center text-gray-600">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        District centers (200-499)
                      </div>
                    </div>
                  </div>

                  {/* Provincial Coverage Stats */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">9</div>
                      <div className="text-xs text-gray-600 mb-2">Provinces</div>
                      <div className="text-lg font-semibold text-emerald-600">25</div>
                      <div className="text-xs text-gray-600">Districts</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Stats Grid - Sri Lankan Context */}
                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/30">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {sriLankanLocations.reduce((sum, location) => sum + location.providers, 0).toLocaleString()}+
                    </div>
                    <div className="text-sm text-gray-600">Service Providers</div>
                    <div className="text-xs text-blue-600 mt-1">Island-wide network</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/30">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Emergency Service</div>
                    <div className="text-xs text-emerald-600 mt-1">Monsoon season ready</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/30">
                    <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
                    <div className="text-sm text-gray-600">Coverage Rate</div>
                    <div className="text-xs text-purple-600 mt-1">All 9 provinces</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200/30">
                    <div className="text-2xl font-bold text-orange-600 mb-1">3 Languages</div>
                    <div className="text-sm text-gray-600">Support Available</div>
                    <div className="text-xs text-orange-600 mt-1">Sinhala, Tamil, English</div>
                  </div>
                </div>

                {/* Provincial Quick Access */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Quick Access by Province</h3>
                  <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 text-center">
                    {['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Central', 'North Western', 'Uva', 'Sabaragamuwa'].map((province) => (
                      <button
                        key={province}
                        onClick={() => {
                          // Find a location in this province and pan to it
                          const locationInProvince = sriLankanLocations.find(loc => 
                            loc.province.includes(province) || province.includes(loc.province.split(' ')[0])
                          );
                          if (locationInProvince && googleMapRef.current) {
                            googleMapRef.current.panTo({ lat: locationInProvince.lat, lng: locationInProvince.lng });
                            googleMapRef.current.setZoom(9);
                          }
                        }}
                        className="bg-white/60 hover:bg-blue-50 border border-gray-200/50 hover:border-blue-300/50 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 transition-all duration-200 hover:scale-105"
                      >
                        {province}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sri Lankan Context Trust Indicators */}
          <div className="mt-20" style={{animation: 'fadeInUp 1s ease-out 1s forwards', opacity: 0}}>
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
              ].map((stat, index) => (
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

          {/* Enhanced Call-to-Action with Sri Lankan Features */}
          <div className="mt-16" style={{animation: 'fadeInUp 1s ease-out 1.2s forwards', opacity: 0}}>
            <div className="bg-gradient-to-r from-blue-100/70 to-purple-100/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 max-w-4xl mx-auto shadow-xl">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Ready to Experience Sri Lanka's Best Service Network?</h3>
                <p className="text-gray-600 text-lg mb-2">Join thousands of happy customers from Colombo to Jaffna</p>
                <div className="flex items-center justify-center text-sm text-blue-600 font-medium">
                  <Award className="w-4 h-4 mr-2" />
                  Winner: Best Home Services Platform Sri Lanka 2024
                </div>
              </div>

              {/* Special Sri Lankan Features */}
              <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
                <div className="bg-white/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🌴</div>
                  <div className="font-semibold text-gray-800">Tropical Climate Ready</div>
                  <div className="text-gray-600">Monsoon & heat resistant solutions</div>
                </div>
                <div className="bg-white/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🏺</div>
                  <div className="font-semibold text-gray-800">Heritage Home Specialists</div>
                  <div className="text-gray-600">Traditional & modern architecture</div>
                </div>
                <div className="bg-white/60 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-semibold text-gray-800">Power-Cut Solutions</div>
                  <div className="text-gray-600">Generator & UPS installations</div>
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

              {/* Contact Info for Sri Lankan Users */}
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

      {/* Enhanced Custom CSS Animations */}
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

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(90deg); }
          50% { transform: translateY(-16px) rotate(180deg); }
          75% { transform: translateY(-8px) rotate(270deg); }
        }

        /* Google Maps custom styling */
        .gm-style-iw {
          border-radius: 12px;
        }
        
        .gm-style .gm-style-iw-c {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .gm-style .gm-style-iw-t::after {
          background: white;
        }

        /* Map marker pulse animation */
        @keyframes markerPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        /* Loading animation */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Gradient text animation */
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;