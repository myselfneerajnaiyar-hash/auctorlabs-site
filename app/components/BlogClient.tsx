"use client";

import { useState } from "react";
import Link from "next/link";

export default function BlogClient({ blogs }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const POSTS_PER_PAGE = 6;

  // ✅ Featured + rest
  const featured = blogs[0];
  const rest = blogs;

  // ✅ Filter
  const filtered = rest.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || blog.category === category;

    return matchesSearch && matchesCategory;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);

  const paginatedBlogs = filtered.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  return (
    <div className="bg-[#0B0F1A] text-white min-h-screen">

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Auctor Blog</h1>
        <p className="text-gray-400 text-lg">
          Learn how to think, not just solve.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-6xl mx-auto px-6 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">

        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />

        <div className="flex gap-2">
          {[
            "All",
            "Accuracy",
            "Inference",
            "Tone",
            "Elimination",
            "Speed",
            "Strategy",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm ${
                category === cat
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED */}
      {featured && (
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <Link href={`/blog/${featured.slug}`}>
            <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/10 hover:scale-[1.02] transition-all cursor-pointer">

              <p className="text-sm text-orange-400 mb-2">FEATURED</p>

              {featured.image && (
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-[250px] object-cover rounded-xl mb-4"
                />
              )}

              <h2 className="text-3xl font-bold mb-2">
                {featured.title}
              </h2>

              <p className="text-gray-300 mb-4">
                {featured.description}
              </p>

              <p className="text-gray-500 text-sm">
                {featured.date} • 5 min read
              </p>

            </div>
          </Link>
        </div>
      )}

      {/* LATEST ARTICLES */}
      <div className="max-w-6xl mx-auto px-6 pb-20">

        <h2 className="text-2xl font-semibold mb-6">
          Latest Articles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {paginatedBlogs.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`}>

              <div className="group rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-orange-400/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer">

                {blog.image && (
                  <div className="overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-[180px] object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
            

                <div className="p-4">

                    <p className="text-xs text-orange-400 mb-1 uppercase tracking-wide">
  {blog.category}
</p>
                  <p className="text-xs text-orange-400 mb-1">
                    {blog.date}
                  </p>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-400 transition">
                    {blog.title}
                  </h3>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {blog.description}
                  </p>

                  <p className="text-orange-400 text-sm mt-2 opacity-0 group-hover:opacity-100 transition">
  Read more →
</p>
                </div>

              </div>

            </Link>
          ))}

        </div>

{paginatedBlogs.length === 0 && (
  <p className="text-center text-gray-400 mt-10">
    No articles found for this filter.
  </p>
)}
        {/* PAGINATION */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-orange-500 text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}