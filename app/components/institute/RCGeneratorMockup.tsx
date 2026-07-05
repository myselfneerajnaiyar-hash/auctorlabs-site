"use client";

import {
  BookOpen,
  CheckCircle2,
  FileText,
  Clock3,
  Brain,
} from "lucide-react";

export default function RCGeneratorMockup() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#13203a] to-[#0b1220] p-7 shadow-2xl">

      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15">

          <BookOpen className="h-7 w-7 text-orange-400" />

        </div>

        <div>

          <h3 className="text-2xl font-bold text-white">
            Reading Comprehension Generator
          </h3>

          <p className="text-slate-400 text-sm">
            Generate unlimited AI practice passages.
          </p>

        </div>

      </div>

      {/* Description */}

      <p className="mt-8 text-slate-300 leading-7">
        Train on AI-generated passages designed to improve
        comprehension, inference, critical reasoning and reading speed.
      </p>

      {/* Features */}

      <div className="mt-8 space-y-4">

        {[
          {
            icon: FileText,
            text: "Genre-wise passages",
          },
          {
            icon: Brain,
            text: "Difficulty selection",
          },
          {
            icon: CheckCircle2,
            text: "Fresh passage every time",
          },
          {
            icon: Clock3,
            text: "Reading time estimation",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.text}
              className="flex items-center gap-4"
            >
              <div className="rounded-full bg-green-500/15 p-2">

                <Icon
                  size={18}
                  className="text-green-400"
                />

              </div>

              <span className="text-white">
                {item.text}
              </span>

            </div>
          );
        })}

      </div>

      {/* Generator */}

      <div className="mt-10 rounded-2xl border border-white/10 bg-[#18243d] p-5">

        <p className="text-sm font-semibold text-white">
          Generate New Passage
        </p>

        <div className="mt-5 flex flex-wrap gap-3">

          <div className="rounded-lg bg-[#24324b] px-5 py-3 text-white">
            Psychology
          </div>

          <div className="rounded-lg bg-[#24324b] px-5 py-3 text-white">
            Moderate
          </div>

          <div className="rounded-lg bg-[#24324b] px-5 py-3 text-white">
            500 Words
          </div>

        </div>

        <button className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">

          Generate Passage

        </button>

      </div>

    </div>
  );
}