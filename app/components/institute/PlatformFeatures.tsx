"use client";

import BirbalMockup from "./BirbalMockup";
import RCGeneratorMockup from "./RCGeneratorMockup";
import DailyEngagementMockup from "./DailyEngagementMockup";
import DeepAnalyticsMockup from "./DeepAnalyticsMockup";
import SkillDevelopmentMockup from "./SkillDevelopmentMockup";


import { useState } from "react";

import {
  BrainCircuit,
  BookOpen,
  Trophy,
  BarChart3,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "24×7 AI Mentor",
    subtitle: "Personalised guidance for every student.",
    icon: BrainCircuit,
    component: <BirbalMockup />,
  },
  {
    title: "Unlimited RC Generator",
    subtitle: "Generate unlimited AI practice passages.",
    icon: BookOpen,
    component: <RCGeneratorMockup />,
  },
  {
    title: "Daily Engagement",
    subtitle: "Challenges, streaks & leaderboards.",
    icon: Trophy,
    component: <DailyEngagementMockup />,
  },
  {
    title: "Deep Analytics",
    subtitle: "Track every student's improvement.",
    icon: BarChart3,
    component: <DeepAnalyticsMockup />,
  },
  {
    title: "Skill Development",
    subtitle: "Adaptive learning that builds reading skills.",
    icon: Zap,
    component: <SkillDevelopmentMockup />,
  },
];

export default function PlatformFeatures() {

  const [active, setActive] = useState(0);
  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            PLATFORM FEATURES
          </p>

          <h2 className="mt-5 text-4xl font-black text-white md:text-6xl">
            Everything Your Students Need
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            One intelligent platform that combines AI mentoring,
            engagement, unlimited practice and deep analytics.
          </p>

        </div>

       {/* Feature Tabs */}

<div className="mt-8 grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center">

  {features.map((feature, index) => {
    const Icon = feature.icon;

    return (
      <button
        key={feature.title}
        onClick={() => setActive(index)}
       className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all
${
  index === features.length - 1
    ? "col-span-2 md:col-span-1"
    : ""
}
${
  active === index
    ? "bg-orange-500 text-white"
    : "border border-white/10 bg-[#111827] text-slate-300 hover:bg-[#1b2435]"
}`}
      >
        <Icon size={18} />
        <span>{feature.title}</span>
      </button>
    );
  })}

</div>

{/* Active Feature */}

<div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111827]">

  <div className="p-6">

    <div className="inline-flex rounded-xl bg-orange-500/10 p-3">

      {(() => {
        const Icon = features[active].icon;
        return <Icon className="h-6 w-6 text-orange-400" />;
      })()}

    </div>

    <h3 className="mt-5 text-3xl font-bold text-white">

      {features[active].title}

    </h3>

    <p className="mt-3 text-slate-400">

      {features[active].subtitle}

    </p>

  </div>

  <div className="px-4 pb-4">

    {features[active].component}

  </div>

</div>

{/* CTA */}

<div className="mt-12 text-center">

  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
    READY TO GROW?
  </p>

  <h3 className="mt-4 text-3xl font-bold text-white">
    Transform VARC Preparation
  </h3>

  <p className="mx-auto mt-4 max-w-2xl text-slate-300">
    Give every student an AI mentor, unlimited practice, adaptive learning and detailed analytics — all from one platform.
  </p>

  <button className="mt-8 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600">
    Book a Free Demo
  </button>

</div>
             
      </div>

    </section>
  );
}