"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Journey() {
  return (
    <section className="relative overflow-hidden bg-[#07152D] py-24">

      {/* Background Glow */}

      <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center"
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">

            <Sparkles size={16} />

            Your AI Learning Journey

          </div>

          <h2 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">

            Every Mock Becomes
            <br />

            <span className="text-orange-400">
              A Personal AI Coaching Session
            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">

            Auctor doesn't stop after showing your score.
            Every mock is transformed into a complete AI-powered learning
            experience that identifies mistakes, diagnoses thinking patterns,
            explains every trap and tracks your improvement over time.

          </p>

        </motion.div>

        {/* Infographic */}

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="mt-16"
        >

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0D2142] to-[#09182F] p-4 shadow-[0_20px_80px_rgba(0,0,0,.45)]">

           <img
  src="/journey/journey-infographic.jpeg"
  alt="Auctor AI Learning Journey"
  className="w-full h-auto rounded-2xl object-contain"
/>

          </div>

        </motion.div>

        {/* Bottom CTA */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: .2 }}
          className="mt-14"
        >

          <div className="rounded-[28px] border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-[#0B1D3A] to-cyan-500/10 p-8 md:p-10">

           <div className="mx-auto max-w-3xl text-center">

              <div>

              <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-300">
  BUILT TO IMPROVE EVERY MOCK
</p>

<h3 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
  Every Mock
  <br />
  Makes You Better.
</h3>

<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
  One mock generates five powerful AI reports that explain your mistakes,
  uncover hidden cognitive patterns and give you a clear roadmap for your
  next attempt.
</p>
              </div>
              <div className="flex flex-col items-center gap-5">

               
               <button
  onClick={() =>
    document.getElementById("lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  className="group mt-10 inline-flex items-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:bg-orange-400"
>
  Start 4 Free Mocks

  <ArrowRight
    size={20}
    className="transition-transform duration-300 group-hover:translate-x-1"
  />
</button>

               <p className="mt-5 text-sm text-slate-400">
  10 AI VARC Mocks • 24 CAT PYQs • One-Time Purchase
</p>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}