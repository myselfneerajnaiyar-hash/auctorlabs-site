"use client";

import {
  Zap,
  BookOpen,
 Brain,
  CheckCircle2,
} from "lucide-react";

export default function SkillDevelopmentMockup() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#13203a] to-[#0b1220] p-6 shadow-2xl">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-xl font-bold text-white">
            Skill Development
          </h3>

          <p className="text-sm text-slate-400">
            Build every reading skill in one place
          </p>

        </div>

        <div className="rounded-xl bg-orange-500/15 px-3 py-2 text-sm font-semibold text-orange-400">
          4 Modules
        </div>

      </div>

      {/* Skill Cards */}

      <div className="mt-8 space-y-4">

        <SkillCard
          icon={<Zap className="h-5 w-5 text-yellow-400" />}
          title="Speed Drills"
          progress={92}
        />

        <SkillCard
          icon={<Brain className="h-5 w-5 text-cyan-400" />}
          title="Adaptive Drills"
          progress={81}
        />

        <SkillCard
          icon={<BookOpen className="h-5 w-5 text-orange-400" />}
          title="Vocabulary Lab"
          progress={74}
        />

      </div>

      {/* Today's Recommendation */}

      <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">

        <div className="flex items-center gap-3">

          <CheckCircle2 className="h-6 w-6 text-green-400" />

          <div>

            <p className="font-semibold text-green-300">
              Today's Recommendation
            </p>

            <p className="text-sm text-slate-300">
              Complete one Speed Drill and one Vocabulary Lab to improve your Reading IQ.
            </p>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <button className="mt-8 w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600">

        Continue Skill Training →

      </button>

    </div>
  );
}

function SkillCard({
  icon,
  title,
  progress,
}: {
  icon: React.ReactNode;
  title: string;
  progress: number;
}) {
  return (
    <div className="rounded-2xl bg-[#18243d] p-4">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          {icon}

          <span className="font-medium text-white">
            {title}
          </span>

        </div>

        <span className="text-sm font-semibold text-orange-400">
          {progress}%
        </span>

      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-700">

        <div
          className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-cyan-400"
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>
  );
}