import Header from "../components/test-series/Header";
import Footer from "../components/test-series/Footer";

import Hero from "../components/test-series/Hero";
import WhatYouGet from "../components/test-series/WhatYouGet";
import WhyAuctor from "../components/test-series/WhyAuctor";
import TestInterface from "../components/test-series/TestInterface";
import AIReport from "../components/test-series/AIReport";
import ProgressTracking from "../components/test-series/ProgressTracking";
import CreatedBy from "../components/test-series/CreatedBy";
import Testimonials from "../components/test-series/Testimonials";
import Pricing from "../components/test-series/Pricing";
import FAQ from "../components/test-series/FAQ";
import FinalCTA from "../components/test-series/FinalCTA";
import Comparison from "../components/test-series/Comparison";
import Journey from "../components/test-series/Journey";

export default function TestSeriesPage() {
  return (
    <>
      <Header />

      <main className="bg-[#07152D] text-white">

        <Hero />
        <WhyAuctor />
        <WhatYouGet />
        <Comparison />
        <Journey />
        <Testimonials />

        {/* 

        

        <TestInterface />

        <AIReport />

        <ProgressTracking />

        <CreatedBy />

        

        <Pricing />

        <FAQ />

        <FinalCTA /> */}

      </main>

      <Footer />
    </>
  );
}