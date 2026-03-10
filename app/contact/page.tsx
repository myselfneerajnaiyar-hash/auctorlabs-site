import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Contact() {

return (
<>
<Navbar />

<main className="min-h-screen bg-[#0b0f2a] text-white">


{/* HERO */}

<section className="max-w-6xl mx-auto px-6 py-32 text-center">

<h1 className="text-5xl font-bold mb-6">
Contact Auctor Labs
</h1>

<p className="text-gray-400 text-lg max-w-2xl mx-auto">
Have questions about Auctor RC or need support?  
Reach out and we'll help you.
</p>

</section>



{/* CONTACT OPTIONS */}

<section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10">


{/* PHONE */}

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8 text-center">

<h3 className="text-xl font-semibold mb-4">
Phone
</h3>

<p className="text-gray-400 mb-4">
Call or WhatsApp
</p>

<p className="text-orange-400 font-semibold">
+91 7838804491
</p>

</div>


{/* WEBSITE */}

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8 text-center">

<h3 className="text-xl font-semibold mb-4">
Website
</h3>

<p className="text-gray-400 mb-4">
Access the Auctor RC platform
</p>

<a
href="https://rc.auctorlabs.in"
className="text-orange-400 font-semibold hover:underline"
> 
rc.auctorlabs.in
</a>

</div>


{/* EMAIL */}

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8 text-center">

<h3 className="text-xl font-semibold mb-4">
Email
</h3>

<p className="text-gray-400 mb-4">
Support & queries
</p>

<p className="text-orange-400 font-semibold">
info@auctorlabs.in
</p>

</div>


</section>



{/* SOCIAL LINKS */}

<section className="max-w-6xl mx-auto px-6 py-24">

<h2 className="text-3xl font-bold text-center mb-12">
Connect With Us
</h2>

<div className="grid md:grid-cols-4 gap-8 text-center">


{/* INSTAGRAM */}

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8">

<h4 className="font-semibold mb-2">
Instagram
</h4>

<p className="text-gray-400 text-sm mb-4">
Follow updates & tips
</p>

<a href="#" className="text-orange-400 hover:underline">
Coming Soon
</a>

</div>



{/* TELEGRAM */}

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8">

<h4 className="font-semibold mb-2">
Telegram
</h4>

<p className="text-gray-400 text-sm mb-4">
Join the CAT preparation community
</p>

<p className="text-gray-500 text-sm">
Channel launching soon
</p>

</div>



{/* YOUTUBE */}

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8">

<h4 className="font-semibold mb-2">
YouTube
</h4>

<p className="text-gray-400 text-sm mb-4">
RC strategies & CAT prep content
</p>

<p className="text-gray-500 text-sm">
Channel launching soon
</p>

</div>



{/* TWITTER / X */}

<div className="bg-[#11183d] border border-white/10 rounded-xl p-8">

<h4 className="font-semibold mb-2">
Twitter / X
</h4>

<p className="text-gray-400 text-sm mb-4">
Product updates
</p>

<p className="text-gray-500 text-sm">
Coming soon
</p>

</div>

</div>

</section>



</main>

<Footer />

</>
)
}