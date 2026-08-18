import Link from "next/link";
import { getRelatedBlogPosts } from "../../lib/blog";

export default function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const related = getRelatedBlogPosts(currentSlug);

  return (
    <aside className="mt-20" aria-labelledby="related-articles-heading">
      <h2 id="related-articles-heading" className="text-2xl font-bold mb-6">
        Related Articles
      </h2>
      <div className="grid gap-4">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl border border-white/10 p-5 transition hover:border-orange-400/30 hover:bg-white/5"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-orange-400">{post.category}</span>
            <span className="mt-1 block font-medium">{post.title}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
