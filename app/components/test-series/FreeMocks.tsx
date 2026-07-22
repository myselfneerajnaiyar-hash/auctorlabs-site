"use client";

import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  BarChart3,
  CreditCard,
  ArrowRight,
} from "lucide-react";

export default function FreeMocks() {
  return (
    <section className="relative bg-[#07152D] py-24">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[32px] border border-green-500/20 bg-[#0D1E39] p-10 md:p-14"
        >
          <div className="text-center">

            <div className="inline-flex rounded-full bg-green-500/10 border border-green-500/20 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-green-400">
              🎁 FREE Preview
            </div>

            <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
              Not Ready to Buy Yet?
              <br />
              <span className="text-orange-400">
                Experience Auctor for Free.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Get access to <span className="font-bold text-white">4 AI-powered VARC mock tests</span> absolutely free.
              Experience the CAT-like interface, AI-powered analysis and detailed
              performance reports before unlocking the complete test series.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-[#13233F] p-6">
              <FileText className="text-orange-400" size={32} />
              <h3 className="mt-4 text-xl font-bold text-white">
                4 Full-Length VARC Mocks
              </h3>
              <p className="mt-3 text-slate-300">
                Practice on CAT-level passages and questions in a real exam-like environment.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#13233F] p-6">
              <Brain className="text-orange-400" size={32} />
              <h3 className="mt-4 text-xl font-bold text-white">
                AI Performance Analysis
              </h3>
              <p className="mt-3 text-slate-300">
                Discover why you made mistakes and what to improve—not just your score.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#13233F] p-6">
              <BarChart3 className="text-orange-400" size={32} />
              <h3 className="mt-4 text-xl font-bold text-white">
                Detailed Performance Reports
              </h3>
              <p className="mt-3 text-slate-300">
                Explore Reader DNA, strengths, weaknesses and AI-powered insights after every test.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#13233F] p-6">
              <CreditCard className="text-orange-400" size={32} />
              <h3 className="mt-4 text-xl font-bold text-white">
                No Payment Required
              </h3>
              <p className="mt-3 text-slate-300">
                Create your account and start practising immediately. No credit card needed.
              </p>
            </div>

          </div>

          <div className="mt-14 text-center">

           <button
  onClick={() =>
    document.getElementById("lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  className="group inline-flex items-center gap-3 rounded-2xl bg-orange-500 px-10 py-5 text-lg font-bold text-white transition hover:bg-orange-400 hover:scale-[1.02]"
>
              Start 4 Free Mocks

              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <p className="mt-4 text-sm text-slate-400">
              No credit card required • Start in less than a minute
            </p>

          </div>
        </motion.div>

        <div className="my-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Loved the experience? Unlock the complete test series.
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

      </div>
    </section>
  );
}