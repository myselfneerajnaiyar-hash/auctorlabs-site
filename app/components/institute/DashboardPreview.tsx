"use client";

import { useState, useEffect } from "react";
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
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
  const checkScreen = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkScreen(); // Run once on mount

  window.addEventListener("resize", checkScreen);

  return () => window.removeEventListener("resize", checkScreen);
}, []);

 useEffect(() => {
  if (!isMobile) return;

  const timer = setInterval(() => {
    setStartIndex((prev) => {
      const next = (prev + 1) % tabs.length;

      setActive(tabs[(next + 1) % tabs.length].id);

      return next;
    });
  }, 3000);

  return () => clearInterval(timer);
}, [isMobile]);

  const current =
    tabs.find((tab) => tab.id === active) ?? tabs[0];
  const visibleTabs = isMobile
  ? [
      tabs[startIndex],
      tabs[(startIndex + 1) % tabs.length],
      tabs[(startIndex + 2) % tabs.length],
    ]
  : tabs;
   
  return (
   <div className="
w-full
max-w-[650px]
mx-auto
rounded-3xl
border
border-white/10
bg-[#111827]
shadow-[0_30px_80px_rgba(0,0,0,0.55)]
overflow-hidden
">

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

        {visibleTabs.map((tab) => {

          const Icon = tab.icon;

          return (

            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
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

     <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4 md:p-5">

        <Card title="Students" value="128" />

        <Card title="Engagement" value="74%" />

        <Card title="Accuracy" value="78%" />

        <Card title="AI Sessions" value="5.4K" />

      </div>

      {/* Screenshot */}

      <div className="border-t border-white/10 bg-black">

      <img
  src={current.image}
  alt={current.label}
  className="block w-full h-auto object-contain"
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
   <div className="min-w-0 rounded-xl border border-white/10 bg-[#1b2435] p-3 md:p-4">

      <p className="text-xs text-slate-400">
        {title}
      </p>

    <p className="mt-2 text-lg sm:text-xl md:text-2xl font-bold text-white break-words">
        {value}
      </p>

    </div>
  );
}