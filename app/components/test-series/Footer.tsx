export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07152D]">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white">
              Auctor
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              AI-powered CAT VARC preparation with intelligent analysis,
              detailed feedback and exam-like mock tests.
            </p>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <p className="text-sm font-semibold text-white">
              Need Help?
            </p>

            <a
              href="mailto:info@auctorlabs.in"
              className="mt-2 block text-sm text-orange-400 hover:text-orange-300"
            >
              info@auctorlabs.in
            </a>

            <p className="mt-2 text-sm text-slate-400">
              Typically replies within 24 hours.
            </p>
          </div>

        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Auctor Labs. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}