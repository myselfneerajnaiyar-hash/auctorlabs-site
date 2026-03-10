
import Navbar from "./components/Navbar"
import { Brain, BookOpen, Sparkles } from "lucide-react"
import Footer from "./components/Footer"


export default function Home() {

    return (
  <>
    <Navbar />
   <main className="min-h-screen bg-[#0b0f2a] text-white bg-[radial-gradient(circle_at_top,#1a1f4d,#0b0f2a)]">

      {/* HERO SECTION */}

      <section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">

        <div>
          <p className="text-purple-400 mb-4 font-semibold">
AUCTOR LABS
</p>

       <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
Training Intelligence
<br />
for Competitive Exams
</h1>
         <p className="text-gray-400 text-lg mb-8 max-w-lg">
We build intelligent training systems that help aspirants
master reading comprehension, reasoning and analytical thinking.
</p>

          <a
            href="https://rc.auctorlabs.in/login"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 transition px-6 py-3 rounded-lg font-semibold shadow-lg"
          >
          
            Explore Auctor RC →
          </a>

        </div>

      <div className="relative">

<div className="absolute -inset-6 bg-blue-500/10 blur-2xl"></div>

<div className="relative bg-[#0f1735] border border-white/10 rounded-xl p-6 shadow-xl">

<p className="text-gray-400 mb-4 text-sm">
AuctorRC Performance Dashboard
</p>

<img
src="/dashboard.png"
alt="AuctorRC dashboard"
className="rounded-lg w-full"
/>

</div>

</div>

      </section>

      {/* ABOUT AUCTOR LABS */}

<section className="max-w-6xl mx-auto px-6 py-28">

<h2 className="text-3xl md:text-4xl font-bold mb-10">
About Auctor Labs
</h2>

<p className="text-gray-400 text-lg leading-relaxed max-w-3xl">

Most exam preparation platforms focus on solving questions.

But solving questions does not build intelligence.

Auctor Labs builds AI-powered learning systems designed to train the
underlying cognitive skills required for competitive exams — reading,
reasoning and analytical thinking.


Our goal is to move beyond practice platforms and create intelligent
training environments that help students develop real problem-solving ability.

</p>

</section>


<section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">

<div>

<h2 className="text-3xl font-bold mb-6">
Training Reading Intelligence
</h2>

<p className="text-gray-400 text-lg">
Auctor systems are designed to train the cognitive
skills behind reading comprehension — speed,
inference, reasoning and tone detection.
</p>

</div>

<div>

<img
src="/reading-ai.png"
alt="AI learning system"
className="rounded-xl shadow-lg"
/>

</div>

</section>

      {/* PRODUCTS */}

<section className="max-w-6xl mx-auto px-6 py-24">

<h2 className="text-3xl font-bold mb-12 text-center">
Our Learning Systems
</h2>

<div className="grid md:grid-cols-3 gap-10">

{/* Auctor RC */}

<div className="bg-[#0f1735] border border-white/10 backdrop-blur rounded-xl p-8 hover:scale-105 hover:shadow-xl transition duration-300">

<div className="flex items-center gap-3 mb-4">
<Brain className="text-orange-400 mb-4" size={28} />
<h3 className="text-xl font-semibold">
Auctor RC
</h3>
</div>

<p className="text-gray-400 mb-6">
AI-driven reading comprehension training for CAT aspirants.
</p>

<a
href="https://rc.auctorlabs.in"
className="text-purple-400"
> 
OpenPlatform →
</a>

</div>


{/* Auctor GS */}

<div className="bg-[#0f1735] border border-white/10 backdrop-blur rounded-xl p-8 hover:scale-105 transition">

<div className="flex items-center gap-3 mb-4">
<Brain className="text-orange-400" size={28} />
<h3 className="text-xl font-semibold">
Auctor GS
</h3>
</div>

<p className="text-gray-400 mb-6">
Smart knowledge systems for UPSC and general studies.
</p>

<span className="text-gray-500">
Coming Soon
</span>

</div>


{/* AI Mentor */}

<div className="bg-[#0f1735] border border-white/10 backdrop-blur rounded-xl p-8 hover:scale-105 transition">

<div className="flex items-center gap-3 mb-4">
<Sparkles className="text-orange-400" size={28} />
<h3 className="text-xl font-semibold">
AI Mentors
</h3>
</div>

<p className="text-gray-400 mb-6">
Personalized AI guidance engines for exam preparation.
</p>

<span className="text-gray-500">
In Development
</span>

</div>

</div>

</section>
{/* AUCTOR RC SPOTLIGHT */}

<section className="max-w-6xl mx-auto px-6 py-28">

<div className="grid md:grid-cols-2 gap-16 items-center">

<div>

<h2 className="text-4xl font-bold mb-6">
Auctor RC
</h2>

<p className="text-gray-400 text-lg mb-6">
The first AI-powered training system built specifically 
for mastering Reading Comprehension in CAT.
</p>

<ul className="text-gray-300 mb-8 space-y-2">

<li>• Adaptive RC practice engine</li>
<li>• Reading speed training gym</li>
<li>• AI mentor insights</li>
<li>• Skill intelligence dashboard</li>

</ul>

<a
href="https://rc.auctorlabs.in/login"
className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition px-6 py-3 rounded-lg font-semibold"
> 
StartTraining →
</a>

</div>

<div className="bg-[#11183d] rounded-xl p-10">

<h3 className="text-xl mb-6">
Why students love Auctor RC
</h3>

<div className="space-y-4 text-gray-400">

<p>✔ No random RC practice</p>

<p>✔ Structured reading intelligence training</p>

<p>✔ Personalized AI feedback</p>

<p>✔ Built specifically for CAT difficulty</p>

</div>

</div>

</div>

</section>

{/* AI TRAINING EXPLANATION */}

<section className="max-w-6xl mx-auto px-6 py-28">

<h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
Why AI Training Beats Random Practice
</h2>

<div className="grid md:grid-cols-2 gap-12">

{/* Traditional */}

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<h3 className="text-xl font-semibold mb-6 text-gray-300">
Traditional CAT Preparation
</h3>

<ul className="space-y-4 text-gray-400">

<li>❌ Random RC passages</li>

<li>❌ No structured improvement</li>

<li>❌ No skill tracking</li>

<li>❌ No feedback on reading behavior</li>

<li>❌ Hard to know your real weakness</li>

</ul>

</div>


{/* Auctor */}

<div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20 rounded-xl p-8">

<h3 className="text-xl font-semibold mb-6 text-purple-300">
Auctor AI Training System
</h3>

<ul className="space-y-4 text-gray-200">

<li>✔ Adaptive RC selection</li>

<li>✔ Reading intelligence measurement</li>

<li>✔ Skill based improvement tracking</li>

<li>✔ AI mentor feedback</li>

<li>✔ Structured reading training system</li>

</ul>

</div>

</div>

</section>

{/* TESTIMONIALS */}

<section className="max-w-6xl mx-auto px-6 py-28">

<h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
Why Students Love Auctor
</h2>

<div className="grid md:grid-cols-3 gap-10">

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<p className="text-gray-300 mb-4">
"Auctor RC finally made RC practice feel structured instead of random."
</p>

<p className="text-sm text-gray-500">
CAT Aspirant
</p>

</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<p className="text-gray-300 mb-4">
"The speed gym helped me improve my reading speed significantly."
</p>

<p className="text-sm text-gray-500">
GMAT Student
</p>

</div>

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8">

<p className="text-gray-300 mb-4">
"Birbal explains RC reasoning much better than typical answer keys."
</p>

<p className="text-sm text-gray-500">
CAT Aspirant
</p>

</div>

</div>

</section>

{/* PHILOSOPHY */}

<section className="max-w-6xl mx-auto px-6 py-28">

<div className="max-w-3xl">

<h2 className="text-3xl md:text-4xl font-bold mb-10">
Our Philosophy
</h2>

<p className="text-gray-400 text-lg leading-relaxed">

Exams like CAT and GMAT do not test memory.

They test how well you can read, reason and analyze complex information.

Most preparation methods focus on solving more questions.

At Auctor Labs, we believe improvement comes from training the
underlying cognitive skills behind those questions.

That is why our systems are designed as training environments,
not just practice platforms.

</p>

</div>

</section>
{/* COMMUNITY */}

<section className="max-w-6xl mx-auto px-6 py-28 text-center">

<h2 className="text-3xl md:text-4xl font-bold mb-10">
Join the Auctor Community
</h2>

<p className="text-gray-400 mb-12">
Follow our updates, learning insights and product releases.
</p>

<div className="flex justify-center gap-10 text-gray-300">

<a href="#">YouTube</a>
<a href="#">Telegram</a>
<a href="#">Instagram</a>
<a href="#">Twitter</a>

</div>

</section>


    </main>
    <Footer/>
    </>
  )
}