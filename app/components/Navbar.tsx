"use client"

import { useState } from "react"

export default function Navbar() {

  const [open, setOpen] = useState(false)

  return (

    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur border-b border-white/10 bg-[#070b1a]/70">

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}

       <a href="/" className="flex items-center gap-2">
  <img src="/logo.png" alt="Auctor Labs" className="h-8 w-auto" />
  <span className="text-lg font-semibold tracking-wide hover:text-white">
    Auctor Labs
  </span>
</a>


        {/* Desktop Links */}

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">

          <a href="/auctor-rc" className="hover:text-white">
            Auctor RC
          </a>

          <a href="/pricing" className="hover:text-white">
            Pricing
          </a>

          <a href="/about" className="hover:text-white">
            About
          </a>

        <a href="/products" className="hover:text-white">
  Products
</a>

          <a href="/contact" className="hover:text-white">
            Contact
          </a>

        </div>


        {/* CTA Button */}

        <div className="hidden md:block">

          <a
            href="https://rc.auctorlabs.in"
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition"
          >
            Try RC
          </a>

        </div>


        {/* Mobile Menu Button */}

        <button
          className="md:hidden text-white text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

      </div>


      {/* Mobile Menu */}

      {open && (

        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 text-gray-300">

          <a href="/auctor-rc">Auctor RC</a>

          <a href="/pricing">Pricing</a>

          <a href="/about">About</a>
         
         <a href="/products" className="hover:text-white">
  Products
</a>


          <a href="/contact">Contact</a>

          <a
            href="https://rc.auctorlabs.in"
            className="bg-orange-500 px-4 py-2 rounded-lg w-fit"
          >
            Try RC
          </a>

        </div>

      )}

    </nav>

  )
}