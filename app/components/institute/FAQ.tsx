"use client";

import { useState } from "react";
import {
  ChevronDown,
  MessageCircle,
  CalendarDays,
  Mail,
  ArrowRight,
} from "lucide-react";

const faqs = [
  {
    question: "Can Auctor be branded for our institute?",
    answer:
      "Yes. We provide complete white-label branding with your institute logo, colours and dedicated student portal.",
  },
  {
    question: "Which exams does Auctor support?",
    answer:
      "Auctor currently supports CAT, XAT, GMAT, GRE, CUET, CLAT, UPSC and other competitive exams where Reading Comprehension is important.",
  },
  {
    question: "Can faculty monitor student progress?",
    answer:
      "Yes. Institutes receive a powerful dashboard showing Reading IQ, daily engagement, accuracy, speed, leaderboards and detailed performance reports.",
  },
  {
    question: "Do students need to install an app?",
    answer:
      "No. Auctor is completely browser-based and works beautifully on desktop, tablet and mobile devices.",
  },
  {
    question: "How long does onboarding take?",
    answer:
      "Most institutes are onboarded within a few days including branding, dashboard setup and faculty orientation.",
  },
  {
    question: "Can we book a demo before purchasing?",
    answer:
      "Absolutely. We'll walk you through the complete platform, institute dashboard and student experience in a personalised live demo.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <p className="uppercase tracking-[0.3em] text-orange-400 text-sm font-semibold">
            FAQ
          </p>

          <h2 className="mt-5 text-4xl md:text-6xl font-black text-white">
            Questions Before You Partner?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400 leading-8">
            Everything institutes usually ask before getting started.
          </p>

        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-[1.5fr_0.8fr]">

          {/* FAQ */}

          <div className="space-y-5">

            {faqs.map((faq, index) => (

              <div
                key={faq.question}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#101828]"
              >

                <button
                  onClick={() =>
                    setOpen(open === index ? null : index)
                  }
                  className="flex w-full items-center justify-between p-7 text-left"
                >

                  <span className="text-lg font-semibold text-white">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`transition duration-300 ${
                      open === index
                        ? "rotate-180 text-orange-400"
                        : "text-slate-400"
                    }`}
                  />

                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    open === index
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >

                  <div className="overflow-hidden">

                    <p className="px-7 pb-7 leading-8 text-slate-300">
                      {faq.answer}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* CONTACT CARD */}

          <div>

            <div className="sticky top-28 rounded-[32px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-[#101828] to-[#101828] p-8">

              <div className="inline-flex rounded-2xl bg-orange-500/15 p-4">

                <MessageCircle className="h-8 w-8 text-orange-400" />

              </div>

              <h3 className="mt-6 text-3xl font-bold text-white">

                Still Have Questions?

              </h3>

              <p className="mt-4 leading-8 text-slate-300">

                Schedule a personalised demo and we'll show exactly how
                Auctor can help your institute.

              </p>

              <div className="mt-10 space-y-4">

                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">

                  <CalendarDays className="text-orange-400" />

                  <div>

                    <p className="font-semibold text-white">
                      15-Minute Demo
                    </p>

                    <p className="text-sm text-slate-400">
                      Live platform walkthrough
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">

                  <Mail className="text-orange-400" />

                  <div>

                    <p className="font-semibold text-white">
                      Priority Support
                    </p>

                    <p className="text-sm text-slate-400">
                      We'll answer every question
                    </p>

                  </div>

                </div>

              </div>

              <button className="mt-10 flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600">

                Book Your Free Demo

                <ArrowRight size={18} />

              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}