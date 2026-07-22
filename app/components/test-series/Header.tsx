"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07152D]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Auctor"
            className="h-10 w-10 rounded-lg"
          />

          <div>
            <h1 className="text-xl font-bold text-white">
              Auctor
            </h1>
            <p className="text-xs tracking-wider text-orange-400 uppercase">
              AI VARC Test Series
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center">
  <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-6 py-2">
    <p className="text-sm font-semibold text-orange-300">
      🎁 4 FREE VARC Mocks • 10 AI Mocks • 24 CAT PYQs
    </p>
  </div>
</div>

       <button
  onClick={() =>
    document
      .getElementById("lead-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
  }
  className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-400"
>
  Start Your Free Mock
</button>
      </div>
    </header>
  );
}