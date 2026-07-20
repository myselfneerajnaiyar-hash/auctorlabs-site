"use client";

import { useState } from "react";
import {
  Brain,
  Target,
  TriangleAlert,
  BarChart3,
  BookOpen,
  FileText,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const items = [
  {
    title: "AI Mentor Verdict",
    icon: Brain,
    auctor: "Personalized AI mentor explains WHY you lost marks and how to improve.",
    typical: "Shows only score and solutions.",
  },
  {
    title: "Cognitive Diagnosis",
    icon: Target,
    auctor: "Identifies cognitive leaks like scope errors, negation issues and logical flow mistakes.",
    typical: "Not included.",
  },
  {
    title: "Trap Analysis",
    icon: TriangleAlert,
    auctor: "Shows exactly which CAT traps fooled you.",
    typical: "No trap analysis.",
  },
  {
    title: "Performance Analytics",
    icon: BarChart3,
    auctor: "Track RC, VA, accuracy, trends and improvement.",
    typical: "Basic score history.",
  },
  {
    title: "24 CAT PYQs",
    icon: BookOpen,
    auctor: "Included with detailed AI reports.",
    typical: "Usually separate or limited.",
  },
  {
    title: "10 Original AI Mocks",
    icon: FileText,
    auctor: "Fresh CAT-level mocks with AI analysis.",
    typical: "Usually available without AI.",
  },
];

export default function Comparison() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-[#07152D] py-24">

      <div className="mx-auto max-w-5xl px-6">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.25em] text-orange-400">
            WHY AUCTOR?
          </p>

          <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
            Why Aspirants Choose
            <span className="text-orange-400"> Auctor</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Every CAT test series helps you practice.
            Auctor helps you understand your mistakes and improve after every mock.
          </p>

        </div>

        <div className="mt-14 space-y-4">

          {items.map((item, index) => {

            const Icon = item.icon;
            const isOpen = open === index;

            return (

              <div
                key={item.title}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >

                <button
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >

                  <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-orange-500/15 p-3">

                      <Icon
                        className="text-orange-400"
                        size={22}
                      />

                    </div>

                    <div>

                      <h3 className="text-lg font-bold text-white">
                        {item.title}
                      </h3>

                    </div>

                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="text-slate-300" />
                  </motion.div>

                </button>

                <AnimatePresence>

                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >

                      <div className="border-t border-white/10 p-5">

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Auctor */}

                          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5">

                            <div className="mb-4 flex items-center gap-2">

                              <CheckCircle2
                                size={20}
                                className="text-green-400"
                              />

                              <h4 className="text-lg font-bold text-orange-400">
                                Auctor
                              </h4>

                            </div>

                            <p className="leading-7 text-slate-200">
                              {item.auctor}
                            </p>

                          </div>

                          {/* Typical */}

                          <div className="rounded-2xl border border-white/10 bg-[#0B1D3A] p-5">

                            <div className="mb-4 flex items-center gap-2">

                              <XCircle
                                size={20}
                                className="text-red-400"
                              />

                              <h4 className="text-lg font-bold text-slate-300">
                                Typical Test Series
                              </h4>

                            </div>

                            <p className="leading-7 text-slate-400">
                              {item.typical}
                            </p>

                          </div>

                        </div>

                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>

              </div>

            );

          })}

        </div>

        <div className="mt-16 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-orange-400/5 p-8 text-center">

          <h3 className="text-3xl font-black text-white">
            CAT isn't about solving more RCs.
          </h3>

          <p className="mt-3 text-xl text-slate-300">
            It's about understanding
            <span className="font-bold text-orange-400">
              {" "}why you make mistakes.
            </span>
          </p>

          <p className="mt-6 text-lg text-slate-400">
            That's exactly what Auctor's AI reports are built for.
          </p>

        </div>

      </div>

    </section>
  );
}