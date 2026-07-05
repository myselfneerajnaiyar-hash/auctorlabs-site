"use client";

import {
  BrainCircuit,
  Send,
  Mic,
  CheckCircle2,
  BookOpen,
  Gauge,
} from "lucide-react";

export default function BirbalMockup() {
  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172a] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15">

            <BrainCircuit className="h-8 w-8 text-orange-400" />

          </div>

          <div>

            <h3 className="text-2xl font-bold text-white">
              Birbal AI
            </h3>

            <p className="text-orange-400 font-medium">
              RC Mentor
            </p>

            <p className="text-sm text-slate-400">
              Ask anything about Reading Comprehension
            </p>

          </div>

        </div>

        <div className="hidden lg:flex rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3">

          <div>

            <p className="text-sm text-slate-300">
              Always here to help
            </p>

            <p className="font-semibold text-green-400">
              24×7 AI Mentor
            </p>

          </div>

        </div>

      </div>

      {/* Suggested Questions */}

      <div className="flex flex-wrap gap-3 border-b border-white/10 p-5">

        <Chip text="Improve inference?" />

        <Chip text="Read RC Faster?" />



      </div>

      {/* Student */}

      <div className="px-6 pt-6">

        <div className="flex gap-4">

         
          <div className="flex-1 rounded-2xl bg-[#16243b] p-5">

            <p className="font-semibold text-blue-300">
              Student
            </p>

            <p className="mt-2 text-lg text-white">
              How do I improve inference questions?
            </p>

          </div>

        </div>

      </div>

      {/* Birbal */}

      <div className="px-6 pt-5">

        <div className="flex gap-4">

         

          <div className="flex-1 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-5">

            <p className="font-semibold text-orange-400">
              Birbal
            </p>

            <p className="mt-3 leading-8 text-slate-300">

              Your inference accuracy is
              <span className="font-bold text-orange-400">
                {" "}
                58%
              </span>

              {" "}while factual accuracy is

              <span className="font-bold text-green-400">
                {" "}
                89%
              </span>.

            </p>

            <div className="mt-5 space-y-3">

              <Task text="Practice one Inference Drill daily" />

              <Task text="Read one Editorial everyday" />

              <Task text="Review your last 5 RC mistakes" />

            </div>

          </div>

        </div>

      </div>

     

      {/* Input */}

      <div className="border-t border-white/10 p-5">

        <div className="flex gap-3">

          <input
            disabled
            placeholder="Ask Birbal anything about RC..."
            className="flex-1 rounded-xl border border-white/10 bg-[#16243b] px-2 py-2 text-slate-400 outline-none"
          />

         

          <button className="rounded-xl bg-blue-600 p-4">

            <Send className="h-5 w-5 text-white" />

          </button>

        </div>

      </div>

    </div>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-blue-500/30 bg-[#16243b] px-4 py-3 text-sm font-medium text-white">
      {text}
    </div>
  );
}

function Task({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">

      <CheckCircle2 className="h-5 w-5 text-green-400" />

      <span className="text-slate-300">
        {text}
      </span>

    </div>
  );
}

function Plan({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">

      <BookOpen className="h-4 w-4 text-cyan-400" />

      <span className="text-slate-300">
        {text}
      </span>

    </div>
  );
}

function Stat({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-[#16243b] p-4">

      <div className="mb-3">
        {icon}
      </div>

      <p className="text-xs text-slate-400">
        {title}
      </p>

      <p className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </p>

    </div>
  );
}