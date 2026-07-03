"use client";

import { useState } from "react";
import {
  Home,
  BookOpen,
  Brain,
  Zap,
  BarChart3,
  GraduationCap,
} from "lucide-react";

const tabs = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    image: "/institute/home.png",
  },
  {
    id: "rc",
    label: "RC",
    icon: BookOpen,
    image: "/institute/rc.png",
  },
  {
    id: "speed",
    label: "Speed",
    icon: Zap,
    image: "/institute/speed.png",
  },
  {
    id: "workout",
    label: "Workout",
    icon: Brain,
    image: "/institute/workout.png",
  },
  {
    id: "coach",
    label: "AI Coach",
    icon: GraduationCap,
    image: "/institute/coach.png",
  },
];

export default function DashboardPreview() {
  const [active, setActive] = useState("home");

  const current =
    tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] shadow-2xl overflow-hidden">

      {/* Top */}

      <div className="border-b border-white/10 bg-[#0f172a] px-6 py-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-white text-xl font-bold">
              ABC Institute
            </p>

            <p className="text-slate-400 text-sm">
              Institute Analytics Dashboard
            </p>

          </div>

          <div className="rounded-full bg-green-500/20 px-4 py-2 text-xs font-semibold text-green-400">

            Live Demo

          </div>

        </div>

      </div>

      {/* Tabs */}

      <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-[#111827] p-4">

        {tabs.map((tab) => {

          const Icon = tab.icon;

          return (

            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                active === tab.id
                  ? "bg-orange-500 text-white"
                  : "bg-[#1b2435] text-slate-300 hover:bg-[#263248]"
              }`}
            >
              <Icon size={16} />

              {tab.label}

            </button>

          );

        })}

      </div>

      {/* KPI */}

      <div className="grid grid-cols-2 gap-4 p-5 lg:grid-cols-4">

        <Card title="Students" value="1,248" />

        <Card title="Engagement" value="93%" />

        <Card title="Accuracy" value="78%" />

        <Card title="AI Sessions" value="18.4K" />

      </div>

      {/* Screenshot */}

      <div className="border-t border-white/10 bg-black">

        <img
          src={current.image}
          alt={current.label}
          className="w-full object-cover"
        />

      </div>

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1b2435] p-4">

      <p className="text-xs text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>

    </div>
  );
}