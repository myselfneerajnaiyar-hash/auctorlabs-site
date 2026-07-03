"use client";
import DashboardPreview from "./DashboardPreview"

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[#07152D]" />

      <div className="absolute left-[-250px] top-[-200px] h-[700px] w-[700px] rounded-full bg-blue-600/20 blur-[180px]" />

      <div className="absolute right-[-150px] top-[100px] h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}

          <div>

            <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold tracking-wider text-orange-400">
              AI IS TRANSFORMING EDUCATION
            </div>

          <h1 className="mt-8 text-[52px] xl:text-[72px] font-black leading-[0.95] tracking-tight text-white">

  The Next Generation
  <br />
  of Coaching
  <br />
  Institutes
  <br />
  Will Be AI Powered.

</h1>

<p className="mt-5 text-3xl font-bold text-orange-400">
  Will Yours Be One Of Them?
</p>

           <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">

  Students now expect personalised learning, instant feedback and AI-powered guidance. Institutes that embrace AI today will improve learning outcomes, strengthen their brand and stay ahead of the competition.

</p>
<div className="mt-12 flex flex-wrap gap-4">

  <button className="rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600">

    Book Free Demo

  </button>

  <button className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white hover:bg-white/10">

    Explore Platform

  </button>

</div>

          </div>

          {/* RIGHT */}

         <div className="relative">

    <DashboardPreview />

</div>

        </div>

      </div>

    </section>
  );
}