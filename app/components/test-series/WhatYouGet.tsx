"use client";

import { useState } from "react";
import {
  FileText,
  BookOpen,
  Brain,
  BarChart3,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  {
    title: "10 AI Mocks",
    icon: FileText,
    image: "/images/ai-mocks.png",
    badge: "10 ORIGINAL AI MOCKS",
    features: [
      "CAT-Level Difficulty",
      "Fresh RC Passages",
      "40 Minute Tests",
      "Instant AI Analysis",
    ],
  },
  {
    title: "24 CAT PYQs",
    icon: BookOpen,
    image: "/images/pyqs.png",
    badge: "24 OFFICIAL CAT PAPERS",
    features: [
      "CAT 2020–2025",
      "Original Questions",
      "Real CAT Interface",
      "AI Analysis Included",
    ],
  },
  {
    title: "AI Reports",
    icon: Brain,
    image: "/images/ai-report-collage.png",
    badge: "AI POWERED REPORTS",
    features: [
      "Mentor Verdict",
      "Cognitive Diagnosis",
      "Trap Analysis",
      "Reading Skill Radar",
    ],
  },
  {
    title: "Performance",
    icon: BarChart3,
    image: "/images/performance.png",
    badge: "TRACK EVERYTHING",
    features: [
      "Accuracy Trends",
      "RC vs VA",
      "Skill Growth",
      "Mock Comparison",
    ],
  },
];

export default function WhatYouGet() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#08172f] py-24">

      <div className="mx-auto max-w-6xl px-6">

        <div className="text-center">

          <p className="text-orange-400 font-semibold tracking-[0.3em] uppercase">
            EVERYTHING INCLUDED
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-black text-white">
            All This
            <span className="text-orange-400"> For Just ₹799.</span>
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-slate-300 text-lg">
            One purchase. Lifetime access. Everything required to prepare for
            CAT VARC with AI-powered guidance.
          </p>

        </div>

        {/* Tabs */}

        <div className="mt-14 grid grid-cols-2 gap-4">

          {tabs.map((tab, index) => {

            const Icon = tab.icon;

            return (

              <button
                key={tab.title}
                onClick={() => setActive(index)}
                className={`rounded-2xl py-4 px-5 transition-all duration-300 flex items-center justify-center gap-3

                ${
                  active === index
                    ? "bg-orange-500 text-white shadow-xl shadow-orange-500/30"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >

                <Icon size={20} />

                <span className="font-semibold">
                  {tab.title}
                </span>

              </button>

            );

          })}

        </div>

        <AnimatePresence mode="wait">

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.35 }}
            className="mt-14"
          >

           

            {/* Browser */}

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0f223d] shadow-2xl shadow-blue-900/20 lg:max-w-5xl lg:mx-auto">

              {/* Browser Header */}

              <div className="flex items-center gap-2 border-b border-white/10 bg-[#122744] px-5 py-4">

                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>

                <div className="ml-5 text-sm text-slate-400">
                  Auctor Labs
                </div>

              </div>

              <img
  src={tabs[active].image}
  alt={tabs[active].title}
  className="w-full object-cover"
/>

            </div>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4">

  {tabs[active].features.map((feature, index) => {

    const colors = [
      "border-cyan-500/30 bg-cyan-500/10",
      "border-violet-500/30 bg-violet-500/10",
      "border-emerald-500/30 bg-emerald-500/10",
      "border-orange-500/30 bg-orange-500/10",
    ];

    return (
      <div
        key={feature}
        className={`flex items-center gap-3 rounded-2xl border px-4 py-4 transition-all duration-300 hover:scale-[1.03] ${colors[index]}`}
      >
        <Check
          size={18}
          className="shrink-0 text-white"
        />

        <span className="text-sm font-medium text-white">
          {feature}
        </span>

      </div>
    );

  })}

</div>

          </motion.div>

        </AnimatePresence>

       

      </div>

    </section>
  );
}