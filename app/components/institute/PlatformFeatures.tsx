"use client";

import BirbalMockup from "./BirbalMockup";
import RCGeneratorMockup from "./RCGeneratorMockup";
import DailyEngagementMockup from "./DailyEngagementMockup";
import DeepAnalyticsMockup from "./DeepAnalyticsMockup";
import SkillDevelopmentMockup from "./SkillDevelopmentMockup";


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

        {/* Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (

              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-[#111827] overflow-hidden"
              >

                <div className="p-6">

                  <div className="inline-flex rounded-xl bg-orange-500/10 p-3">

                    <Icon className="h-6 w-6 text-orange-400" />

                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-slate-400">
                    {feature.subtitle}
                  </p>

                </div>

                <div className="px-4 pb-4">

                  {feature.component}

                </div>

              </div>

            );
          })}

          {/* CTA CARD */}

          <div className="flex flex-col justify-between rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-8">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
                READY TO GROW?
              </p>

              <h3 className="mt-5 text-3xl font-bold text-white">
                Transform VARC Preparation
              </h3>

              <p className="mt-5 leading-7 text-slate-300">
                Give every student an AI mentor, unlimited practice,
                adaptive learning and detailed analytics — all from one
                platform.
              </p>

            </div>

            <button className="mt-10 rounded-xl bg-orange-500 px-6 py-4 font-semibold text-white transition hover:bg-orange-600">
              Book a Free Demo
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}