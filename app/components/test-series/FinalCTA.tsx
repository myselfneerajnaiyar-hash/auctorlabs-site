"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#07152D] py-28">

      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[36px] border border-orange-500/20 bg-gradient-to-br from-[#13233F] to-[#09172E] p-12 text-center md:p-16"
        >

          <div className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
            Your CAT Journey Starts Here
          </div>

          <h2 className="mt-8 text-4xl font-black leading-tight text-white md:text-6xl">
            Don't Just Solve Questions.
            <br />
            Learn How to Think Like a Top Percentiler.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            Practice with AI-powered mock tests, understand every mistake,
            discover your reading patterns and improve with actionable feedback.
            Whether you're trying Auctor for free or unlocking the complete test
            series, your next breakthrough starts here.
          </p>

          <div className="mt-12 flex justify-center">

           <button
  onClick={() =>
    document.getElementById("lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  className="group inline-flex items-center gap-3 rounded-2xl bg-orange-500 px-8 py-5 text-lg font-bold text-white transition hover:bg-orange-400 hover:scale-[1.02]"
>
  Start 4 Free Mocks

  <ArrowRight
    size={20}
    className="transition-transform group-hover:translate-x-1"
  />
</button>
           

          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">

            <span>✓ 4 Free AI Mocks</span>

            <span>✓ Instant Access</span>

            <span>✓ AI Performance Reports</span>

            <span>✓ CAT-Level Experience</span>

          </div>

        </motion.div>

      </div>

    </section>
  );
}