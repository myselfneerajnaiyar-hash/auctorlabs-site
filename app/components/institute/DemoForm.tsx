"use client";
import { useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const exams = [
  "CAT",
  "CLAT",
  "CUET",
  "SSC",
  "Banking",
  "UPSC",
  "GMAT",
  "GRE",
  "IELTS",
  "TOEFL",
  "Other",
];

export default function DemoForm() {

const [selectedExams, setSelectedExams] = useState<string[]>([]);
const [form, setForm] = useState({
  name: "",
  institute_name: "",
  phone: "",
  email: "",
  student_count: "",
  
});

const [loading, setLoading] = useState(false);

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setLoading(true);

  try {
    const res = await fetch("/api/institute-demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        exams: selectedExams,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong.");
      return;
    }

    alert("Demo request submitted successfully!");

    // Reset form
    setForm({
      name: "",
      institute_name: "",
      phone: "",
      email: "",
      student_count: "",
    });

    setSelectedExams([]);

  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};
  return (
    <section className="py-20">

      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 items-center">

        {/* LEFT */}

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            BOOK A FREE DEMO
          </p>

          <h2 className="mt-5 text-4xl md:text-6xl font-black text-white">
            See Auctor
            <br />
            In Action.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Book a personalised walkthrough and discover how AI can
            transform learning, student engagement and institute
            performance.
          </p>

          <div className="mt-10 space-y-5">

            <Benefit text="30-minute personalised walkthrough" />

            <Benefit text="Complete AI platform demonstration" />

            <Benefit text="Institute dashboard overview" />

            <Benefit text="Unlimited practice engine" />

            <Benefit text="No commitment required" />

          </div>

          <div className="mt-12 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">

            <p className="text-lg font-semibold text-white">
              🚀 Get started with AI before everyone else.
            </p>

            <p className="mt-3 text-slate-300">
              We'll show you exactly how institutes are improving
              engagement and learning using Auctor.
            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="rounded-3xl border border-white/10 bg-[#101828] p-8 shadow-2xl">

          <h3 className="text-2xl font-bold text-white">
            Schedule Your Demo
          </h3>

          <p className="mt-2 text-slate-400">
            Fill in your details and we'll contact you shortly.
          </p>

          <form
  onSubmit={handleSubmit}
  className="mt-8 space-y-5"
>

           <Input
  label="Your Name"
  placeholder="Enter your name"
  value={form.name}
  onChange={(e) =>
    setForm({ ...form, name: e.target.value })
  }
/>

           <Input
  label="Institute Name"
  placeholder="ABC Academy"
  value={form.institute_name}
  onChange={(e) =>
    setForm({
      ...form,
      institute_name: e.target.value,
    })
  }
/>

           <Input
  label="Phone Number"
  placeholder="+91 XXXXX XXXXX"
  value={form.phone}
  onChange={(e) =>
    setForm({
      ...form,
      phone: e.target.value,
    })
  }
/>

       <Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  value={form.email}
  onChange={(e) =>
    setForm({
      ...form,
      email: e.target.value,
    })
  }
/>     

           <div>

  <label className="mb-3 block text-sm font-medium text-slate-300">
    Exams You Prepare Students For
  </label>

  <div className="flex flex-wrap gap-3">

    {exams.map((exam) => {

      const active = selectedExams.includes(exam);

      return (

        <button
          type="button"
          key={exam}
          onClick={() => {

            if (active) {

              setSelectedExams(
                selectedExams.filter((x) => x !== exam)
              );

            } else {

              setSelectedExams([
                ...selectedExams,
                exam,
              ]);

            }

          }}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition

          ${
            active
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-white/10 bg-[#182234] text-slate-300 hover:border-orange-500"
          }`}
        >

          {exam}

        </button>

      );

    })}

  </div>



              <label className="mb-2 block text-sm font-medium text-slate-300">
                Approximate Student Strength
              </label>

            <select
  value={form.student_count}
  onChange={(e) =>
    setForm({
      ...form,
      student_count: e.target.value,
    })
  }
  className="w-full rounded-xl border border-white/10 bg-[#182234] px-4 py-4 text-white outline-none focus:border-orange-500"
>

                <option>1–50</option>
                <option>51–100</option>
                <option>101–250</option>
                <option>251–500</option>
                <option>501–1000</option>
                <option>1000+</option>

              </select>

            </div>

           

           <button
  type="submit"
  disabled={loading}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
>
  {loading ? "Submitting..." : "Schedule Free Demo"}

  <ArrowRight size={20} />
</button>

            <p className="text-center text-sm text-slate-500">
              We'll get back to you within 24 hours.
            </p>

          </form>

        </div>

      </div>

    </section>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4">

      <div className="rounded-full bg-green-500/15 p-1.5">

        <CheckCircle2
          size={18}
          className="text-green-400"
        />

      </div>

      <span className="text-lg text-slate-300">
        {text}
      </span>

    </div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#182234] px-4 py-4 text-white placeholder:text-slate-500 outline-none focus:border-orange-500"
      />
    </div>
  );
}