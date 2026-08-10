import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogArticleHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b1a]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          aria-label="Auctor Labs home"
          className="flex items-center gap-2.5 rounded-md text-white transition hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <Image
            src="/logo.png"
            alt="Auctor Labs"
            width={1080}
            height={1350}
            className="h-7 w-auto sm:h-8"
            priority
          />
          <span className="text-sm font-semibold tracking-wide sm:text-base">
            Auctor Labs
          </span>
        </Link>

        <Link
          href="/blog"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-gray-200 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:px-4"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Blog</span>
        </Link>
      </div>
    </header>
  );
}
