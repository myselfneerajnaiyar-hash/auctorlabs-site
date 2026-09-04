import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  Check,
  ChevronDown,
  CircleAlert,
  Gauge,
  MessagesSquare,
  RefreshCw,
  ScanSearch,
  Sparkles,
  Target,
  UserRoundSearch,
} from "lucide-react";
import Image from "next/image";

const capabilities = [
  { title: "Daily Workout", description: "A structured 30-minute session so a student never has to decide what to practice; they just start.", icon: BookOpenCheck },
  { title: "Precision Training", description: "Drills targeted at a student's specific weak spots, not a random mix of questions.", icon: Target },
  { title: "Birbal", description: "An AI tutor that explains the reasoning behind an RC answer, including inference traps and why the tempting wrong answer is wrong—not just a right or wrong mark.", icon: MessagesSquare },
  { title: "Reader DNA", description: "A profile of how a student actually reads. It can flag an “Impulsive Reader” who reads fast but loses accuracy, so the fix is targeted rather than generic.", icon: UserRoundSearch },
  { title: "Speed Reading Gym", description: "Supporting drills for reading speed and vocabulary.", icon: Gauge },
  { title: "Vocab Lab", description: "Supporting drills for reading speed and vocabulary.", icon: Brain },
];

const problems = [
  { title: "No diagnosis", description: "Getting a question wrong tells a student almost nothing. Was it a vocabulary gap, a misread inference, a tone the passage never actually stated, or just running out of time? A plain answer key can't say.", icon: ScanSearch },
  { title: "No adjustment", description: "Practice stays generic regardless of what a student is actually bad at. Everyone works through the same passage set in the same order.", icon: RefreshCw },
  { title: "No feedback loop for the teacher", description: "A coaching institute faculty member teaching 40 students in a batch has no fast way to see which five students are stuck on the same specific mistake, so class time goes to broad review instead of the actual gaps in the room.", icon: BarChart3 },
];

const process = [
  ["Practice", "Every time a student answers an RC question, the system logs not just right or wrong but the type of question—such as inference, tone, main idea or elimination—and the type of mistake."],
  ["Diagnose", "Birbal explains the reasoning gap in plain language right after the question, instead of a student moving on with an unresolved misunderstanding."],
  ["Adjust", "Precision Training then weights future passages and question types toward the student's weakest areas, so practice time goes toward the actual gap instead of chapter order."],
  ["Repeat", "Practice adjusts to the individual student, not a fixed curriculum everyone works through in the same order."],
] as const;

const pros = [
  "Practice adjusts to the individual student, not a fixed curriculum everyone works through in the same order.",
  "Mistakes get explained, not just marked. A wrong answer comes with the reasoning behind the right one, so the same mistake is less likely to repeat.",
  "Reader DNA surfaces patterns a student usually can't see about their own reading, like the speed-versus-accuracy tradeoff, early enough to correct it before exam day.",
  "Built by a teacher with 15-plus years in competitive exam prep, so the question design and explanations come from real classroom experience, not a generic template.",
  "Covers the full spread of exams that test RC, so a student prepping for more than one exam at once does not need a separate tool for each.",
  "For institutes, the same platform gives faculty a way to show parents concrete improvement numbers, useful for retention conversations that used to rely on attendance alone.",
];

export const auctorRcFaqs = [
  ["What is Auctor RC used for?", "Auctor RC is used to practice and improve the Reading Comprehension section across competitive exams, including CAT, XAT, CLAT, IIFT, SNAP, NMAT, TISSNET, and CUET English."],
  ["Who built Auctor RC?", "Auctor Labs, founded by Neeraj sir, a competitive exam teacher with over 15 years of classroom experience."],
  ["How is Auctor RC different from a normal RC question bank?", "A question bank gives you passages and an answer key. Auctor RC tracks what you get wrong and why, then adjusts your next practice session around that specific gap, instead of moving through a fixed set in a fixed order."],
  ["What is Birbal in Auctor RC?", "Birbal is the AI tutor inside Auctor RC. It explains the reasoning behind each RC answer, including why a tempting wrong option is wrong, instead of just marking a question right or wrong."],
  ["What is Reader DNA?", "Reader DNA is a profile of how you actually read, built from your practice data. For example, it can flag that you read fast but lose accuracy, a pattern called an “Impulsive Reader,” so you know exactly what to fix."],
  ["Which exams does Auctor RC cover?", "CAT, XAT, CLAT, IIFT, SNAP, NMAT, TISSNET, and CUET English."],
  ["How much does Auctor RC cost?", "Auctor RC is ₹399 a month or ₹1,999 for the year."],
  ["Is there a free trial?", "Yes, Auctor RC offers a free trial period before you need to subscribe."],
  ["Does Auctor RC replace a coaching institute?", "No. It’s built to work alongside a coaching batch or self-study, not replace a teacher. Institutes also use Auctor RC directly under their own branding, with faculty dashboards to track student progress."],
  ["How much time does Auctor RC take per day?", "The core Daily Workout is a structured 30-minute session, built so you don’t need to decide what to practice each day."],
  ["Does Auctor RC only help with speed, or also accuracy?", "Both, and specifically how they trade off against each other. Reader DNA is built around the idea that reading faster without checking accuracy is not real improvement, so the platform tracks both together rather than optimizing for speed alone."],
  ["Can institutes use Auctor RC under their own brand?", "Yes. Auctor RC offers a white-labeled version for coaching institutes, with faculty dashboards and parent progress reports."],
] as const;

