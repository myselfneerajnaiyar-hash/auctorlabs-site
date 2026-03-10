import Navbar from "../components/Navbar"
import { Brain, Zap, BarChart3, Bot } from "lucide-react"
import ProductDemo from "../components/ProductDemo"
import Footer from "../components/Footer"

export default function AuctorRC() {

return (
<>
<Navbar />

<main className="min-h-screen bg-[#0b0f2a] text-white">

{/* HERO */}

<section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">

<div>

<p className="text-orange-400 font-semibold mb-4">
Auctor RC
</p>

<h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
Train Your Reading Intelligence
for CAT RC
</h1>

<p className="text-gray-400 text-lg mb-8">
Auctor RC is an AI powered training system designed to improve
reading speed, inference ability and reasoning skills.
</p>

<div className="flex gap-4">

<a
href="/pricing"
className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold"
> 
StartFree Trial →
</a>

</div>

<p className="text-gray-500 text-sm mt-4">
7 day free trial • Cancel anytime
</p>

</div>

<div className="relative">

<div className="absolute -inset-10 bg-orange-500/20 blur-3xl opacity-30"></div>

<img
src="/rc-dashboard.png"
alt="Auctor RC dashboard"
className="relative rounded-xl shadow-2xl"
/>

</div>

</section>

{/* TRUST STRIP */}

<section className="max-w-6xl mx-auto px-6 py-10 text-center border-y border-white/10">

<p className="text-gray-400 text-sm mb-4">
Built for serious CAT & GMAT aspirants
</p>

<div className="flex flex-wrap justify-center gap-10 text-gray-300 text-sm">

<span>✔ Daily RC Workouts</span>
<span>✔ AI Mentor Guidance</span>
<span>✔ Unlimited RC Practice</span>
<span>✔ Performance Analytics</span>

</div>

</section>

{/* READING INTELLIGENCE */}

<section className="max-w-6xl mx-auto px-6 py-28">

<h2 className="text-4xl font-bold text-center mb-12">
Most CAT Platforms Give Practice.
We Train Reading Intelligence.
</h2>

<p className="text-gray-400 text-center max-w-3xl mx-auto mb-16 text-lg">
Auctor RC focuses on the cognitive skills behind reading comprehension —
speed, inference, reasoning and tone detection.
</p>

<div className="grid md:grid-cols-2 gap-20 items-center">

<div className="space-y-6">

<div>
<p className="mb-2 text-sm text-gray-400">Reading Speed</p>
<div className="w-full bg-[#11183d] h-3 rounded-full">
<div className="bg-orange-500 h-3 rounded-full w-[75%]"></div>
</div>
</div>

<div>
<p className="mb-2 text-sm text-gray-400">Inference Ability</p>
<div className="w-full bg-[#11183d] h-3 rounded-full">
<div className="bg-orange-500 h-3 rounded-full w-[85%]"></div>
</div>
</div>

<div>
<p className="mb-2 text-sm text-gray-400">Author Tone Detection</p>
<div className="w-full bg-[#11183d] h-3 rounded-full">
<div className="bg-orange-500 h-3 rounded-full w-[70%]"></div>
</div>
</div>

<div>
<p className="mb-2 text-sm text-gray-400">Trap Detection</p>
<div className="w-full bg-[#11183d] h-3 rounded-full">
<div className="bg-orange-500 h-3 rounded-full w-[80%]"></div>
</div>
</div>

</div>

<div className="relative">

<div className="absolute -inset-12 bg-orange-500/20 blur-3xl opacity-30"></div>

<img
src="/reading-intelligence.png"
className="relative w-full max-w-none rounded-xl shadow-2xl"
/>

</div>
</div>

</section>

<ProductDemo />

{/* RC GENERATOR */}

<section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">

<div>

<h2 className="text-4xl font-bold mb-6">
Unlimited RC Practice
</h2>

<p className="text-gray-400 text-lg mb-6">
Generate fresh CAT-level reading comprehension passages using AI.
Practice across philosophy, science, economics and more.
</p>

<ul className="space-y-3 text-gray-300">

<li>✔ AI generated RC passages</li>
<li>✔ Adjustable difficulty levels</li>
<li>✔ Unlimited practice material</li>
<li>✔ CAT style questions</li>

</ul>

</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<p className="text-gray-400 mb-4 text-sm">
AI RC Generator
</p>

<div className="space-y-3">

<div className="bg-[#11183d] p-3 rounded">
Topic: Philosophy
</div>

<div className="bg-[#11183d] p-3 rounded">
Difficulty: CAT Hard
</div>

<div className="bg-[#11183d] p-3 rounded">
Length: 500 words
</div>

</div>

<button className="mt-6 bg-orange-500 px-5 py-2 rounded-lg">
Generate RC
</button>

</div>

</section>

{/* TRAINING LOOP */}

<section className="max-w-6xl mx-auto px-6 py-28">

<h2 className="text-4xl font-bold text-center mb-16">
How Auctor RC Improves Your RC Skills
</h2>

<div className="grid md:grid-cols-5 gap-6 text-center">

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-6">
<p className="font-semibold mb-2">Daily Workout</p>
<p className="text-sm text-gray-400">
Structured RC training session
</p>
</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-6">
<p className="font-semibold mb-2">Speed Gym</p>
<p className="text-sm text-gray-400">
Improve reading speed
</p>
</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-6">
<p className="font-semibold mb-2">RC Practice</p>
<p className="text-sm text-gray-400">
Adaptive RC passages
</p>
</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-6">
<p className="font-semibold mb-2">Birbal AI</p>
<p className="text-sm text-gray-400">
Understand reasoning mistakes
</p>
</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-6">
<p className="font-semibold mb-2">Analytics</p>
<p className="text-sm text-gray-400">
Track skill improvement
</p>
</div>

</div>

</section>

{/* IMPROVEMENT */}

<section className="max-w-6xl mx-auto px-6 py-28 text-center">

<h2 className="text-4xl font-bold mb-12">
Why Auctor RC Works
</h2>

<div className="grid md:grid-cols-3 gap-10">

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<p className="text-3xl font-bold text-orange-400 mb-4">
30 min
</p>

<p className="text-gray-400">
Short daily workouts designed to build consistent reading ability.
</p>

</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<p className="text-3xl font-bold text-orange-400 mb-4">
AI Feedback
</p>

<p className="text-gray-400">
Birbal explains reasoning mistakes and improves your RC thinking.
</p>

</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<p className="text-3xl font-bold text-orange-400 mb-4">
Analytics
</p>

<p className="text-gray-400">
Track reading speed, accuracy and reasoning patterns.
</p>

</div>

</div>

</section>




{/* PROBLEM */}

<section className="max-w-6xl mx-auto px-6 py-24">

<h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
Why Most Students Struggle in RC
</h2>

<div className="grid md:grid-cols-2 gap-12">

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<ul className="space-y-4 text-gray-400">

<li>❌ Practicing random passages</li>
<li>❌ No feedback on reasoning mistakes</li>
<li>❌ No reading speed training</li>
<li>❌ No structured improvement</li>

</ul>

</div>

<div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 rounded-xl p-8">

<ul className="space-y-4 text-gray-200">

<li>✔ Structured daily RC workouts</li>
<li>✔ AI mentor explanations</li>
<li>✔ Reading speed training</li>
<li>✔ Skill intelligence analytics</li>

</ul>

</div>

</div>

</section>


{/* TRAINING MODULES */}

<section className="max-w-6xl mx-auto px-6 py-28">

<h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
How Auctor RC Trains Your Reading Intelligence
</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<Brain className="text-orange-400 mb-4" size={30} />

<h3 className="text-xl font-semibold mb-4">
Daily Workout
</h3>

<p className="text-gray-400">
A structured 30 minute RC training routine designed
to improve reading ability consistently.
</p>

</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<Zap className="text-orange-400 mb-4" size={30} />

<h3 className="text-xl font-semibold mb-4">
Speed Gym
</h3>

<p className="text-gray-400">
Improve words per minute while maintaining
reading comprehension.
</p>

</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<BarChart3 className="text-orange-400 mb-4" size={30} />

<h3 className="text-xl font-semibold mb-4">
Analytics Dashboard
</h3>

<p className="text-gray-400">
Track reading speed, accuracy,
and reasoning patterns.
</p>

</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<Bot className="text-orange-400 mb-4" size={30} />

<h3 className="text-xl font-semibold mb-4">
Birbal AI Mentor
</h3>

<p className="text-gray-400">
Ask Birbal why answers are wrong
and understand inference traps.
</p>

</div>

</div>

</section>


{/* BIRBAL */}

<section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">

<div>

<h2 className="text-4xl font-bold mb-6">
Meet Birbal — Your AI RC Mentor
</h2>

<p className="text-gray-400 text-lg mb-6">

Birbal helps you understand the reasoning behind every RC answer.
Ask questions, explore inference traps, and improve your thinking.

</p>

<ul className="text-gray-300 space-y-2">

<li>✔ Understand why answers are correct</li>
<li>✔ Learn author tone detection</li>
<li>✔ Improve inference reasoning</li>

</ul>

</div>

<div>

<img
src="/birbal-ai.png"
alt="Birbal AI mentor"
className="rounded-xl shadow-xl"
/>

</div>

</section>


{/* TESTIMONIALS */}

<section className="max-w-6xl mx-auto px-6 py-28">

<h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
Students Love Auctor RC
</h2>

<div className="grid md:grid-cols-3 gap-10">

{/* TESTIMONIAL 1 */}

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8 text-center">

<img
src="/testimonials/student1.jpg"
className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
/>

<p className="text-gray-300 mb-4">
"Auctor RC finally made RC practice structured instead of random."
</p>

<p className="font-semibold">Rohan Mehta</p>

<p className="text-sm text-gray-500">
CAT Aspirant
</p>

</div>


{/* TESTIMONIAL 2 */}

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8 text-center">

<img
src="/testimonials/student2.jpg"
className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
/>

<p className="text-gray-300 mb-4">
"The speed gym helped me improve my reading speed significantly."
</p>

<p className="font-semibold">Priya Sharma</p>

<p className="text-sm text-gray-500">
GMAT Student
</p>

</div>


{/* TESTIMONIAL 3 */}

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8 text-center">

<img
src="/testimonials/student3.jpg"
className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
/>

<p className="text-gray-300 mb-4">
"Birbal explains RC reasoning much better than typical answer keys."
</p>

<p className="font-semibold">Aman Gupta</p>

<p className="text-sm text-gray-500">
CAT Aspirant
</p>

</div>

</div>

<p className="text-center text-gray-400 mt-12">
Students using Auctor RC improve RC accuracy by 
<span className="text-green-400 font-semibold"> 18–32% </span>
within 30 days.
</p>

</section>



{/* PRICING PREVIEW */}

<section className="max-w-6xl mx-auto px-6 py-28 text-center">

<h2 className="text-4xl font-bold mb-12">
Start Your 7-Day Free Trial
</h2>

<div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">

{/* FREE TRIAL */}

<div className="bg-[#0f1735] border border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.25)] rounded-xl p-8 hover:scale-105 transition">

<h3 className="text-xl font-semibold mb-4">
Free Trial
</h3>

<p className="text-4xl font-bold mb-4">
₹0
</p>

<p className="text-gray-400 mb-6">
Full access for 7 days
</p>

<ul className="text-gray-300 space-y-2 mb-6 text-sm">

<li>✔ Daily RC workouts</li>
<li>✔ Speed reading gym</li>
<li>✔ Birbal AI mentor</li>
<li>✔ Performance analytics</li>

</ul>

<a
href="https://rc.auctorlabs.in/login"
className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold inline-block"
> 
Start Free Trial
</a>
</div>


{/* MONTHLY */}

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8 hover:scale-105 transition">

<h3 className="text-xl font-semibold mb-3">
Monthly
</h3>

<p className="text-4xl font-bold mb-2">
₹399
</p>

<p className="text-gray-400 mb-6">
Flexible plan for short-term preparation
</p>

<ul className="text-gray-400 space-y-2 mb-6 text-sm">

<li>✔ Daily RC workouts</li>
<li>✔ Speed reading gym</li>
<li>✔ Birbal AI mentor</li>
<li>✔ Performance analytics</li>

</ul>

<a
href="/pricing"
className="bg-[#1a2454] hover:bg-[#243080] px-6 py-3 rounded-lg font-semibold inline-block"
> 
ViewPlan
</a>

</div>


{/* YEARLY */}

<div className="relative bg-gradient-to-b from-orange-500/20 to-[#0f1735] border border-orange-500 rounded-xl p-8 hover:scale-105 transition">

<div className="absolute top-3 right-3 text-xs bg-orange-500 px-3 py-1 rounded-full">
MOST POPULAR
</div>

<h3 className="text-xl font-semibold mb-3">
Yearly
</h3>

<p className="text-4xl font-bold mb-2">
₹1999
</p>

<p className="text-orange-400 mb-6">
Only ₹166 / month
</p>

<ul className="text-gray-300 space-y-2 mb-6 text-sm">

<li>✔ Everything in Monthly</li>
<li>✔ Unlimited RC practice</li>
<li>✔ AI RC generator</li>
<li>✔ Birbal reasoning explanations</li>

</ul>

<a
href="/pricing"
className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold inline-block"
> 
UnlockBirbal Premium
</a>

</div>

</div>

<p className="text-gray-500 text-sm mt-10">
Secure payments powered by Razorpay
</p>

</section>
{/* FINAL CTA */}

<section className="max-w-6xl mx-auto px-6 py-28 text-center">

<h2 className="text-4xl font-bold mb-6">
Start Training Your Reading Intelligence
</h2>

<p className="text-gray-400 mb-10">
Join Auctor RC and improve your reading ability every day.
</p>

<a
href="https://rc.auctorlabs.in/login"
className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold inline-block"
> 
Start Free Trial
</a>

</section>

</main>
<Footer/>
</>
)
}