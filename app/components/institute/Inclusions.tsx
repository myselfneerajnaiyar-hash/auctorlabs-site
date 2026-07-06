"use client";
import { useState } from "react";

import {
  Brain,
  LayoutGrid,
  GraduationCap,
  Palette,
  Headset,
  Check,
} from "lucide-react";

const inclusions = [
  {
    icon: Brain,
    title: "AI Platform for Students",
    description:
      "A complete AI-powered learning platform designed to improve every student's reading ability.",
    items: [
      "Birbal AI Mentor",
      "Unlimited RC Generator",
      "Daily Workouts",
      "Adaptive Skill Development",
      "Deep Learning Analytics",
    ],
  },
  {
    icon: LayoutGrid,
    title: "Institute Dashboard",
    description:
      "Monitor engagement, track batches and understand student performance in one place.",
    items: [
      "Student Management",
      "Batch Analytics",
      "Reading IQ Dashboard",
      "Leaderboards",
      "Performance Reports",
    ],
  },
  {
    icon: GraduationCap,
    title: "Student Experience",
    description:
      "Students stay engaged through gamification, AI guidance and continuous practice.",
    items: [
      "Daily Streaks",
      "Leaderboards",
      "Instant AI Feedback",
      "Mobile Friendly",
      "Personalised Learning",
    ],
  },
  {
    icon: Palette,
    title: "Your Brand. Your Platform.",
    description:
      "Offer students a premium learning platform completely branded for your institute.",
    items: [
      "Institute Logo",
      "Institute Branding",
      "Dedicated Portal",
      "Professional Experience",
      "Premium Look & Feel",
    ],
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    description:
      "Our team works closely with your institute before and after launch.",
    items: [
      "Complete Onboarding",
      "Faculty Orientation",
      "Priority WhatsApp Support",
      "Regular Updates",
      "Dedicated Success Manager",
    ],
  },
];

export default function Inclusions() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-20">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <p className="uppercase tracking-[0.3em] text-orange-400 text-sm font-semibold">
            EVERYTHING INCLUDED
          </p>

          <h2 className="mt-5 text-4xl md:text-6xl font-black text-white">
            Everything You Get
            <br />
            With Every Partnership
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            More than software. A complete ecosystem designed to help your
            students, faculty and institute succeed.
          </p>

        </div>

        {/* Cards */}

        {/* Tabs */}

<div className="mt-10 grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center">

  {inclusions.map((item, index) => {
    const Icon = item.icon;

    return (
      <button
        key={item.title}
        onClick={() => setActive(index)}
        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all
        ${
          index === inclusions.length - 1
            ? "col-span-2 md:col-span-1"
            : ""
        }
        ${
          active === index
            ? "bg-orange-500 text-white"
            : "border border-white/10 bg-[#101828] text-slate-300 hover:bg-[#1b2435]"
        }`}
      >
        <Icon size={18} />
        <span>
          {item.title.replace("Your Brand. Your Platform.", "Branding")}
        </span>
      </button>
    );
  })}

</div>

{/* Active Card */}

<div className="mt-10 rounded-3xl border border-white/10 bg-[#101828] p-8">

  {(() => {
    const item = inclusions[active];
    const Icon = item.icon;

    return (
      <>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
          <Icon className="h-8 w-8 text-orange-400" />
        </div>

        <h3 className="mt-6 text-3xl font-bold text-white">
          {item.title}
        </h3>

        <p className="mt-4 leading-7 text-slate-400">
          {item.description}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">

          {item.items.map((point) => (
            <div
              key={point}
              className="flex items-center gap-3"
            >
              <div className="rounded-full bg-green-500/15 p-1">
                <Check
                  size={16}
                  className="text-green-400"
                />
              </div>

              <span className="text-slate-300">
                {point}
              </span>
            </div>
          ))}

        </div>
      </>
    );
  })()}

</div>

      </div>

    </section>
  );
}