const comparison = [
  ["Personalized practice", "Yes", "Typically fixed", "Varies"],
  ["Diagnosis of mistakes", "By question and mistake type", "Answer-key review", "Usually general"],
  ["Adaptive next practice", "Yes", "No", "Varies"],
  ["AI reasoning and explanations", "Birbal explains reasoning gaps", "Depends on the resource", "Varies"],
  ["Reading profile", "Reader DNA", "No", "Varies"],
  ["Competitive-exam focus", "CAT, XAT, CLAT, IIFT, SNAP, NMAT, TISSNET and CUET English", "Depends on the resource", "Broad reading audience"],
  ["Teacher or institute dashboard", "Available for institutes", "Not inherent to the format", "Varies"],
  ["Parent progress reporting", "Available for institutes", "Not inherent to the format", "Varies"],
] as const;

const eyebrow = "text-sm font-semibold uppercase tracking-[0.24em] text-orange-400";
const heading = "mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl";

export default function AuctorRcDetails() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-24 pt-36 sm:pb-28 sm:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(249,115,22,0.18),transparent_32%),radial-gradient(circle_at_82%_42%,rgba(99,102,241,0.2),transparent_34%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-300"><Sparkles className="h-4 w-4" aria-hidden="true" />Auctor RC</div>
            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">AI-adaptive Reading Comprehension training<span className="block text-orange-400">for competitive exams.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Auctor RC tracks what a student gets wrong, why they get it wrong, and adjusts future practice around that specific gap.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="https://rc.auctorlabs.in/signup" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-4 font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-600">Try Auctor RC <ArrowRight className="h-5 w-5" aria-hidden="true" /></a>
              <a href="#how-auctor-solves-it" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white transition hover:border-white/25 hover:bg-white/10">See how it works</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-8 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f1735]/90 p-3 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="ml-auto text-xs font-medium uppercase tracking-widest text-slate-500">Reader DNA</span></div>
              <Image src="/rc-dashboard.png" alt="Auctor RC adaptive reading comprehension dashboard" width={1200} height={900} priority className="aspect-[4/3] w-full rounded-2xl object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:py-28" aria-labelledby="what-is-auctor-labs">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 shadow-xl shadow-black/10 sm:p-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div><p className={eyebrow}>Built from classroom experience</p><h2 id="what-is-auctor-labs" className={heading}>What is Auctor Labs</h2></div>
          <div className="space-y-5 text-lg leading-8 text-slate-300"><p>Auctor Labs is an ed-tech company building AI training tools for competitive exam prep in India. The first product is Auctor RC, focused on Reading Comprehension. The company was founded by Neeraj sir, who has taught competitive exam students for 15-plus years.</p><p>The starting problem was simple. Most RC prep is the same worksheet model that has existed for twenty years: solve a passage, check the answer key, move to the next passage. Nobody tells the student why they got a question wrong, and nobody adjusts what they practice next based on that gap. Auctor Labs builds tools that do both.</p></div>
        </div>
      </section>

      <section className="px-6 py-24 sm:py-28" aria-labelledby="what-is-auctor-rc">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl"><p className={eyebrow}>Adaptive RC training</p><h2 id="what-is-auctor-rc" className={heading}>What is Auctor RC</h2><div className="mt-7 space-y-5 text-lg leading-8 text-slate-300"><p>Auctor RC is an AI-adaptive Reading Comprehension training platform, built for students preparing for competitive exams that test RC, including CAT, XAT, CLAT, IIFT, SNAP, NMAT, TISSNET, and CUET English.</p><p>Instead of a static bank of passages, Auctor RC tracks what a student actually gets wrong, why they get it wrong, and adjusts future practice around that specific gap. A student who keeps missing tone questions gets more tone questions with targeted explanations. A student who reads fast but loses accuracy gets flagged for that exact tradeoff, not a generic “read more” suggestion.</p></div></div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ title, description, icon: Icon }) => <article key={title} className="group rounded-2xl border border-white/10 bg-[#0f1735] p-7 transition duration-300 hover:-translate-y-1 hover:border-orange-400/30 hover:bg-[#121c42] hover:shadow-xl hover:shadow-orange-950/10"><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/10 transition group-hover:scale-105"><Icon className="h-6 w-6 text-orange-400" aria-hidden="true" /></div><h3 className="mt-6 text-xl font-bold text-white">{title}</h3><p className="mt-3 leading-7 text-slate-400">{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-[#080d24] px-6 py-24 sm:py-28" aria-labelledby="problem-statement">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-red-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl"><div className="mx-auto max-w-3xl text-center"><p className={eyebrow}>Problem Statement</p><h2 id="problem-statement" className={heading}>Why traditional RC practice leaves the real problem hidden</h2></div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">{problems.map(({ title, description, icon: Icon }, index) => <article key={title} className="relative overflow-hidden rounded-2xl border border-red-400/15 bg-[#0d1430] p-8"><span className="absolute right-5 top-3 text-7xl font-black text-white/[0.035]">0{index + 1}</span><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10"><Icon className="h-6 w-6 text-red-300" aria-hidden="true" /></div><h3 className="mt-6 text-xl font-bold text-white">{title}</h3><p className="mt-4 leading-7 text-slate-400">{description}</p></article>)}</div>
          <p className="mx-auto mt-10 max-w-4xl text-center text-lg leading-8 text-slate-300">Reading Comprehension carries real weight across these exams and is one of the harder sections to move quickly, because progress depends on understanding a specific misreading, not just doing more volume.</p>
        </div>
      </section>

      <section id="how-auctor-solves-it" className="scroll-mt-24 px-6 py-24 sm:py-32" aria-labelledby="how-auctor-heading">
        <div className="mx-auto max-w-6xl"><div className="mx-auto max-w-3xl text-center"><p className={eyebrow}>How Auctor RC Solves It</p><h2 id="how-auctor-heading" className={heading}>A feedback loop built around the actual gap</h2><p className="mt-6 text-lg text-slate-400">Auctor RC replaces the static worksheet model with a loop: practice, diagnose, adjust, repeat.</p></div>
          <ol className="relative mt-16 grid gap-5 lg:grid-cols-4"><div className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-gradient-to-r from-orange-500/20 via-orange-400 to-orange-500/20 lg:block" aria-hidden="true" />{process.map(([title, description], index) => <li key={title} className="group relative rounded-2xl border border-white/10 bg-[#0f1735] p-7 lg:border-0 lg:bg-transparent lg:p-4 lg:text-center"><div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/30 bg-[#111a3d] text-lg font-black text-orange-400 shadow-lg shadow-black/30 transition group-hover:-translate-y-1 lg:mx-auto">0{index + 1}</div><h3 className="mt-6 text-xl font-bold uppercase tracking-wide text-white">{title}</h3><p className="mt-4 text-sm leading-6 text-slate-400">{description}</p></li>)}</ol>
          <div className="mt-12 rounded-2xl border border-orange-400/20 bg-gradient-to-r from-orange-400/10 to-indigo-500/10 p-7 sm:p-9"><h3 className="text-xl font-bold text-white">For institutes</h3><p className="mt-3 leading-7 text-slate-300">For institutes running Auctor RC under their own name, the same data rolls up into a faculty dashboard, so a teacher can see, across a batch, exactly where students are collectively stuck, and a parent report that shows measurable movement over time, not just attendance.</p></div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-6 py-24 sm:py-28" aria-labelledby="pros">
        <div className="mx-auto max-w-6xl"><div className="max-w-3xl"><p className={eyebrow}>Built around individual progress</p><h2 id="pros" className={heading}>Pros of Using Auctor RC</h2></div><ul className="mt-14 grid gap-5 md:grid-cols-2">{pros.map((item, index) => <li key={item} className="flex gap-5 rounded-2xl border border-white/10 bg-[#0f1735] p-6 transition hover:border-orange-400/25"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-orange-400"><Check className="h-4 w-4" aria-hidden="true" /></span><div><span className="text-xs font-bold uppercase tracking-widest text-slate-600">Benefit {index + 1}</span><p className="mt-2 leading-7 text-slate-300">{item}</p></div></li>)}</ul></div>
      </section>

      <section className="px-6 py-24 sm:py-32" aria-labelledby="why-different">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-orange-400/20 bg-gradient-to-br from-orange-400/10 via-[#101735] to-indigo-500/10 p-8 sm:p-12"><CircleAlert className="absolute -right-10 -top-10 h-52 w-52 text-white/[0.025]" aria-hidden="true" /><div className="relative max-w-4xl"><p className={eyebrow}>Why Auctor RC is Different</p><h2 id="why-different" className={heading}>Not a static question bank. Not a generic reading app.</h2><div className="mt-7 space-y-5 text-lg leading-8 text-slate-300"><p>Most RC prep resources fall into two categories: static question banks—a fixed set of passages with an answer key and no adaptation—and generic reading-comprehension apps built for a broad audience rather than for a specific competitive exam.</p><p>Auctor RC sits apart on two points. First, the adaptive loop: practice generates data and data adjusts what comes next, which a static PDF or question bank cannot do. Second, the content itself is built by a teacher with 15-plus years actually teaching this section, not adapted from a general reading app or written without classroom teaching experience.</p></div></div></div>
          <div className="mt-16"><h3 className="max-w-3xl text-2xl font-bold text-white sm:text-3xl">Auctor RC vs Traditional RC Prep vs Generic Reading Apps</h3>
            <div className="mt-8 hidden overflow-hidden rounded-2xl border border-white/10 lg:block"><table className="w-full table-fixed border-collapse text-left"><caption className="sr-only">Comparison of Auctor RC, traditional RC preparation and generic reading applications</caption><thead className="bg-[#11183d]"><tr><th className="w-[25%] p-5 text-sm font-semibold text-slate-400">Capability</th><th className="w-[25%] border-x border-orange-400/20 bg-orange-400/10 p-5 text-sm font-bold text-orange-300">Auctor RC</th><th className="w-[25%] p-5 text-sm font-semibold text-slate-300">Traditional RC prep</th><th className="w-[25%] p-5 text-sm font-semibold text-slate-300">Generic reading apps</th></tr></thead><tbody>{comparison.map(([capability, auctor, traditional, generic]) => <tr key={capability} className="border-t border-white/10 bg-[#0b112b] transition hover:bg-white/[0.035]"><th scope="row" className="p-5 text-sm font-semibold text-white">{capability}</th><td className="border-x border-orange-400/15 bg-orange-400/[0.045] p-5 text-sm font-medium text-orange-100">{auctor}</td><td className="p-5 text-sm leading-6 text-slate-400">{traditional}</td><td className="p-5 text-sm leading-6 text-slate-400">{generic}</td></tr>)}</tbody></table></div>
            <div className="mt-8 grid gap-5 lg:hidden">{comparison.map(([capability, auctor, traditional, generic]) => <article key={capability} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1735]"><h4 className="border-b border-white/10 px-5 py-4 font-bold text-white">{capability}</h4><dl className="grid gap-4 p-5 sm:grid-cols-3"><div className="rounded-xl border border-orange-400/20 bg-orange-400/10 p-4"><dt className="text-xs font-bold uppercase tracking-wider text-orange-400">Auctor RC</dt><dd className="mt-2 text-sm leading-6 text-orange-100">{auctor}</dd></div><div className="p-4"><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Traditional</dt><dd className="mt-2 text-sm leading-6 text-slate-300">{traditional}</dd></div><div className="p-4"><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Generic apps</dt><dd className="mt-2 text-sm leading-6 text-slate-300">{generic}</dd></div></dl></article>)}</div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#080d24] px-6 py-24 sm:py-32" aria-labelledby="faqs">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start"><p className={eyebrow}>FAQs</p><h2 id="faqs" className={heading}>Questions about Auctor RC</h2><p className="mt-5 leading-7 text-slate-400">Everything you need to know about the platform, practice experience and institute access.</p></div>
          <div className="space-y-3">{auctorRcFaqs.map(([question, answer], index) => <details name="auctor-rc-faq" key={question} className="group rounded-2xl border border-white/10 bg-[#0f1735] px-6 open:border-orange-400/25 open:bg-[#111a3d]"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 font-semibold text-white marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"><span className="flex gap-4"><span className="hidden text-xs font-bold text-slate-600 sm:inline">{String(index + 1).padStart(2, "0")}</span>{question}</span><ChevronDown className="h-5 w-5 shrink-0 text-orange-400 transition-transform duration-300 group-open:rotate-180" aria-hidden="true" /></summary><div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]"><div className="overflow-hidden"><p className="border-t border-white/10 pb-6 pt-5 leading-7 text-slate-400">{answer}</p></div></div></details>)}</div>
        </div>
      </section>
    </>
  );
}
