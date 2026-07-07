import Link from "next/link";
export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#07152D] flex items-center justify-center px-6">

      <div className="max-w-xl text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
          <span className="text-5xl">✅</span>
        </div>

        <h1 className="mt-8 text-4xl font-bold text-white">
          Thank You!
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          Your demo request has been received successfully.
        </p>

        <p className="mt-3 text-slate-400">
          Our team will contact you within the next 24 hours to schedule a personalized demo.
        </p>

       <Link
  href="/institute"
  className="mt-10 inline-flex rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white hover:bg-orange-600"
>
  Back to Auctor RC
</Link>
      </div>

    </main>
  );
}