
'use client';
import React, { useState } from 'react';
import { Wrench, Paintbrush, Car, Shield, Zap, Gauge, CheckCircle, Star, Clock, Award } from 'lucide-react';

const ServicesPage = () => {
  const [activeService, setActiveService] = useState(null);
const services = [
  {
    id: 1,
    title: "Plumbing Services",
    icon: <Wrench className="w-8 h-8" />,
    description: "Expert plumbing solutions for your home",
    features: [
      "Leak detection and repair",
      "Pipe installation and maintenance",
      "Drain cleaning",
      "Faucet and fixture replacement",
      "Water heater installation"
    ],
    price: "Starting from $50",
    duration: "1-4 hours",
    category: "plumbing",
    imageUrl: "https://i.postimg.cc/vm5FFLZq/image.png",
    priceRange: "Economy",
    detailedPricing: [
      { service: "Leak Repair", price: "$50+" },
      { service: "Pipe Replacement", price: "$100+" },
      { service: "Drain Cleaning", price: "$70+" },
      { service: "Water Heater Installation", price: "$200+" }
    ]
  },
  {
    id: 2,
    title: "Electrical Services",
    icon: <Zap className="w-8 h-8" />,
    description: "Safe and reliable electrical repairs and installations",
    features: [
      "Wiring and rewiring",
      "Switch and socket replacement",
      "Circuit breaker repair",
      "Lighting installation",
      "Appliance connection"
    ],
    price: "Starting from $40",
    duration: "1-3 hours",
    category: "electrical",
    imageUrl: "https://i.postimg.cc/W34n6TCG/image.png",
    priceRange: "Economy",
    detailedPricing: [
      { service: "Wiring Repair", price: "$40+" },
      { service: "Circuit Breaker Fix", price: "$60+" },
      { service: "Lighting Installation", price: "$50+" },
      { service: "Socket Replacement", price: "$30+" }
    ]
  },
  {
    id: 3,
    title: "AC Repair & Maintenance",
    icon: <Gauge className="w-8 h-8" />,
    description: "Air conditioning repair and maintenance for all units",
    features: [
      "AC installation and setup",
      "Gas refill",
      "Compressor repair",
      "Filter cleaning and replacement",
      "Thermostat calibration"
    ],
    price: "Starting from $80",
    duration: "2-5 hours",
    category: "ac",
    imageUrl: "https://i.postimg.cc/3RPtKzf2/image.png",
    priceRange: "Standard",
    detailedPricing: [
      { service: "AC Gas Refill", price: "$80+" },
      { service: "Compressor Repair", price: "$150+" },
      { service: "AC Installation", price: "$120+" },
      { service: "Filter Replacement", price: "$40+" }
    ]
  },
  {
    id: 4,
    title: "Freezer & Refrigerator Fix",
    icon: <Shield className="w-8 h-8" />,
    description: "Professional freezer and fridge repair services",
    features: [
      "Temperature control repair",
      "Compressor and motor repair",
      "Defrost system fix",
      "Door seal replacement",
      "Routine maintenance check"
    ],
    price: "Starting from $60",
    duration: "1-3 hours",
    category: "appliances",
    imageUrl: "https://i.postimg.cc/5ybFq36Z/image.png",
    priceRange: "Standard",
    detailedPricing: [
      { service: "Compressor Repair", price: "$120+" },
      { service: "Defrost Repair", price: "$60+" },
      { service: "Door Seal Replacement", price: "$50+" },
      { service: "Routine Maintenance", price: "$40+" }
    ]
  },
  {
    id: 5,
    title: "General Home Repairs",
    icon: <Paintbrush className="w-8 h-8" />,
    description: "Minor home repairs and maintenance tasks",
    features: [
      "Door and window repair",
      "Furniture assembly",
      "Ceiling fan and fixture installation",
      "Cabinet and shelf repair",
      "Small renovation tasks"
    ],
    price: "Starting from $30",
    duration: "1-3 hours",
    category: "general",
    imageUrl: "https://i.postimg.cc/9MNvyx8f/image.png",
    priceRange: "Economy",
    detailedPricing: [
      { service: "Furniture Assembly", price: "$30+" },
      { service: "Door Repair", price: "$40+" },
      { service: "Fan Installation", price: "$35+" },
      { service: "Cabinet Repair", price: "$50+" }
    ]
  }
]

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Excellent paint job on my Honda. Looks brand new!"
    },
    {
      name: "Mike Rodriguez",
      rating: 5,
      comment: "Fast, reliable service. My car runs like a dream now."
    },
    {
      name: "Emma Davis",
      rating: 5,
      comment: "Professional collision repair. You can't even tell there was damage."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Auto Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              From complete repairs to custom paint jobs, we're your one-stop solution for all automotive needs
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                <span>ASE Certified</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>25+ Years Experience</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span>Warranty Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Expert Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional automotive services with state-of-the-art equipment and experienced technicians
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
              onClick={() => setActiveService(activeService === service.id ? null : service.id)}
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.imageUrl} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1632823469936-5108b0cdbd1a?w=500&h=300&fit=crop&auto=format&q=80`;
                  }}
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {service.priceRange}
                </div>
                <div className="absolute bottom-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg text-blue-600">
                  {service.icon}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-blue-600">{service.price}</span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration}
                  </span>
                </div>

                {activeService === service.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Service Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Service Includes:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Detailed Pricing */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Pricing Details:</h4>
                      <div className="space-y-2">
                        {service.detailedPricing.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{item.service}</span>
                            <span className="font-semibold text-blue-600">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Book Service
                      </button>
                      <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                        Get Quote
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Expert Technicians",
                description: "ASE certified professionals with years of experience",
                icon: <Award className="w-8 h-8" />
              },
              {
                title: "Quality Guarantee",
                description: "All work backed by comprehensive warranty",
                icon: <Shield className="w-8 h-8" />
              },
              {
                title: "Fast Service",
                description: "Quick turnaround without compromising quality",
                icon: <Clock className="w-8 h-8" />
              },
              {
                title: "Fair Pricing",
                description: "Transparent pricing with no hidden fees",
                icon: <CheckCircle className="w-8 h-8" />
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8">
            Contact us today for a free estimate on any of our services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Free Quote
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Call (555) 123-4567
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;