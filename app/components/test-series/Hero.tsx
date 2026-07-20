"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles, Brain, TriangleAlert, Target } from "lucide-react";

export default function Hero() {
  return (
   <section className="relative overflow-hidden bg-[#07152D] pt-20 pb-16 lg:pt-28 lg:pb-20">
      {/* Background Glow */}
      <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300">
              <Sparkles size={16} />
              CAT 2026 | AI Powered VARC Test Series
            </div>

            {/* Heading */}
           <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
             CAT 2026 VARC
<br />

<span className="text-orange-400">
Test Series
</span>

<br />
<br />

10 AI Mocks.
<br />

24 CAT PYQs.
<br />

Know Why You Lost Marks.
            </h1>

            {/* Description */}
           <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
Every mock comes with AI-powered diagnosis,
cognitive analysis, detailed performance reports,
and personalized mentor feedback so you know
exactly why your score improved—or didn't.
</p>

            {/* Price */}
            <div className="mt-10">
              <p className="text-sm uppercase tracking-widest text-orange-300">
               Launch Offer
              </p>

              <div className="mt-2 flex items-end gap-3">
                <span className="text-6xl font-black text-white">₹799</span>

                <span className="pb-2 text-lg text-slate-400">
                 34 Full-Length VARC Mocks
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-4 font-semibold text-white transition hover:bg-orange-600"
              >
                Buy Now • ₹799
                <ArrowRight size={18} />
              </Link>

              <Link
                href="#ai-report"
                className="rounded-xl border border-white/20 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
               See AI Analysis
              </Link>
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-4">

              {[
"10 AI VARC Mocks",
"24 CAT PYQs",
"Cognitive Diagnosis",
"Overall Analytics",
"Mentor Verdict",
"Trap Analysis",
].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                >
                  <CheckCircle
                    size={18}
                    className="text-orange-400"
                  />

                  <span className="text-sm text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>

          </div>

         {/* RIGHT */}
<div className="relative">

  <div className="rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl">

    <div className="relative overflow-hidden rounded-2xl">

      <img
        src="/images/mentor-verdict.jpeg"
        alt="AI Analytics"
        className="w-full rounded-2xl"
      />

     
</div>
</div>

</div>
</div>
</div>
    </section>
  );
}