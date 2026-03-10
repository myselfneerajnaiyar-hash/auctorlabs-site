"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function ProductDemo() {

const [tab,setTab] = useState("workout")

const demos = {
workout:{
title:"Daily RC Workout",
image:"/demo-workout.png",
text:"A structured 30 minute RC training routine combining speed drills, vocabulary and passages."
},
speed:{
title:"Speed Gym",
image:"/demo-speed.png",
text:"Train your reading speed while maintaining comprehension."
},
birbal:{
title:"Birbal AI Mentor",
image:"/demo-birbal.png",
text:"Ask Birbal why answers are correct or incorrect and understand inference traps."
},
analytics:{
title:"Performance Analytics",
image:"/demo-analytics.png",
text:"Track accuracy, reading speed and reasoning patterns."
}
}

return (

<section className="max-w-6xl mx-auto px-6 py-24">

<h2 className="text-4xl font-bold text-center mb-12">
See Auctor RC in Action
</h2>

<div className="bg-[#0f1735]/60 border border-white/10 rounded-2xl p-10 backdrop-blur">

<div className="flex flex-wrap justify-center gap-4 mb-12">

<button
onClick={()=>setTab("workout")}
className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
${tab === "workout"
? "bg-orange-500 text-white shadow-lg"
: "bg-[#11183d] text-gray-300 hover:bg-[#1a2454]"}`}
> 
Daily Workout
</button>

<button
onClick={()=>setTab("speed")}
className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
${tab === "speed"
? "bg-orange-500 text-white shadow-lg"
: "bg-[#11183d] text-gray-300 hover:bg-[#1a2454]"}`}
> 
Speed Gym
</button>

<button
onClick={()=>setTab("birbal")}
className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
${tab === "birbal"
? "bg-orange-500 text-white shadow-lg"
: "bg-[#11183d] text-gray-300 hover:bg-[#1a2454]"}`}
> 
Birbal AI
</button>

<button
onClick={()=>setTab("analytics")}
className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
${tab === "analytics"
? "bg-orange-500 text-white shadow-lg"
: "bg-[#11183d] text-gray-300 hover:bg-[#1a2454]"}`}
> 
Analytics
</button>
</div>

<div className="grid md:grid-cols-[0.9fr_1.6fr] gap-10 items-center mt-12">

<div>

<h3 className="text-3xl font-bold mb-4">
{demos[tab].title}
</h3>

<p className="text-gray-400 text-lg leading-relaxed max-w-sm">
{demos[tab].text}
</p>
<ul className="mt-6 space-y-2 text-gray-300 text-sm">
<li>✔ Adaptive RC passages</li>
<li>✔ Skill focused improvement</li>
<li>✔ AI driven feedback</li>
</ul>

</div>

<div className="relative w-full">

<div className="absolute -inset-10 bg-orange-500/20 blur-3xl opacity-30"></div>

<motion.div
key={tab}
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35 }}
className="relative bg-[#0f1735] border border-white/10 rounded-2xl p-4 shadow-xl"
>

<img
src={demos[tab].image}
className="w-full rounded-lg scale-110"
/>

</motion.div>

</div>

</div>

</div>


</section>

)
}