"use client";

import {
  GraduationCap,
  Users,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const sections = [
  {
    icon: GraduationCap,
    title: "Improve Student Outcomes",
    description:
      "Give every student personalised learning, unlimited practice and instant AI guidance that improves consistency and academic performance.",
    points: [
      "Personalised learning",
      "Unlimited practice",
      "Instant AI feedback",
    ],
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: Users,
    title: "Empower Your Faculty",
    description:
      "Reduce repetitive doubt solving, automate performance tracking and help teachers spend more time mentoring instead of administrative work.",
    points: [
      "AI solves routine doubts",
      "Automatic performance tracking",
      "More time for teaching",
    ],
    gradient: "from-purple-500/20 to-indigo-500/10",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Institute",
    description:
      "Differentiate your institute with an AI-powered learning platform that attracts more admissions, improves retention and builds a premium brand.",
    points: [
      "Increase student engagement",
      "Improve retention",
      "Differentiate from competitors",
      "Build a premium brand",
    ],
    gradient: "from-orange-500/20 to-red-500/10",
  },
];

export default function WhyAuctor() {
  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            WHY AUCTOR
          </p>

          <h2 className="mt-5 text-4xl md:text-6xl font-black text-white">
            AI That Benefits Everyone.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Auctor doesn't just improve student learning. It empowers
            faculty and helps institutes grow in an increasingly
            competitive education landscape.
          </p>

        </div>

        <div className="mt-20 space-y-8">

          {sections.map((section) => {
            const Icon = section.icon;

            return (

              <div
                key={section.title}
                className={`rounded-[32px] border border-white/10 bg-gradient-to-r ${section.gradient} p-[1px]`}
              >

                <div className="rounded-[31px] bg-[#0f172a] p-8 lg:p-12">

                  <div className="grid items-center gap-10 lg:grid-cols-[90px_1fr_320px]">

                    {/* Icon */}

                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10">

                      <Icon className="h-10 w-10 text-orange-400" />

                    </div>

                    {/* Content */}

                    <div>

                      <h3 className="text-3xl font-bold text-white">
                        {section.title}
                      </h3>

                      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                        {section.description}
                      </p>

                    </div>

                    {/* Benefits */}

<div className="flex flex-col gap-3 lg:w-80">

  {section.points.map((point) => (

    <div
      key={point}
      className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3"
    >

      <CheckCircle2
        size={18}
        className="text-green-400 flex-shrink-0"
      />

      <span className="text-sm font-medium text-white">
        {point}
      </span>

    </div>

  ))}

</div>

                  </div>

                </div>

              </div>

            );
          })}

        </div>

        {/* Closing Banner */}

        <div className="mt-20 rounded-[32px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-12 text-center">

          <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">

            The institutes adopting AI today
            <br />
            will lead the next decade of education.

          </h3>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">

            Give your students a learning experience they'll remember,
            empower your faculty and build an institute that's ready
            for the future.

          </p>

          <button className="mt-10 rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-600">

            Book Your Free Demo

          </button>

        </div>

      </div>

    </section>
  );
}