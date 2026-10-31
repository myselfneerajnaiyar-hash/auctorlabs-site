import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { appAttributionHref } from "../../lib/app-attribution";

const plans = [
  { id: "monthly", contentId: "pricing_monthly", name: "Pro Monthly", price: "₹399", detail: "Flexible monthly access", featured: false },
  { id: "quarterly", contentId: "pricing_3month", name: "3 Month", price: "₹799", detail: "Focused preparation", featured: true },
  { id: "half_yearly", contentId: "pricing_half_yearly", name: "Half Yearly", price: "₹1,299", detail: "Six months of structured practice", featured: false },
  { id: "yearly", contentId: "pricing_elite", name: "Elite (Yearly)", price: "₹1,999", detail: "Best value for a full year", featured: false },
];

const sharedFeatures = [
  "Daily RC workouts",
  "Speed reading gym",
  "Birbal AI mentor",
  "Performance analytics",
  "Unlimited RC practice",
];

export default function Pricing() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0b0f2a] text-white">
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-32 text-center sm:pt-36">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-orange-400">Auctor RC plans</p>
          <h1 className="mb-6 text-4xl font-black sm:text-5xl">Choose your preparation plan</h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-400">
            Choose a plan, then review the current offers and complete checkout securely in Auctor RC.
          </p>
          <a
            href={appAttributionHref("/signup", "pricing_free_trial")}
            className="mt-8 inline-flex rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
          >
            Start Free Trial
          </a>
        </section>

        <section aria-label="Subscription plans" className="mx-auto max-w-7xl px-6 pb-24">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-7 text-center ${plan.featured ? "border-orange-400 bg-gradient-to-b from-orange-500/15 to-[#0f1735] shadow-[0_0_40px_rgba(249,115,22,0.14)]" : "border-white/10 bg-[#0f1735]"}`}
              >
                {plan.featured && <span className="absolute right-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold">POPULAR</span>}
                <h2 className="mt-4 text-2xl font-bold">{plan.name}</h2>
                <p className="mt-5 text-4xl font-black">{plan.price}</p>
                <p className="mt-2 min-h-6 text-sm text-gray-400">{plan.detail}</p>
                <ul className="my-8 flex-1 space-y-3 text-left text-sm text-gray-300">
                  {sharedFeatures.map((feature) => <li key={feature}>✓ {feature}</li>)}
                  {plan.id !== "monthly" && <>
                    <li>✓ 45-Day VARC Bootcamp</li>
                    <li>✓ CAT VARC Test Series</li>
                    <li>✓ All app modules</li>
                  </>}
                </ul>
                <a
                  href={appAttributionHref("/pricing", plan.contentId, { plan: plan.id })}
                  className={`inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-semibold transition ${plan.featured ? "bg-orange-500 hover:bg-orange-600" : "bg-[#1a2454] hover:bg-[#243080]"}`}
                >
                  Choose {plan.name}
                </a>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-gray-400">
            <p>Secure checkout and current coupons are handled in Auctor RC.</p>
            <p className="mt-2">Payments are processed securely. No plan is purchased until checkout is confirmed.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
