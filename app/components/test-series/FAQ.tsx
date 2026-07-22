"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Who is this test series for?",
    answer:
      "This test series is designed for CAT aspirants preparing for CAT 2026 and other MBA entrance examinations where Reading Comprehension plays a crucial role.",
  },
  {
    question: "What do I get after purchasing?",
    answer:
      "You'll get 10 AI-powered VARC Mock Tests, 24 Official CAT Previous Year Papers, detailed solutions, AI Mentor Verdict, Cognitive Diagnosis, Trap Analysis, Reader DNA and access to your complete performance dashboard.",
  },
  {
    question: "How is Auctor different from other test series?",
    answer:
      "Most platforms stop at showing your score. Auctor goes a step further by using AI to analyse your reading behaviour, identify recurring mistakes and explain exactly what you need to improve to maximize your VARC score.",
  },
  {
    question: "Are CAT Previous Year Papers included?",
    answer:
      "Yes. The package includes all 24 official CAT VARC Previous Year Papers with detailed explanations and AI-powered performance analysis.",
  },
  {
    question: "Can I attempt the mocks multiple times?",
    answer:
      "No. Each mock can be attempted only once. However, you can revisit your detailed AI analysis, solutions and performance reports anytime during your access period.",
  },
  {
    question: "Will I receive detailed solutions?",
    answer:
      "Yes. Every question includes comprehensive explanations along with AI-generated insights into your performance, helping you understand not just the correct answer but also why you made a mistake.",
  },
  {
    question: "How long will I have access?",
    answer:
      "Your purchase includes access until the CAT 2026 examination, giving you ample time to practise, review your reports and track your progress throughout your preparation.",
  },
  {
    question: "Can I use it on mobile?",
    answer:
      "You can view your reports and dashboard on mobile. However, we strongly recommend attempting the actual mock tests on a desktop or laptop, as the experience closely matches the real CAT exam environment and helps build the right test-taking habits.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-[#07152D] py-24">

      <div className="mx-auto max-w-5xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center"
        >

          <div className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
            FAQ
          </div>

          <h2 className="mt-6 text-4xl font-black text-white md:text-6xl">
            Frequently Asked
            <br />
            Questions
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Everything you need to know before starting your AI-powered VARC journey.
          </p>

        </motion.div>

        <div className="mt-16 space-y-5">

          {faqs.map((faq, index) => {

            const isOpen = open === index;

            return (

              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1E39]"
              >

                <button
                  onClick={() =>
                    setOpen(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between px-7 py-6 text-left"
                >

                  <span className="text-lg font-semibold text-white">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={24}
                    className={`text-orange-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />

                </button>

                <AnimatePresence>

                  {isOpen && (

                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: .25 }}
                    >

                      <div className="border-t border-white/10 px-7 py-6 text-slate-300 leading-8">

                        {faq.answer}

                      </div>

                    </motion.div>

                  )}

                </AnimatePresence>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}