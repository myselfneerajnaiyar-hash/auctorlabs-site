import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Auctor Labs | AI Tools for Competitive Exam Prep",
  description: "Learn how Auctor Labs, founded by educator Neeraj sir, builds AI training tools for reading comprehension and competitive exam preparation.",
  alternates: { canonical: "https://auctorlabs.in/about" },
  openGraph: { type: "website", url: "https://auctorlabs.in/about", siteName: "Auctor Labs", title: "About Auctor Labs", description: "AI training tools for competitive-exam preparation, built from over 15 years of classroom experience." },
}

export default function About() {

const organizationSchema = {
"@context": "https://schema.org",
"@type": "Organization",
name: "Auctor Labs",
url: "https://auctorlabs.in",
description: "An ed-tech company building AI training tools for competitive exam preparation in India.",
founder: { "@type": "Person", name: "Neeraj Kumar Naiyar", description: "Competitive exam educator with over 15 years of classroom experience." },
}

return (
<>
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema).replace(/</g,"\\u003c")}} />
<Navbar />

<main className="min-h-screen bg-[#0b0f2a] text-white overflow-hidden">


{/* HERO */}

<section className="relative max-w-6xl mx-auto px-6 py-32 text-center">

<div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/20 blur-[160px] rounded-full"></div>

<h1 className="text-5xl md:text-6xl font-bold mb-6 relative">
About Auctor Labs
</h1>

<p className="text-gray-400 text-lg max-w-2xl mx-auto relative">
We build AI-powered learning systems designed to train the
thinking skills required for competitive exams.
</p>

</section>

{/* COMPANY INTRODUCTION */}

<section className="max-w-6xl mx-auto px-6 py-20" aria-labelledby="what-is-auctor-labs">
<div className="grid gap-10 rounded-2xl border border-white/10 bg-[#11183d] p-8 md:grid-cols-[0.8fr_1.2fr] md:p-12">
<div>
<p className="mb-3 font-semibold text-orange-400">Built from classroom experience</p>
<h2 id="what-is-auctor-labs" className="text-3xl font-bold md:text-4xl">What is Auctor Labs</h2>
</div>
<div className="space-y-5 text-lg leading-relaxed text-gray-400">
<p>Auctor Labs is an ed-tech company building AI training tools for competitive exam prep in India. The first product is <a href="/auctor-rc" className="font-medium text-orange-400 hover:text-orange-300">Auctor RC</a>, focused on Reading Comprehension. The company was founded by Neeraj sir, who has taught competitive exam students for 15-plus years.</p>
<p>The starting problem was simple. Most RC prep is the same worksheet model that has existed for twenty years: solve a passage, check the answer key, move to the next passage. Nobody tells the student why they got a question wrong, and nobody adjusts what they practice next based on that gap. Auctor Labs builds tools that do both.</p>
</div>
</div>
</section>

{/* STATS */}

<section className="max-w-6xl mx-auto px-6 py-20">

<div className="grid md:grid-cols-4 gap-8 text-center">

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8">

<p className="text-4xl font-bold text-orange-400 mb-2">
16+
</p>

<p className="text-gray-400 text-sm">
Years Teaching Experience
</p>

</div>

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8">

<p className="text-4xl font-bold text-orange-400 mb-2">
10,000+
</p>

<p className="text-gray-400 text-sm">
Students Taught
</p>

</div>

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8">

<p className="text-4xl font-bold text-orange-400 mb-2">
AI
</p>

<p className="text-gray-400 text-sm">
Powered Learning System
</p>

</div>

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8">

<p className="text-4xl font-bold text-orange-400 mb-2">
CAT
</p>

<p className="text-gray-400 text-sm">
Expert Training System
</p>

</div>

</div>

</section>


{/* MISSION */}

<section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

<div className="bg-[#11183d] border border-white/10 rounded-xl p-10">

<h2 className="text-3xl font-bold mb-6">
Our Mission
</h2>

<p className="text-gray-400 leading-relaxed">
Most exam preparation platforms focus on solving more questions.
But solving more questions does not necessarily improve thinking ability.

At Auctor Labs we focus on training the cognitive skills behind
exam performance — reading ability, reasoning and analytical thinking.
</p>

</div>


<div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-white/10 rounded-xl p-10">

<h3 className="text-2xl font-semibold mb-4">
What We Believe
</h3>

<ul className="text-gray-300 space-y-3">

<li>✔ Intelligence can be trained</li>
<li>✔ Reading ability is the foundation of reasoning</li>
<li>✔ AI can personalize learning</li>
<li>✔ Training systems beat random practice</li>

</ul>

</div>

</section>



{/* WHY WE BUILT */}

<section className="max-w-6xl mx-auto px-6 py-24">

<div className="bg-[#11183d] border border-white/10 rounded-xl p-12 text-center">

<h2 className="text-3xl font-bold mb-6">
Why We Built Auctor RC
</h2>

<p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">

After teaching CAT aspirants for years, we realized something surprising.

Students were not struggling because of lack of practice.
They were struggling because of weak reading ability.

Reading comprehension is fundamentally a *cognitive skill*.

Auctor RC was designed as a structured system to train
reading speed, inference ability and reasoning patterns.

</p>

</div>

</section>



{/* FOUNDER */}

<section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

<div className="relative">

<div className="absolute -inset-10 bg-orange-500/20 blur-3xl opacity-40"></div>

<img
src="/founder.jpeg"
alt="Neeraj Kumar Naiyar, founder of Auctor Labs"
className="relative rounded-xl shadow-2xl"
/>

</div>


<div>

<h2 className="text-3xl font-bold mb-6">
Founder
</h2>

<p className="text-gray-400 leading-relaxed mb-4">

<strong className="text-white">Neraj Kumar Naiyar</strong> is an IIT Roorkee graduate
with over 16 years of experience teaching quantitative aptitude
and logical reasoning for competitive exams.

</p>

<p className="text-gray-400 leading-relaxed">

After working with thousands of students, he observed that
reading ability is one of the biggest hidden determinants of CAT success.

Auctor Labs was created to combine educational expertise
with AI-driven learning systems.

</p>

</div>

</section>



{/* VISION */}

<section className="max-w-6xl mx-auto px-6 py-24 text-center">

<div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-16">

<h2 className="text-3xl font-bold mb-6">
Our Vision
</h2>

<p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">

The future of education lies in intelligent systems
that train thinking skills rather than just delivering content.

Auctor Labs is building AI systems that help students develop
deeper reading ability, reasoning and analytical thinking.

</p>

</div>

</section>



</main>
<Footer/>
</>
)
}
