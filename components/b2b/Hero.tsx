"use client";

import {
 Building2,
  BrainCircuit,
  BarChart3,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 bg-[#07152D]" />

      <div className="absolute left-[-250px] top-[-200px] h-[700px] w-[700px] rounded-full bg-blue-600/20 blur-[160px]" />

      <div className="absolute right-[-250px] top-[150px] h-[600px] w-[600px] rounded-full bg-orange-500/10 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        <div className="grid min-h-screen items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold tracking-wider text-orange-400">

              FOR COACHING INSTITUTES

            </div>

            <h1 className="mt-8 text-6xl font-black leading-[1.05] tracking-tight text-white">

              Build the smartest

              <br />

              coaching institute

              <br />

              with

              <span className="text-orange-500">

                {" "}AI.

              </span>

            </h1>

            <p className="mt-8 max-w-xl text-xl leading-9 text-slate-300">

              Give every student an AI Reading Mentor while your institute tracks
              performance through one beautiful dashboard.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <button className="rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:scale-105">

                Book Free Demo

              </button>

              <button className="rounded-xl border border-slate-700 bg-slate-900/40 px-8 py-4 font-semibold text-white">

                View Dashboard

              </button>

            </div>

            <div className="mt-10 grid gap-5">

              <Feature
                icon={<BrainCircuit size={20} />}
                text="AI Reading Mentor for every student"
              />

              <Feature
                icon={<BarChart3 size={20} />}
                text="Complete institute analytics"
              />

              <Feature
                icon={<Building2 size={20} />}
                text="Runs under your own brand"
              />

            </div>

           

          </div>

          {/* RIGHT */}

         <div className="relative h-[700px]">

</div>

        </div>

      </div>

    </section>
  );
}

function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="rounded-xl bg-blue-500/20 p-3 text-blue-400">

        {icon}

      </div>

      <p className="text-lg text-slate-200">

        {text}

      </p>

    </div>
  );
}