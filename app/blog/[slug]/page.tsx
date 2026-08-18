import ProgressBar from "../../components/ProgressBar";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import TableOfContents from "../../components/TableOfContents";
import RelatedPosts from "../../components/RelatedPosts";
import BlogPracticeCTA from "../../components/BlogPracticeCTA";
import BlogArticleHeader from "../../components/BlogArticleHeader";
import { absoluteUrl, BLOG_AUTHOR, getBlogPost, getBlogSlugs, SITE_URL } from "../../../lib/blog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

function extractHeadings(content: string) {
  const regex = /^##\s+(.*)/gm;
  const matches = [...content.matchAll(regex)];

  return matches.map((match) => {
  const text = match[1];

  return {
    text,
  id: text.toLowerCase().replace(/\s+/g, "-")
  };
});
}

/* ================= METADATA ================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const canonical = `${SITE_URL}/blog/${slug}`;
  const image = absoluteUrl(post.image);

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "Auctor Labs",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      authors: [BLOG_AUTHOR.url],
      images: image ? [{ url: image, alt: post.imageAlt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: image ? [image] : undefined,
    },
  };
}
/* ================= PAGE ================= */

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post || post.status !== "published") notFound();
  const { content } = post;
  const headings = extractHeadings(content);
  const finalThoughtMarker = /^##\s+Final Thought\s*$/m;
  const markerMatch = finalThoughtMarker.exec(content);
  const contentBeforeCta = markerMatch ? content.slice(0, markerMatch.index) : content;
  const contentAfterCta = markerMatch ? content.slice(markerMatch.index) : "";

  const canonical = `${SITE_URL}/blog/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": post.schemaType || "BlogPosting",
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image),
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: post.author || BLOG_AUTHOR.name, url: BLOG_AUTHOR.url },
    publisher: { "@type": "Organization", name: "Auctor Labs", url: SITE_URL },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  };

 return (
 <div className="bg-[#0B0F1A] text-white min-h-screen overflow-x-hidden">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />

    {/* 🔥 PROGRESS BAR */}
  <ProgressBar />
  <BlogArticleHeader />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid grid-cols-12 gap-6 sm:gap-10">

      {/* 📖 MAIN CONTENT */}
     <div className="col-span-12 lg:col-span-8 max-w-full">

        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-gray-300">Blog</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-gray-400" aria-current="page">{post.title}</span>
        </nav>

        <h1 className="text-5xl font-bold leading-tight mb-6">
          {post.title}
        </h1>

        <div className="mb-12 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
          <span>By <Link href="/about" rel="author" className="text-gray-300 hover:text-white">{post.author}</Link></span>
          <span aria-hidden="true">•</span>
          <time dateTime={post.date}>Published {post.date}</time>
          {post.updatedDate && <><span aria-hidden="true">•</span><time dateTime={post.updatedDate}>Updated {post.updatedDate}</time></>}
          <span aria-hidden="true">•</span>
          <span>{post.readingTime} min read</span>
        </div>


       <article className="prose-custom max-w-none w-full">
         
         <MDXRemote
  source={contentBeforeCta}

  components={{
 

h2: (props) => {
  const text = String(props.children);

  const id = text.toLowerCase().replace(/\s+/g, "-");

  return (
    <h2
      id={id}
      className="text-3xl font-bold mt-20 mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
    >
      {props.children}
    </h2>
  );
},

    h3: (props) => (
      <h3 className="text-2xl font-semibold mt-10 mb-4">
        {props.children}
      </h3>
    ),

 img: (props) => (
 <img {...props} className="my-10 rounded-xl shadow-xl border border-white/10 w-full h-auto" />
),
video: (props) => (
  <video
    {...props}
    controls
    playsInline
    className="my-10 w-full rounded-xl shadow-xl border border-white/10"
  />
),

iframe: (props) => (
  <div className="my-10 w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-xl">
    <iframe
      {...props}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
),

   p: (props) => (
  <p className="text-gray-300 leading-8 mb-6 text-[17px]">
    {props.children}
  </p>
),

    hr: () => (
  <div className="my-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
),

    ul: (props) => (
      <ul className="pl-6 my-6 border-l border-white/10">
        {props.children}
      </ul>
    ),

    li: (props) => (
      <li className="mb-2 text-gray-300">
        {props.children}
      </li>
    ),
blockquote: (props) => (
  <div className="my-10 p-6 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur text-lg leading-relaxed text-white">
    {props.children}
  </div>
),
  }}
/>
        <BlogPracticeCTA slug={slug} />
        {contentAfterCta && (
          <MDXRemote
            source={contentAfterCta}
            components={{
              h2: (props) => {
                const text = String(props.children);
                const id = text.toLowerCase().replace(/\s+/g, "-");
                return (
                  <h2 id={id} className="text-3xl font-bold mt-20 mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {props.children}
                  </h2>
                );
              },
              p: (props) => <p className="text-gray-300 leading-8 mb-6 text-[17px]">{props.children}</p>,
            }}
          />
        )}
        </article>
        <RelatedPosts currentSlug={slug} />

      </div>

      {/* 📌 SIDEBAR (DYNAMIC) */}
<div className="hidden lg:block col-span-4">
 <div className="sticky top-24 bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-[0_0_30px_rgba(255,165,0,0.08)]">
    
    <p className="text-sm text-gray-400 mb-4">ON THIS PAGE</p>

   <TableOfContents headings={headings} />

  </div>
</div>

    </div>
  </div>
);
}
