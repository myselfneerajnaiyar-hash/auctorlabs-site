import Link from "next/link";

export default function ThankYouTestSeriesPage() {
  return (
    <main className="min-h-screen bg-[#070b1a] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">

        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          You're In!
        </h1>

        <p className="text-xl text-gray-300 mb-3">
          Your <span className="text-orange-400 font-semibold">4 FREE AI VARC Mocks</span> have been reserved.
        </p>

        <p className="text-gray-400 mb-10">
          We've just sent an email with your access link.
          Please check your inbox and click the button inside to start your AI-powered CAT preparation.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left mb-10">
          <h2 className="text-xl font-semibold mb-5">
            📧 Next Steps
          </h2>

          <ol className="space-y-4 text-gray-300 list-decimal list-inside">
            <li>Open your email inbox.</li>
            <li>Look for an email from <strong>Auctor Labs</strong>.</li>
            <li>Click <strong>"Start My Free AI Mocks"</strong>.</li>
            <li>If you don't find it, check your Promotions or Spam folder.</li>
          </ol>
        </div>

       <Link
  href="/test-series"
  className="inline-block bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-xl font-semibold transition"
>
  ← Back to Test Series
</Link>

        <p className="text-sm text-gray-500 mt-8">
          Didn't receive the email?
          <br />
          Wait for 1–2 minutes and check your Spam or Promotions folder.
        </p>

        <div className="mt-10">
          
        </div>

      </div>
    </main>
  );
}