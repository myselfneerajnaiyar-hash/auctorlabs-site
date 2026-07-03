import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Hero from "../components/institute/Hero";

export default function InstitutePage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#07152D] text-white overflow-hidden">

        <Hero />

      </main>

      <Footer />
    </>
  );
}