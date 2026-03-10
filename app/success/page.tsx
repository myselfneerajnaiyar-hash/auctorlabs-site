import Navbar from "../components/Navbar"

export default function Success() {

return (
<>
<Navbar />

<main className="min-h-screen bg-[#0b0f2a] text-white flex items-center justify-center">

<div className="max-w-xl text-center px-6">

<h1 className="text-5xl font-bold text-green-400 mb-6">
Payment Successful 🎉
</h1>

<p className="text-gray-400 text-lg mb-10">
Welcome to Auctor RC. Your access has been activated.
You can now start training your reading intelligence.
</p>

<a
href="https://rc.auctorlabs.in"
className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-lg font-semibold text-lg inline-block"
> 
StartAuctor RC →
</a>

<p className="text-gray-500 text-sm mt-8">
If you face any issue accessing the platform,
contact us via the contact page.
</p>

</div>

</main>
</>
)
}