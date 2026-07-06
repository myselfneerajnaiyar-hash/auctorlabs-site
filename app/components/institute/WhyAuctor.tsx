"use client";
import { useState } from "react";

import {
  GraduationCap,
  Users,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const sections = [
  {
    icon: GraduationCap,
    title: "Improve Student Outcomes",
    description:
      "Give every student personalised learning, unlimited practice and instant AI guidance that improves consistency and academic performance.",
    points: [
      "Personalised learning",
      "Unlimited practice",
      "Instant AI feedback",
    ],
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: Users,
    title: "Empower Your Faculty",
    description:
      "Reduce repetitive doubt solving, automate performance tracking and help teachers spend more time mentoring instead of administrative work.",
    points: [
      "AI solves routine doubts",
      "Automatic performance tracking",
      "More time for teaching",
    ],
    gradient: "from-purple-500/20 to-indigo-500/10",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Institute",
    description:
      "Differentiate your institute with an AI-powered learning platform that attracts more admissions, improves retention and builds a premium brand.",
    points: [
      "Increase student engagement",
      "Improve retention",
      "Differentiate from competitors",
      "Build a premium brand",
    ],
    gradient: "from-orange-500/20 to-red-500/10",
  },
];

export default function WhyAuctor() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            WHY AUCTOR
          </p>

          <h2 className="mt-5 text-4xl md:text-6xl font-black text-white">
            AI That Benefits Everyone.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Auctor doesn't just improve student learning. It empowers
            faculty and helps institutes grow in an increasingly
            competitive education landscape.
          </p>

        </div>

       {/* Tabs */}

<div className="mt-10 grid grid-cols-3 gap-3">

  {sections.map((section, index) => {
    const Icon = section.icon;

    return (
      <button
        key={section.title}
        onClick={() => setActive(index)}
        className={`flex flex-col items-center rounded-xl px-4 py-4 transition-all
        ${
          active === index
            ? "bg-orange-500 text-white"
            : "border border-white/10 bg-[#101828] text-slate-300"
        }`}
      >
        <Icon size={26} />

        <span className="mt-2 text-sm font-semibold text-center">
          {section.title.replace("Improve ", "").replace("Empower ", "").replace("Grow Your ", "")}
        </span>

      </button>
    );
  })}

</div>

{/* Active Card */}

<div className="mt-10 rounded-3xl border border-white/10 bg-[#101828] p-8">

  {(() => {

    const section = sections[active];
    const Icon = section.icon;

    return (
      <>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">

          <Icon className="h-8 w-8 text-orange-400" />

        </div>

        <h3 className="mt-6 text-3xl font-bold text-white">

          {section.title}

        </h3>

        <p className="mt-5 text-lg leading-8 text-slate-300">

          {section.description}

        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">

          {section.points.map((point) => (

            <div
              key={point}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >

              <CheckCircle2
                size={18}
                className="text-green-400"
              />

              <span className="text-white">

                {point}

              </span>

            </div>

          ))}

        </div>

      </>
    );

  })()}

</div>

        {/* Closing Banner */}

        <div className="mt-10 rounded-[32px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-12 text-center">

          <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">

            The institutes adopting AI today
            <br />
            will lead the next decade of education.

          </h3>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">

            Give your students a learning experience they'll remember,
            empower your faculty and build an institute that's ready
            for the future.

          </p>

          <button className="mt-10 rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-600">

            Book Your Free Demo

          </button>

        </div>

      </div>

    </section>
  );
}