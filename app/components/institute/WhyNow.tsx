"use client";

import {
  Users,
  Brain,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const problems = [
  {
    icon: Users,
    title: "Students Lose Consistency",
    text: "Most students stop practising after a few weeks because learning isn't personalised.",
  },
  {
    icon: Brain,
    title: "Faculty Can't Mentor Everyone",
    text: "Teachers spend hours checking performance but still miss students who silently fall behind.",
  },
  {
    icon: BarChart3,
    title: "Marks Don't Tell The Whole Story",
    text: "Institutes need insights into accuracy, speed, reading habits and learning behaviour—not just scores.",
  },
  {
    icon: TrendingUp,
    title: "Competition Is Changing",
    text: "Students now expect AI-powered feedback, analytics and personalised learning from coaching institutes.",
  },
];

export default function WhyNow() {
  return (
    <section className="relative bg-[#07152D] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="max-w-3xl mx-auto text-center">

          <div className="inline-flex rounded-full bg-orange-500/10 border border-orange-500/30 px-4 py-2 text-sm font-semibold text-orange-400">
            WHY AI MATTERS
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Every Coaching Institute
            <br />
            Faces The Same Challenges.
          </h2>

          <p className="mt-6 text-lg text-slate-300 leading-8">
            Student expectations have changed. Manual mentoring isn't enough.
            Institutes that embrace AI today will improve engagement,
            retention and learning outcomes.
          </p>

        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {problems.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-[#111827] p-8 transition duration-300 hover:-translate-y-2 hover:border-orange-500/40"
              >

                <div className="inline-flex rounded-xl bg-orange-500/10 p-3">
                  <Icon className="h-7 w-7 text-orange-400" />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {item.text}
                </p>

              </div>

            );

          })}

        </div>

      </div>
    </section>
  );
}