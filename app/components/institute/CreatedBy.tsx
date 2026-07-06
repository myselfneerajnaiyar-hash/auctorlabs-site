"use client";

export default function CreatedBy() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="rounded-[32px] border border-slate-600/30 bg-gradient-to-br from-[#172554] via-[#1E293B] to-[#0F172A] p-8 md:p-12 shadow-2xl">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
             CREATED BY EDUCATORS
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl font-black text-white">
              Built from 16+ Years of
              <br />
              Classroom Experience
            </h2>

            
           <div className="mx-auto mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-orange-500/10 ring-2 ring-orange-500/20">
  <img
    src="/founder.jpeg"
    alt="Neraj Kumar Naiyar"
    className="h-24 w-24 rounded-full object-cover"
  />
</div>
            <h3 className="mt-5 text-2xl font-bold text-white">
              Neraj Kumar Naiyar
            </h3>

            <p className="mt-2 text-slate-400">
              IIT Roorkee • Product Head & COO • Founder, Auctor Labs
            </p>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-300">
              Auctor RC was born inside real classrooms—not a software company. After 16+ years of teaching competitive exam aspirants and working with coaching institutes, every feature has been designed to solve real classroom challenges.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                🎓 IIT Roorkee
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                👨‍🏫 16+ Years
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                🚀 Founder
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                🤖 AI Learning
              </span>

            </div>

            <button
              onClick={() =>
                document
                  .getElementById("book-demo")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-10 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
            >
              Book a Live Demo
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}