import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticleView from "../../components/BlogArticleView";
import { absoluteUrl, BLOG_AUTHOR, getBlogPostHybrid, getBlogSlugs, SITE_URL } from "../../../lib/blog";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getBlogSlugs().map(slug => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params, post = await getBlogPostHybrid(slug);
  if (!post) return {};
  const canonical = `${SITE_URL}/blog/${slug}`, image = absoluteUrl(post.image);
  return { title: post.title, description: post.description, alternates: { canonical }, openGraph: { type: "article", url: canonical, siteName: "Auctor Labs", title: post.title, description: post.description, publishedTime: post.date, modifiedTime: post.updatedDate || post.date, authors: [BLOG_AUTHOR.url], images: image ? [{ url: image, alt: post.imageAlt || post.title }] : undefined }, twitter: { card: "summary_large_image", title: post.title, description: post.description, images: image ? [image] : undefined } };
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params, post = await getBlogPostHybrid(slug);
  if (!post || post.status !== "published") notFound();
  const canonical = `${SITE_URL}/blog/${slug}`;
  const articleSchema = { "@context":"https://schema.org", "@type":post.schemaType||"BlogPosting", headline:post.title, description:post.description, image:absoluteUrl(post.image), datePublished:post.date, dateModified:post.updatedDate||post.date, mainEntityOfPage:canonical, author:{"@type":"Organization",name:post.author||BLOG_AUTHOR.name,url:BLOG_AUTHOR.url}, publisher:{"@type":"Organization",name:"Auctor Labs",url:SITE_URL} };
  const breadcrumbSchema = { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:SITE_URL},{"@type":"ListItem",position:2,name:"Blog",item:`${SITE_URL}/blog`},{"@type":"ListItem",position:3,name:post.title,item:canonical}] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema).replace(/</g,"\\u003c")}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,"\\u003c")}}/><BlogArticleView post={post}/></>;
}
