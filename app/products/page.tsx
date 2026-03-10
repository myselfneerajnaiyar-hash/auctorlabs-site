import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Brain, BookOpen, Bot, MessageSquare } from "lucide-react"

export default function Products() {

return (
<>
<Navbar />

<main className="min-h-screen bg-[#0b0f2a] text-white">


{/* HERO */}

<section className="max-w-6xl mx-auto px-6 py-28 text-center">

<h1 className="text-5xl font-bold mb-6">
Auctor Learning Systems
</h1>

<p className="text-gray-400 text-lg max-w-2xl mx-auto">
Auctor Labs builds AI-powered training environments designed to
develop the cognitive skills required for competitive exams.
</p>

</section>



{/* PRODUCTS GRID */}

<section className="max-w-6xl mx-auto px-6 pb-32">

<div className="grid md:grid-cols-2 gap-10">


{/* AUCTOR RC */}

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-10 hover:scale-105 transition">

<div className="flex items-center gap-4 mb-6">
<Brain className="text-orange-400" size={30}/>
<h2 className="text-2xl font-semibold">
Auctor RC
</h2>
</div>

<p className="text-gray-400 mb-6">
AI-powered Reading Comprehension training system for CAT and GMAT aspirants.
Train reading speed, inference ability and reasoning through structured daily workouts.
</p>

<a
href="/auctor-rc"
className="text-orange-400 font-semibold hover:underline"
> 
ExploreAuctor RC →
</a>

</div>



{/* AUCTOR GS */}

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-10 hover:scale-105 transition">

<div className="flex items-center gap-4 mb-6">
<BookOpen className="text-orange-400" size={30}/>
<h2 className="text-2xl font-semibold">
Auctor GS
</h2>
</div>

<p className="text-gray-400 mb-6">
AI-powered General Studies knowledge system designed for UPSC aspirants.
Learn concepts through intelligent explanations and dynamic knowledge maps.
</p>

<span className="text-gray-500">
Coming Soon
</span>

</div>



{/* AUCTOR PI */}

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-10 hover:scale-105 transition">

<div className="flex items-center gap-4 mb-6">
<MessageSquare className="text-orange-400" size={30}/>
<h2 className="text-2xl font-semibold">
Auctor PI
</h2>
</div>

<p className="text-gray-400 mb-6">
AI-powered Personal Interview training system for MBA and job interviews.
Practice interview questions and receive feedback on your answers,
communication and reasoning.
</p>

<span className="text-gray-500">
In Development
</span>

</div>



{/* AUCTOR MENTOR */}

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-10 hover:scale-105 transition">

<div className="flex items-center gap-4 mb-6">
<Bot className="text-orange-400" size={30}/>
<h2 className="text-2xl font-semibold">
Auctor Mentor
</h2>
</div>

<p className="text-gray-400 mb-6">
Your AI learning coach that guides your preparation,
tracks performance and recommends the best training strategy.
</p>

<span className="text-gray-500">
Future System
</span>

</div>


</div>

</section>

</main>

<Footer />

</>
)
}