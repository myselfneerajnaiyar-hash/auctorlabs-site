"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07152D]/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <div className="flex items-center gap-4">

          <img
            src="/logo.png"
            alt="Auctor Labs"
            className="h-12 w-12 rounded-lg"
          />

          <div>
            <h1 className="text-xl font-bold text-white">
              Auctor Labs
            </h1>

            <p className="text-sm text-slate-400">
              AI Platform for Reading Comprehension
            </p>
          </div>

        </div>

        {/* Trust Badge */}

        <div className="hidden md:flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-5 py-2">

          <span className="text-sm font-semibold text-orange-300">
            Trusted by Coaching Institutes
          </span>

        </div>

      </div>
    </header>
  );
}