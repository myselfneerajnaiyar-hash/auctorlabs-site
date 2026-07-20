"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Target,
  TrendingUp,
  TriangleAlert,
  CheckCircle,
} from "lucide-react";

const tabs = [
  {
    title: "Cognitive Diagnosis",
    icon: Brain,
    image: "/images/cognitive-diagnosis.png",
    description:
      "Identify the exact thinking habits reducing your VARC score. Instead of simply showing right and wrong answers, Auctor diagnoses the cognitive leaks responsible for your mistakes.",
    points: [
      "Identify cognitive leaks",
      "Reading behaviour analysis",
      "Personalised improvement plan",
    ],
  },
  {
    title: "AI Mentor Verdict",
    icon: Target,
    image: "/images/mentor.png",
    description:
      "Receive a detailed AI mentor review after every mock explaining your performance, strengths, weaknesses and next steps.",
    points: [
      "Personalised AI feedback",
      "Strength & weakness analysis",
      "Actionable recommendations",
    ],
  },
  {
    title: "Trap Analysis",
    icon: TriangleAlert,
    image: "/images/trap-analysis.png",
    description:
      "Discover exactly which CAT trap types fooled you and why they continue to affect your scores.",
    points: [
      "Partial Truth traps",
      "Scope Shift traps",
      "Logical Flow traps",
    ],
  },
  {
    title: "Overall Analytics",
    icon: TrendingUp,
    image: "/images/progress-analytics.png",
    description:
      "Track your performance across all 34 mocks with detailed trends, RC vs VA analysis and long-term progress.",
    points: [
      "Accuracy trends",
      "RC vs VA comparison",
      "Performance improvement",
    ],
  },
];

export default function WhyAuctor() {
  const [activeTab, setActiveTab] = useState(0);

  const active = tabs[activeTab];
  const Icon = active.icon;

  return (
    <section className="bg-[#07152D] py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-[0.25em] text-orange-400">
            WHY AUCTOR?
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
            Every Mock Doesn't Just Give You A Score.
            <br />
            <span className="text-orange-400">
              It Explains Your Reading Mind.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Most CAT test series tell you what was wrong.
            Auctor tells you why you made that mistake and how to avoid repeating it.
          </p>

        </div>

        {/* Tabs */}

      <div className="mt-16 grid grid-cols-2 gap-3 md:flex md:flex-wrap">

          {tabs.map((tab, index) => {

            const TabIcon = tab.icon;

            return (
              <button
                key={tab.title}
                onClick={() => setActiveTab(index)}
               className={`flex items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-medium transition-all duration-300

${
  activeTab === index
    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
    : "bg-white/5 text-slate-300 hover:bg-white/10"
}`}
              >
                <TabIcon size={18} />
                <span className="font-medium">{tab.title}</span>
              </button>
            );
          })}

        </div>

        {/* Content */}

      <AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="mt-10 grid items-center gap-12 lg:grid-cols-2"
  >

          {/* Screenshot */}

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

            <img
              src={active.image}
              alt={active.title}
              className="w-full"
            />

          </div>

          {/* Details */}

          <div>

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-orange-500/20 p-3">
                <Icon className="h-7 w-7 text-orange-400" />
              </div>

              <h3 className="text-3xl font-bold text-white">
                {active.title}
              </h3>

            </div>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              {active.description}
            </p>

            <div className="mt-8 space-y-4">

              {active.points.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3"
                >
                  <CheckCircle
                    className="mt-1 text-orange-400"
                    size={20}
                  />

                  <span className="text-slate-200">
                    {point}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}