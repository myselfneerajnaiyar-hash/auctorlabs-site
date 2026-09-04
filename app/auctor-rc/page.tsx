import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuctorRcDetails, { auctorRcFaqs } from "../components/AuctorRcDetails";

export const metadata: Metadata = {
  title: "Auctor RC: AI-Adaptive Reading Comprehension Practice",
  description: "Auctor RC diagnoses RC mistakes and adapts practice for CAT, XAT, CLAT, IIFT, SNAP, NMAT, TISSNET and CUET English.",
  alternates: { canonical: "https://www.auctorlabs.in/auctor-rc" },
  openGraph: { type: "website", url: "https://auctorlabs.in/auctor-rc", siteName: "Auctor Labs", title: "Auctor RC: AI-Adaptive Reading Comprehension Practice", description: "Adaptive RC practice, mistake diagnosis, Birbal explanations and Reader DNA for competitive-exam students.", images: [{ url: "https://auctorlabs.in/rc-dashboard.png", alt: "Auctor RC adaptive reading comprehension dashboard" }] },
};

export default function AuctorRC() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: auctorRcFaqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#07152D] text-white">
        <AuctorRcDetails />
      </main>
      <Footer />
    </>
  );
}
