import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Target } from "lucide-react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { featurePages, getFeaturePage, SIGNUP_URL, SITE_URL } from "../../../lib/feature-pages";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return featurePages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeaturePage(slug);
  if (!feature) return {};
  const canonical = `${SITE_URL}/features/${feature.slug}`;

  return {
    title: `${feature.title} | Auctor RC`,
    description: feature.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Auctor Labs",
      title: feature.title,
      description: feature.description,
      images: feature.visual ? [{ url: `${SITE_URL}${feature.visual.src}`, alt: feature.visual.alt }] : undefined,
    },
  };
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = await params;
  const feature = getFeaturePage(slug);
  if (!feature) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: feature.faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-x-hidden bg-[#0b0f2a] text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

        <section className="relative px-6 pb-24 pt-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.24),transparent_42%),radial-gradient(circle_at_80%_30%,rgba(249,115,22,0.13),transparent_32%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">{feature.eyebrow}</p>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{feature.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">{feature.hero}</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href={SIGNUP_URL} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5">
                  Start Practising Free <ArrowRight size={18} />
                </a>
                <Link href="/auctor-rc" className="px-2 py-3 font-medium text-purple-300 hover:text-purple-200">Explore Auctor RC</Link>
              </div>
              <p className="mt-4 text-sm text-gray-500">Practice happens securely on rc.auctorlabs.in.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-indigo-950/30">
              {feature.visual ? (
                <Image src={feature.visual.src} alt={feature.visual.alt} width={feature.visual.width} height={feature.visual.height} priority className="h-auto w-full rounded-2xl object-contain" />
              ) : (
                <div className="flex min-h-80 flex-col justify-between rounded-2xl bg-gradient-to-br from-[#11183d] to-[#0b1027] p-8">
                  <Target className="text-orange-400" size={42} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">Visual asset status</p>
                    <p className="mt-3 text-xl font-semibold">{feature.name}</p>
                    <p className="mt-3 leading-7 text-gray-400">{feature.visualPlaceholder}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">The feature</p>
          <h2 className="text-3xl font-bold sm:text-4xl">What is {feature.name}?</h2>
          <div className="mt-7 space-y-5 text-lg leading-8 text-gray-300">
            {feature.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#080d22] px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold sm:text-4xl">The problem it solves</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {feature.problems.map((item, index) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
                  <span className="text-sm font-bold text-orange-400">0{index + 1}</span>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-gray-400">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">How it works</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {feature.steps.map((step, index) => (
              <div key={step.title} className="relative rounded-2xl border border-purple-400/20 bg-purple-500/[0.06] p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold">{index + 1}</div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-400">What students get</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Practice with a clear purpose</h2>
            <p className="mt-5 leading-7 text-gray-400">Each capability below is based on functionality already represented in the Auctor Labs website or on the scoped feature definition.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {feature.benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-2xl border border-white/10 bg-[#0f1735] p-6">
                <Check className="text-green-400" size={22} aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 leading-6 text-gray-400">{benefit.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#080d22] to-[#0b0f2a] px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Why this matters for CAT VARC</h2>
            <div className="mt-7 space-y-5 text-lg leading-8 text-gray-300">
              {feature.whyItMatters.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">Who is this for?</h2>
              <ul className="mt-7 space-y-4">
                {feature.audience.map((item) => <li key={item} className="flex gap-3 text-gray-300"><Check className="mt-0.5 shrink-0 text-orange-400" size={20} aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Continue learning</h2>
              <div className="mt-7 space-y-4">
                {feature.related.map((item) => (
                  <Link key={item.href} href={item.href} className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-orange-400/40">
                    <h3 className="font-semibold group-hover:text-orange-300">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-24">
          <h2 className="text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] px-6">
            {feature.faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="cursor-pointer list-none pr-8 text-lg font-semibold marker:hidden">{faq.question}</summary>
                <p className="mt-4 max-w-3xl leading-7 text-gray-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="px-6 pb-28 pt-10">
          <div className="mx-auto max-w-5xl rounded-3xl border border-orange-400/20 bg-gradient-to-br from-purple-500/20 via-indigo-500/15 to-orange-500/15 p-8 text-center sm:p-14">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to practise smarter?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">Build your CAT VARC skills with Auctor RC. Your practice continues in the separate Auctor RC application.</p>
            <a href={SIGNUP_URL} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 font-semibold transition hover:bg-orange-600">
              Start Practising Free <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
