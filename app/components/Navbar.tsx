"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur border-b border-white/10 bg-[#070b1a]/70">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Auctor Labs"
            className="h-8 w-auto"
          />
          <span className="text-lg font-semibold tracking-wide hover:text-white">
            Auctor Labs
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">

          <Link href="/auctor-rc" className="hover:text-white">
            Auctor RC
          </Link>

          <Link href="/institute" className="hover:text-white">
            Institutes
          </Link>

          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>

          <Link href="/about" className="hover:text-white">
            About
          </Link>

          <Link href="/products" className="hover:text-white">
            Products
          </Link>

          <Link href="/blog" className="text-orange-400 font-semibold">
            Blog
          </Link>

          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>

        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <a
            href="https://rc.auctorlabs.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105"
          >
            Try RC
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 text-gray-300">

          <Link href="/auctor-rc" onClick={() => setOpen(false)}>
            Auctor RC
          </Link>

          <Link href="/institute" onClick={() => setOpen(false)}>
            Institutes
          </Link>

          <Link href="/pricing" onClick={() => setOpen(false)}>
            Pricing
          </Link>

          <Link href="/about" onClick={() => setOpen(false)}>
            About
          </Link>

          <Link href="/products" onClick={() => setOpen(false)}>
            Products
          </Link>

          <Link
            href="/blog"
            className="text-orange-400 font-semibold"
            onClick={() => setOpen(false)}
          >
            Blog
          </Link>

          <Link href="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>

          <a
            href="https://rc.auctorlabs.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 px-4 py-2 rounded-lg w-fit"
          >
            Try Auctor RC
          </a>

        </div>
      )}
    </nav>
  );
}