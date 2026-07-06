import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Hero from "../components/institute/Hero";
import WhyNow from "../components/institute/WhyNow";
import PlatformFeatures from "../components/institute/PlatformFeatures";
import DemoForm from "../components/institute/DemoForm";
import WhyAuctor from "../components/institute/WhyAuctor";
import Testimonials from "../components/institute/Testimonials";
import Inclusions from "../components/institute/Inclusions";
import FAQ from "../components/institute/FAQ";

export default function InstitutePage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#07152D] text-white">

        <Hero />
         <PlatformFeatures />
          <Inclusions />
          <WhyAuctor />
          <DemoForm />
          <Testimonials />
        <WhyNow />
       
         
        
        
        
        <FAQ />
       

      </main>

      <Footer />
    </>
  );
}