import React from 'react';
import HeroSection from '@/app/components/landing/HeroSection';
import FeaturesGrid from '@/app/components/landing/FeaturesGrid';
import HowItWorks from '@/app/components/landing/HowItWorks';
import CallToAction from '@/app/components/landing/CallToAction';


const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <CallToAction />
    </div>
  );
};

export default LandingPage;