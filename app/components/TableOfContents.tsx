"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
};

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // 🔥 scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrolled = (scrollTop / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      
      {/* 🔥 PROGRESS BAR */}
      <div className="absolute left-0 top-0 w-[2px] h-full bg-white/10">
        <div
          className="w-full bg-orange-500 transition-all duration-200"
          style={{ height: `${progress}%` }}
        />
      </div>

      <ul className="space-y-3 text-sm pl-4">
        {headings.map((heading) => (
          <li key={heading.id} className="relative">
            
            {/* 🔥 ACTIVE LEFT BORDER */}
            <span
              className={`absolute -left-4 top-1 h-5 w-[3px] rounded transition-all ${
                activeId === heading.id
                  ? "bg-orange-500 opacity-100"
                  : "bg-transparent opacity-0"
              }`}
            />

            <a
              href={`#${heading.id}`}
              className={`block transition-all duration-200 ${
                activeId === heading.id
                  ? "text-orange-500 font-semibold translate-x-1"
                  : "text-amber-400/80 hover:text-orange-500 hover:translate-x-1"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}