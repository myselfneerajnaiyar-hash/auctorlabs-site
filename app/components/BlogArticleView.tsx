import type { ComponentProps } from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { BlogPost } from "../../lib/blog";
import ProgressBar from "./ProgressBar";
import TableOfContents from "./TableOfContents";
import RelatedPosts from "./RelatedPosts";
import BlogPracticeCTA from "./BlogPracticeCTA";
import BlogArticleHeader from "./BlogArticleHeader";

export function extractBlogHeadings(content: string) {
  return [...content.matchAll(/^##\s+(.*)/gm)].map(match => ({ text: match[1], id: match[1].toLowerCase().replace(/\s+/g, "-") }));
}

const mdxComponents = {
  h2: (props: ComponentProps<"h2">) => {
    const id = String(props.children).toLowerCase().replace(/\s+/g, "-");
    return <h2 id={id} className="text-3xl font-bold mt-20 mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{props.children}</h2>;
  },
  h3: (props: ComponentProps<"h3">) => <h3 className="text-2xl font-semibold mt-10 mb-4">{props.children}</h3>,
  img: (props: ComponentProps<"img">) => <img {...props} alt={props.alt || ""} className="my-10 rounded-xl shadow-xl border border-white/10 w-full h-auto" />,
  video: (props: ComponentProps<"video">) => <video {...props} controls playsInline className="my-10 w-full rounded-xl shadow-xl border border-white/10" />,
  iframe: (props: ComponentProps<"iframe">) => <div className="my-10 w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-xl"><iframe {...props} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>,
  p: (props: ComponentProps<"p">) => <p className="text-gray-300 leading-8 mb-6 text-[17px]">{props.children}</p>,
  hr: () => <div className="my-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />,
  ul: (props: ComponentProps<"ul">) => <ul className="pl-6 my-6 border-l border-white/10">{props.children}</ul>,
  li: (props: ComponentProps<"li">) => <li className="mb-2 text-gray-300">{props.children}</li>,
  blockquote: (props: ComponentProps<"blockquote">) => <div className="my-10 p-6 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur text-lg leading-relaxed text-white">{props.children}</div>,
};

const finalComponents = { h2: mdxComponents.h2, p: mdxComponents.p };

export default function BlogArticleView({ post }: { post: BlogPost }) {
  const headings = extractBlogHeadings(post.content);
  const marker = /^##\s+Final Thought\s*$/m.exec(post.content);
  const beforeCta = marker ? post.content.slice(0, marker.index) : post.content;
  const afterCta = marker ? post.content.slice(marker.index) : "";
  return <div className="bg-[#0B0F1A] text-white min-h-screen overflow-x-hidden">
    <ProgressBar /><BlogArticleHeader />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid grid-cols-12 gap-6 sm:gap-10">
      <div className="col-span-12 lg:col-span-8 max-w-full">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-gray-500"><Link href="/" className="hover:text-gray-300">Home</Link><span aria-hidden="true">/</span><Link href="/blog" className="hover:text-gray-300">Blog</Link><span aria-hidden="true">/</span><span className="truncate text-gray-400" aria-current="page">{post.title}</span></nav>
        <h1 className="text-5xl font-bold leading-tight mb-6">{post.title}</h1>
        <div className="mb-12 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400"><span>By <Link href="/about" rel="author" className="text-gray-300 hover:text-white">{post.author}</Link></span><span aria-hidden="true">•</span><time dateTime={post.date}>Published {post.date}</time>{post.updatedDate && <><span aria-hidden="true">•</span><time dateTime={post.updatedDate}>Updated {post.updatedDate}</time></>}<span aria-hidden="true">•</span><span>{post.readingTime} min read</span></div>
        <article className="prose-custom max-w-none w-full"><MDXRemote source={beforeCta} components={mdxComponents} /><BlogPracticeCTA slug={post.slug} />{afterCta && <MDXRemote source={afterCta} components={finalComponents} />}</article>
        <RelatedPosts currentSlug={post.slug} />
      </div>
      <div className="hidden lg:block col-span-4"><div className="sticky top-24 bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-[0_0_30px_rgba(255,165,0,0.08)]"><p className="text-sm text-gray-400 mb-4">ON THIS PAGE</p><TableOfContents headings={headings} /></div></div>
    </div>
  </div>;
}
