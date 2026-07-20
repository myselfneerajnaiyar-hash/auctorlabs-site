import Header from "../components/test-series/Header";
import Footer from "../components/test-series/Footer";

import Hero from "../components/test-series/Hero";
import WhatYouGet from "../components/test-series/WhatYouGet";
import WhyAuctor from "../components/test-series/WhyAuctor";

import Testimonials from "../components/test-series/Testimonials";

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

       

        

       

      </main>

      <Footer />
    </>
  );
}