"use client";

import { CheckCircle2, ShieldCheck, Zap, Infinity, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "10 AI VARC Mock Tests",
  "24 Official CAT Previous Year Papers",
  "AI Mentor Verdict",
  "Cognitive Diagnosis",
  "Trap Analysis",
  "Reader DNA Report",
  "Detailed Explanations",
  "Performance Dashboard",
  
];

export default function Pricing() {
  return (
    <section className="relative overflow-hidden bg-[#07152D] py-24">

      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-6xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center"
        >

          <div className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
            Pricing
          </div>

          <h2 className="mt-6 text-4xl font-black text-white md:text-6xl">
            Simple Pricing.
            <br />
            Powerful Results.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Everything you need to master CAT VARC with AI-powered feedback,
            detailed analysis and previous year papers.
          </p>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: .15 }}
          className="mx-auto mt-16 max-w-3xl"
        >

          <div className="rounded-[36px] border border-orange-500/30 bg-gradient-to-br from-[#13233F] to-[#09172E] p-10 shadow-[0_25px_80px_rgba(0,0,0,.45)]">

            <div className="flex justify-center">

              <div className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold uppercase tracking-wider text-white">
                🔥 Launch Offer
              </div>

            </div>

            <div className="mt-10 text-center">

              <p className="text-slate-400 line-through text-2xl">
                ₹1199
              </p>

              <h3 className="mt-2 text-7xl font-black text-white">
                ₹799
              </h3>

              <div className="mt-3 inline-flex rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400">
                Save 33%
              </div>

            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">

              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    size={22}
                    className="text-green-400"
                  />

                  <span className="text-slate-200">
                    {feature}
                  </span>
                </div>
              ))}

            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">

              <div className="rounded-xl border border-white/10 bg-[#162742] p-5 text-center">

                <ShieldCheck
                  className="mx-auto text-orange-400"
                  size={28}
                />

                <p className="mt-3 font-semibold text-white">
                  Secure Payment
                </p>

              </div>

              <div className="rounded-xl border border-white/10 bg-[#162742] p-5 text-center">

                <Zap
                  className="mx-auto text-orange-400"
                  size={28}
                />

                <p className="mt-3 font-semibold text-white">
                  Instant Access
                </p>

              </div>

              <div className="rounded-xl border border-white/10 bg-[#162742] p-5 text-center">

                <Infinity
                  className="mx-auto text-orange-400"
                  size={28}
                />

                <p className="mt-3 font-semibold text-white">
                  Lifetime Access
                </p>

              </div>

            </div>

         <button
  onClick={() =>
    document.getElementById("lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  className="group mt-12 flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 py-5 text-xl font-bold text-white transition duration-300 hover:scale-[1.02] hover:bg-orange-400"
>
  Start 4 Free Mocks

  <ArrowRight
    size={22}
    className="transition-transform group-hover:translate-x-1"
  />
</button>

            <p className="mt-5 text-center text-sm text-slate-400">
            Start with 4 free mocks • Upgrade anytime for ₹799
            </p>

            
            <div className="mt-10 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">

              <p className="text-center text-slate-300 leading-8">
                Designed by experienced CAT educators and powered by AI to
                help you understand <span className="font-bold text-white">
                why you lose marks
                </span>, not just how many.
              </p>

            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              One-time purchase • No subscriptions • No recurring charges
            </p>

          </div>

        </motion.div>

      </div>

    </section>
  );
}