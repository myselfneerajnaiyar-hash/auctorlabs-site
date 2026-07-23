"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LeadCapture() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [catYear, setCatYear] = useState("CAT 2026");

  const [loading, setLoading] = useState(false);
  

  const router = useRouter();

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  setLoading(true);

  // Save lead
 const { error } = await supabase
  .from("test_series_leads")
  .insert({
    name,
    email,
    phone,
    cat_attempt: catYear,
  });

 if (error) {
  setLoading(false);

  if (error.code === "23505") {
    alert("You have already claimed your free AI mocks.");
  } else {
    alert(error.message);
  }

  return;
}

  // Send email
  const emailResponse = await fetch("/api/send-test-series-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
    }),
  });

  if (!emailResponse.ok) {
    console.error("Failed to send email");
  }

 setLoading(false);

window.location.href = "/thank-you-test-series";
}
  return (
    <section
      id="lead-form"
      className="py-24 px-6 bg-gradient-to-b from-[#07152D] via-[#0B1D3C] to-[#07152D]"
    >
      <div className="max-w-3xl mx-auto">

        <div className="rounded-3xl border border-orange-500/20 bg-slate-900/80 backdrop-blur-xl p-10 shadow-2xl">

         
      
              <div className="text-center">

                <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
                  🎁 FREE FOR A LIMITED TIME
                </div>

                <h2 className="mt-6 text-4xl font-bold text-white">
                  Claim Your 4 Free CAT Mocks
                </h2>

                <p className="mt-4 text-lg text-slate-300">
                  Experience AI-powered diagnosis, detailed analytics and
                  CAT-level RCs before purchasing the full test series.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
              >
                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    Full Name
                  </label>

                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    Email Address
                  </label>

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    Mobile Number
                  </label>

                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    CAT Attempt
                  </label>

                  <select
                    value={catYear}
                    onChange={(e) => setCatYear(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-orange-500"
                  >
                    <option>CAT 2026</option>
                    <option>CAT 2027</option>
                    <option>Other</option>
                  </select>
                </div>

                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-orange-500 py-4 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading
                    ? "Please wait..."
                    : "Send Me My Free CAT Mocks"}
                </button>

                <p className="text-center text-xs text-slate-500">
                  No spam. We'll only send your test access and important
                  updates.
                </p>
              </form>
           
          
         
        </div>
      </div>
    </section>
  );
}