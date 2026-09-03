const capabilities = [
  ["Daily Workout", "A structured 30-minute session so a student never has to decide what to practice; they just start."],
  ["Precision Training", "Drills targeted at a student's specific weak spots, not a random mix of questions."],
  ["Birbal", "An AI tutor that explains the reasoning behind an RC answer, including inference traps and why the tempting wrong answer is wrong—not just a right or wrong mark."],
  ["Reader DNA", "A profile of how a student actually reads. It can flag an “Impulsive Reader” who reads fast but loses accuracy, so the fix is targeted rather than generic."],
  ["Speed Reading Gym and Vocab Lab", "Supporting drills for reading speed and vocabulary."],
];

const problems = [
  ["No diagnosis", "Getting a question wrong tells a student almost nothing. Was it a vocabulary gap, a misread inference, a tone the passage never actually stated, or just running out of time? A plain answer key can't say."],
  ["No adjustment", "Practice stays generic regardless of what a student is actually bad at. Everyone works through the same passage set in the same order."],
  ["No feedback loop for the teacher", "A coaching institute faculty member teaching 40 students in a batch has no fast way to see which five students are stuck on the same specific mistake, so class time goes to broad review instead of the actual gaps in the room."],
];

const pros = [
  "Practice adjusts to the individual student, not a fixed curriculum everyone works through in the same order.",
  "Mistakes get explained, not just marked. A wrong answer comes with the reasoning behind the right one, so the same mistake is less likely to repeat.",
  "Reader DNA surfaces patterns a student usually can't see about their own reading, like the speed-versus-accuracy tradeoff, early enough to correct it before exam day.",
  "Built by a teacher with 15-plus years in competitive exam prep, so the question design and explanations come from real classroom experience, not a generic template.",
  "Covers the full spread of exams that test RC, so a student prepping for more than one exam at once does not need a separate tool for each.",
  "For institutes, the same platform gives faculty a way to show parents concrete improvement numbers, useful for retention conversations that used to rely on attendance alone.",
];

const limitations = [
  "It covers Reading Comprehension specifically, not a full exam syllabus. Quant, reasoning, and other sections sit outside what this tool does.",
  "It is a subscription, not a one-time purchase, so it is an ongoing cost next to free or one-time resources, and the value shows up over weeks of consistent use, not instantly.",
  "Progress depends on the student actually showing up daily. An adaptive engine only has data to adjust around if the student is putting in the reps; it is not a substitute for that consistency.",
  "It is a self-paced digital tool, not a replacement for a teacher or a coaching batch, though it's built to sit alongside one, not compete with it, since faculty and dashboards are part of the institute version.",
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
];

const card = "rounded-xl border border-white/10 bg-[#0f1735] p-7";

