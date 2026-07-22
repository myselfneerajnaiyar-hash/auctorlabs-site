import Header from "../components/test-series/Header";
import Footer from "../components/test-series/Footer";

import Hero from "../components/test-series/Hero";
import WhatYouGet from "../components/test-series/WhatYouGet";
import WhyAuctor from "../components/test-series/WhyAuctor";
import Pricing from "../components/test-series/Pricing";

import Testimonials from "../components/test-series/Testimonials";
import FAQ from "../components/test-series/FAQ";

import Comparison from "../components/test-series/Comparison";
import Journey from "../components/test-series/Journey";
import FreeMocks from "../components/test-series/FreeMocks";
import FinalCTA from "../components/test-series/FinalCTA";
import LeadCapture from "../components/test-series/LeadCapture";

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
        <LeadCapture />
        <Testimonials />
        <FreeMocks />
        <Pricing />
        <FAQ />
        <FinalCTA />

       

        

       

      </main>

      <Footer />
    </>
  );
}