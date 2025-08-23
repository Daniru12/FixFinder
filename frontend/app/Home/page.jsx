import React from 'react';

// Import your converted components
import Hero from '../components/Hero';
import FeaturedServices from '../components/FeaturedServices';
import TestimonialSection from '../components/TestimonialSection';
import CTASection from '../components/CTASection';
import TrustIndicators from '../components/TrustIndicators';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <Hero />

      {/* Featured Services */}
      <FeaturedServices />

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Home;