import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Pricing() {

return (
<>
<Navbar />

<main className="min-h-screen bg-[#0b0f2a] text-white">

{/* HERO */}

<section className="max-w-6xl mx-auto px-6 py-28 text-center">

<h1 className="text-5xl font-bold mb-6">
Start Your 7 Day Free Trial
</h1>

<p className="text-gray-400 text-lg max-w-xl mx-auto">
Train your reading intelligence with structured RC workouts,
AI mentorship and performance analytics.
</p>

</section>


{/* PRICING */}

<section className="max-w-6xl mx-auto px-6 pb-32">

<div className="grid md:grid-cols-3 gap-10">


{/* FREE TRIAL */}

<div className="bg-[#0f1735] border border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.25)] rounded-xl p-8 text-center hover:scale-105 transition">

<h3 className="text-xl font-semibold mb-4">
Free Trial
</h3>

<p className="text-4xl font-bold mb-4">
₹0
</p>

<p className="text-gray-400 mb-6">
Full access for 7 days
</p>

<ul className="text-gray-300 space-y-2 mb-8 text-sm">

<li>✔ Daily RC workouts</li>
<li>✔ Speed reading gym</li>
<li>✔ Birbal AI mentor</li>
<li>✔ Analytics dashboard</li>
<li>✔ Unlimited RC practice</li>

</ul>

<a
href="https://rc.auctorlabs.in"
className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold inline-block"
> 
StartFree Trial
</a>

</div>


{/* MONTHLY */}

<div className="bg-[#0f1735] border border-white/10 rounded-xl p-8 text-center hover:scale-105 transition">

<h3 className="text-xl font-semibold mb-4">
Monthly
</h3>

<p className="text-4xl font-bold mb-4">
₹399
</p>

<p className="text-gray-400 mb-6">
Flexible plan for short term preparation
</p>

<ul className="text-gray-400 space-y-2 mb-8 text-sm">

<li>✔ Daily RC workouts</li>
<li>✔ Speed reading gym</li>
<li>✔ Birbal AI mentor</li>
<li>✔ Performance analytics</li>
<li>✔ Unlimited RC practice</li>

</ul>

<a
href="https://rzp.io/rzp/8dUAksb"
className="bg-[#1a2454] hover:bg-[#243080] px-6 py-3 rounded-lg font-semibold inline-block"
> 
StartMonthly Plan
</a>

</div>


{/* YEARLY */}

<div className="relative bg-gradient-to-b from-orange-500/20 to-[#0f1735] border border-orange-500 rounded-xl p-8 text-center hover:scale-105 transition">

<div className="absolute top-3 right-3 bg-orange-500 text-xs px-3 py-1 rounded-full">
MOST POPULAR
</div>

<h3 className="text-xl font-semibold mb-4">
Yearly
</h3>

<p className="text-4xl font-bold mb-2">
₹1999
</p>

<p className="text-orange-400 mb-6">
Only ₹166 / month
</p>

<ul className="text-gray-300 space-y-2 mb-8 text-sm">

<li>✔ Everything in Monthly</li>
<li>✔ Unlimited RC practice</li>
<li>✔ AI RC Generator</li>
<li>✔ Birbal reasoning explanations</li>
<li>✔ Full analytics dashboard</li>

</ul>

<a
href="https://rzp.io/rzp/g0Nxkgl"
className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold inline-block"
> 
UnlockPremium
</a>

</div>

</div>


{/* TRUST STRIP */}

<div className="text-center mt-16 text-gray-400 text-sm">

<p className="mb-2">
Secure payments powered by Razorpay
</p>

<p>
Cancel anytime • No hidden charges
</p>

</div>

</section>

</main>

<Footer />

</>
)
}