export default function AuctorRcDetails() {
  return <>
    <section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="what-is-auctor-rc">
      <div className="max-w-4xl"><p className="mb-3 font-semibold text-orange-400">Adaptive RC training</p><h2 id="what-is-auctor-rc" className="mb-6 text-3xl font-bold md:text-4xl">What is Auctor RC</h2><div className="space-y-4 text-lg leading-relaxed text-gray-400"><p>Auctor RC is an AI-adaptive Reading Comprehension training platform, built for students preparing for competitive exams that test RC, including CAT, XAT, CLAT, IIFT, SNAP, NMAT, TISSNET, and CUET English.</p><p>Instead of a static bank of passages, Auctor RC tracks what a student actually gets wrong, why they get it wrong, and adjusts future practice around that specific gap. A student who keeps missing tone questions gets more tone questions with targeted explanations. A student who reads fast but loses accuracy gets flagged for that exact tradeoff, not a generic “read more” suggestion.</p></div></div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{capabilities.map(([title,copy])=><article key={title} className={card}><h3 className="mb-3 text-xl font-semibold">{title}</h3><p className="leading-relaxed text-gray-400">{copy}</p></article>)}</div>
    </section>

    <section className="border-y border-white/10 bg-[#080d24]" aria-labelledby="traditional-rc-problem"><div className="mx-auto max-w-6xl px-6 py-24"><h2 id="traditional-rc-problem" className="text-center text-3xl font-bold md:text-4xl">Problem with Traditional RC Prep</h2><div className="mt-12 grid gap-6 md:grid-cols-3">{problems.map(([title,copy],index)=><article key={title} className={card}><p className="mb-3 text-sm font-bold text-orange-400">0{index+1}</p><h3 className="mb-3 text-xl font-semibold">{title}</h3><p className="leading-relaxed text-gray-400">{copy}</p></article>)}</div><p className="mx-auto mt-10 max-w-4xl text-center text-lg leading-relaxed text-gray-300">Reading Comprehension carries real weight across these exams and is one of the harder sections to move quickly, because progress depends on understanding a specific misreading, not just doing more volume.</p></div></section>

    <section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="how-auctor-solves-it"><h2 id="how-auctor-solves-it" className="text-center text-3xl font-bold md:text-4xl">How Auctor RC Solves It</h2><p className="mx-auto mt-5 max-w-3xl text-center text-lg text-gray-400">Auctor RC replaces the static worksheet model with a loop: practice, diagnose, adjust, repeat.</p><ol className="mt-12 grid gap-4 md:grid-cols-4">{["Practice","Diagnose","Adjust","Repeat"].map((step,index)=><li key={step} className={`${card} relative text-center`}><span className="text-sm font-bold text-orange-400">STEP {index+1}</span><p className="mt-2 text-xl font-bold uppercase tracking-wide">{step}</p></li>)}</ol><div className="mt-12 grid gap-6 text-gray-400 md:grid-cols-3"><p className={card}>Every time a student answers an RC question, the system logs not just right or wrong but the type of question—such as inference, tone, main idea or elimination—and the type of mistake.</p><p className={card}>Birbal explains the reasoning gap in plain language right after the question, instead of a student moving on with an unresolved misunderstanding.</p><p className={card}>Precision Training then weights future passages and question types toward the student&apos;s weakest areas, so practice time goes toward the actual gap instead of chapter order.</p></div><div className="mt-6 rounded-xl border border-orange-500/30 bg-orange-500/10 p-7"><h3 className="mb-3 text-xl font-semibold">For institutes</h3><p className="leading-relaxed text-gray-300">For institutes running Auctor RC under their own name, the same data rolls up into a faculty dashboard, so a teacher can see, across a batch, exactly where students are collectively stuck, and a parent report that shows measurable movement over time, not just attendance.</p></div></section>

    <section className="mx-auto grid max-w-6xl gap-8 px-6 py-24 lg:grid-cols-2"><div><h2 className="mb-8 text-3xl font-bold">Pros of Using Auctor RC</h2><ul className="space-y-4">{pros.map(item=><li key={item} className={`${card} flex gap-3`}><span aria-hidden="true" className="text-green-400">✓</span><span className="text-gray-300">{item}</span></li>)}</ul></div><div><h2 className="mb-8 text-3xl font-bold">Limitations of Auctor RC</h2><ul className="space-y-4">{limitations.map(item=><li key={item} className={`${card} flex gap-3`}><span aria-hidden="true" className="text-orange-400">—</span><span className="text-gray-300">{item}</span></li>)}</ul></div></section>

    <section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="why-different"><div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-purple-500/10 p-8 md:p-12"><h2 id="why-different" className="mb-6 text-3xl font-bold md:text-4xl">Why Auctor RC is Different from Other RC Resources</h2><div className="space-y-4 leading-relaxed text-gray-300"><p>Most RC prep resources fall into two categories: static question banks—a fixed set of passages with an answer key and no adaptation—and generic reading-comprehension apps built for a broad audience rather than for a specific competitive exam.</p><p>Auctor RC sits apart on two points. First, the adaptive loop: practice generates data and data adjusts what comes next, which a static PDF or question bank cannot do. Second, the content itself is built by a teacher with 15-plus years actually teaching this section, not adapted from a general reading app or written without classroom teaching experience.</p></div><p className="mt-6"><a href="/about" className="font-semibold text-orange-400 hover:text-orange-300">Learn about Auctor Labs and its founder →</a></p></div></section>

<section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="comparison"><h2 id="comparison" className="mb-10 text-center text-3xl font-bold md:text-4xl">Auctor RC vs Traditional RC Prep vs Generic Reading Apps</h2><div className="overflow-x-auto rounded-xl border border-white/10"><table className="w-full min-w-[720px] border-collapse text-left"><caption className="sr-only">Comparison of Auctor RC, traditional RC preparation and generic reading applications</caption><thead className="bg-[#11183d]"><tr><th scope="col" className="p-4">Capability</th><th scope="col" className="p-4 text-orange-300">Auctor RC</th><th scope="col" className="p-4">Traditional RC prep</th><th scope="col" className="p-4">Generic reading apps</th></tr></thead><tbody>{comparison.map(([capability,auctor,traditional,generic])=><tr key={capability} className="border-t border-white/10"><th scope="row" className="p-4 align-top text-sm font-semibold text-white">{capability}</th><td className="p-4 align-top text-sm text-gray-400">{auctor}</td><td className="p-4 align-top text-sm text-gray-400">{traditional}</td><td className="p-4 align-top text-sm text-gray-400">{generic}</td></tr>)}</tbody></table></div></section>

    <section className="mx-auto max-w-4xl px-6 py-24" aria-labelledby="faqs"><h2 id="faqs" className="mb-10 text-center text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2><div className="space-y-4">{auctorRcFaqs.map(([question,answer])=><details key={question} className="group rounded-xl border border-white/10 bg-[#0f1735] p-6"><summary className="cursor-pointer list-none pr-8 text-lg font-semibold marker:hidden">{question}</summary><p className="mt-4 leading-relaxed text-gray-400">{answer}</p></details>)}</div></section>
  </>;
}
