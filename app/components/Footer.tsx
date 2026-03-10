export default function Footer() {

return (

<footer className="bg-[#070b1a] border-t border-white/10 mt-32">

<div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

{/* Brand */}

<div>

<h3 className="text-lg font-semibold mb-4">
Auctor Labs
</h3>

<p className="text-gray-400 text-sm leading-relaxed">
Building AI-powered learning systems that train
thinking skills required for competitive exams.
</p>

</div>


{/* Product */}

<div>

<h4 className="font-semibold mb-4">
Product
</h4>

<ul className="space-y-2 text-gray-400 text-sm">

<li>
<a href="/auctor-rc" className="hover:text-white">
Auctor RC
</a>
</li>

<li>
<a href="/pricing" className="hover:text-white">
Pricing
</a>
</li>

</ul>

</div>


{/* Company */}

<div>

<h4 className="font-semibold mb-4">
Company
</h4>

<ul className="space-y-2 text-gray-400 text-sm">

<li>
<a href="/about" className="hover:text-white">
About
</a>
</li>

<li>
<a href="/contact" className="hover:text-white">
Contact
</a>
</li>

</ul>

</div>


{/* CTA */}

<div>

<h4 className="font-semibold mb-4">
Get Started
</h4>

<a
href="/pricing"
className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg text-sm font-semibold inline-block"
> 
StartFree Trial
</a>

</div>

</div>



{/* Bottom */}

<div className="border-t border-white/10">

<div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between text-gray-500 text-sm">

<p>
© 2026 Auctor Labs
</p>

<p>
Built with AI for smarter learning
</p>

</div>

</div>

</footer>

)
}