export const SIGNUP_URL = "https://rc.auctorlabs.in/signup";
export const SITE_URL = "https://auctorlabs.in";

export type FeaturePage = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  hero: string;
  overview: string[];
  problems: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  benefits: { title: string; text: string }[];
  visual?: { src: string; alt: string; width: number; height: number };
  visualPlaceholder?: string;
  whyItMatters: string[];
  audience: string[];
  related: { href: string; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
};

export const featurePages: FeaturePage[] = [
  {
    slug: "daily-rc-workout",
    name: "Daily RC Workout",
    eyebrow: "Structured CAT VARC practice",
    title: "Daily RC Workout for CAT VARC",
    description: "Build a consistent CAT reading comprehension routine with a structured daily RC workout combining passages, speed drills and vocabulary practice.",
    hero: "Build reading comprehension ability through a focused 30-minute routine designed to make CAT RC practice consistent rather than random.",
    overview: [
      "Daily RC Workout is Auctor RC’s structured training session for students who know they need regular practice but do not want to choose disconnected passages every day.",
      "The workout brings together the skills already represented across Auctor RC—reading comprehension, reading speed and vocabulary—inside one repeatable routine. The aim is not simply to finish more questions; it is to practise with enough structure to notice what needs work next.",
    ],
    problems: [
      { title: "Inconsistent practice", text: "Long gaps make it difficult to build the attention and reading stamina that CAT passages demand." },
      { title: "Random passage selection", text: "Solving whichever passage is available can create activity without a clear training rhythm." },
      { title: "Unclear weaknesses", text: "Without reviewing speed, accuracy and reasoning patterns together, students can misdiagnose the real problem." },
    ],
    steps: [
      { title: "Begin the workout", text: "Set aside one focused session instead of waiting for an ideal, uninterrupted study block." },
      { title: "Complete the activities", text: "Work through the reading, speed and vocabulary practice included in the routine." },
      { title: "Review the attempt", text: "Look beyond the score and examine where comprehension or decision-making broke down." },
      { title: "Return consistently", text: "Use the next daily session to reinforce the skill rather than repeating the same mistake." },
    ],
    benefits: [
      { title: "A defined daily routine", text: "A clear session removes the friction of deciding what to practise." },
      { title: "Connected skill practice", text: "RC, speed and vocabulary are trained as parts of reading ability—not isolated tasks." },
      { title: "Short, focused sessions", text: "The existing Auctor RC workflow is designed around a structured 30-minute workout." },
      { title: "Performance review", text: "Use speed, accuracy and reasoning patterns to make the next session more purposeful." },
    ],
    visual: { src: "/features/workout.png", alt: "Auctor RC Daily RC Workout product screen showing structured CAT VARC practice", width: 1532, height: 635 },
    whyItMatters: [
      "CAT VARC rewards skills that develop through repeated exposure: following an argument, noticing a shift in tone, separating evidence from assumption and choosing between close options. Occasional marathon sessions do not create the same feedback loop as regular, attentive practice.",
      "A daily RC routine also makes progress easier to interpret. When practice conditions are reasonably consistent, a student can distinguish a genuine comprehension problem from a rushed attempt or a temporary lapse in concentration.",
    ],
    audience: ["CAT 2026 aspirants building a sustainable VARC routine", "Students whose RC practice is irregular or random", "Aspirants balancing VARC with QA and DILR", "Students who want one focused reading session each day"],
    related: [
      { href: "/blog/unlocking-success-how-daily-reading-comprehension-transforms-your-cat-preparation", title: "How daily reading transforms CAT preparation", description: "Understand why consistency matters more than occasional bursts of practice." },
      { href: "/blog/unlocking-success-mastering-reading-comprehension-for-cat-with-proven-strategies", title: "Proven CAT RC strategies", description: "Connect daily practice with active reading and evidence-led elimination." },
    ],
    faqs: [
      { question: "What is the Auctor RC Daily Workout?", answer: "It is a structured 30-minute reading-comprehension training routine that combines passages, speed work and vocabulary practice." },
      { question: "Is daily RC practice useful for CAT?", answer: "Regular practice helps students repeatedly train passage comprehension, reasoning and option selection. The quality of review matters as much as frequency." },
      { question: "Does the workout replace CAT mocks?", answer: "No. A daily workout develops component skills, while mocks test how those skills perform under full exam conditions." },
      { question: "Can I use it if I am starting VARC preparation?", answer: "Yes. A defined routine can help a beginner establish consistency without having to design a new practice plan every day." },
      { question: "Where do I access the workout?", answer: "The public page explains the feature; the workout itself is available in the separate Auctor RC application after signup." },
    ],
  },
  {
    slug: "speed-drills",
    name: "Speed Drills",
    eyebrow: "Reading speed with comprehension",
    title: "Speed Drills for CAT Reading Comprehension",
    description: "Practise CAT reading speed without losing comprehension using focused Auctor RC speed drills built for VARC preparation.",
    hero: "Train reading speed while protecting the comprehension and reasoning that CAT VARC questions actually test.",
    overview: [
      "Auctor RC Speed Drills—represented elsewhere on the site as the Speed Gym—give reading speed a focused place in your preparation. The purpose is not to race through words; it is to process passages more efficiently while maintaining comprehension.",
      "That distinction matters. A faster first read is useful only when you can still identify the argument, the author’s position and the relationships between paragraphs.",
    ],
    problems: [
      { title: "Slow passage processing", text: "Dense prose can consume too much of the VARC section before students reach the questions." },
      { title: "Rushing without retention", text: "Trying to force speed often creates rereading and missed relationships between ideas." },
      { title: "No speed benchmark", text: "Without focused practice, it is hard to know whether time is lost in reading, reasoning or indecision." },
    ],
    steps: [
      { title: "Read with a purpose", text: "Track the passage structure and argument instead of attempting to memorise every sentence." },
      { title: "Work within the drill", text: "Practise processing the text efficiently under a focused time constraint." },
      { title: "Check comprehension", text: "Treat understanding as the guardrail; speed that destroys meaning is not progress." },
      { title: "Review the pattern", text: "Notice where difficult syntax, unfamiliar subjects or attention shifts slowed you down." },
    ],
    benefits: [
      { title: "Focused speed practice", text: "Train reading pace separately from the pressure of a complete mock." },
      { title: "Comprehension guardrails", text: "Keep understanding central rather than chasing words per minute alone." },
      { title: "More deliberate pacing", text: "Learn where to slow down for a claim, contrast or qualification." },
      { title: "Progress visibility", text: "Auctor RC already supports tracking reading speed alongside accuracy patterns." },
    ],
    visual: { src: "/features/speed.png", alt: "Auctor RC Speed Drills screen for practising CAT reading speed with comprehension", width: 1037, height: 732 },
    whyItMatters: [
      "CAT does not award marks for reading quickly in isolation. The practical goal is to create enough time for careful question analysis without turning the passage into a blur. Efficient readers recognise structure, adjust pace and avoid unnecessary rereads.",
      "Focused drills can help separate two problems that often look identical: slow processing of the passage and slow decision-making between answer choices. Once you know where the time goes, practice becomes more precise.",
    ],
    audience: ["Students who regularly leave an RC passage unattempted", "Aspirants who reread large parts of a passage", "Readers who rush and then lose accuracy", "CAT students who want controlled speed practice outside mocks"],
    related: [
      { href: "/blog/mastering-cat-verbal-ability-secrets-to-conquering-reading-comprehension-challenges", title: "Reading speed in CAT Verbal Ability", description: "Explore why pace must work together with comprehension." },
      { href: "/blog/unlocking-success-common-rc-mistakes-cat-aspirants-make-and-how-to-overcome-them", title: "Common RC mistakes", description: "See how rushed reading creates avoidable interpretation errors." },
    ],
    faqs: [
      { question: "Are Speed Drills the same as speed reading?", answer: "No. The goal is efficient reading with comprehension, not skimming as many words as possible." },
      { question: "Will reading faster automatically improve my CAT score?", answer: "Not automatically. Faster processing helps only when passage structure, argument and evidence remain clear." },
      { question: "Should I practise speed before accuracy?", answer: "Build a reliable comprehension process first, then improve its efficiency. Speed and accuracy should be reviewed together." },
      { question: "Do the drills replace full RC passages?", answer: "No. Focused drills train one part of the skill; full passages and mocks are still needed to apply it." },
      { question: "Where are Speed Drills available?", answer: "They are used inside the separate Auctor RC application. This public page is an indexable explanation of the feature." },
    ],
  },
  {
    slug: "reading-comprehension-generator",
    name: "RC Generator",
    eyebrow: "More purposeful passage practice",
    title: "Reading Comprehension Generator for CAT Practice",
    description: "Explore how the Auctor RC reading comprehension generator supports CAT VARC passage practice across subjects and difficulty levels.",
    hero: "Access reading comprehension practice without relying on a small, repetitive bank of passages.",
    overview: [
      "The Auctor RC Generator is the product’s passage-practice feature. The existing product page describes it as an AI RC generator that supports practice across subjects and difficulty levels.",
      "Its role is simple: make it easier to continue practising while still treating every passage as a reasoning exercise. Generated practice should complement—not replace—previous-year questions and careful review.",
    ],
    problems: [
      { title: "Repetitive material", text: "Repeatedly seeing familiar passages can make performance look stronger than it is." },
      { title: "Narrow subject exposure", text: "Comfort with one topic does not prepare a reader for the range of unfamiliar CAT passages." },
      { title: "Practice without reflection", text: "A larger supply of passages is useful only when attempts are analysed rather than consumed." },
    ],
    steps: [
      { title: "Choose the practice context", text: "Use the available subject and difficulty options represented in the Auctor RC generator." },
      { title: "Attempt the passage", text: "Read for structure, answer with textual evidence and commit to each decision." },
      { title: "Analyse the options", text: "Review why the correct answer fits and why each tempting alternative fails." },
      { title: "Carry the lesson forward", text: "Use the next passage to test whether the same reasoning error appears again." },
    ],
    benefits: [
      { title: "Continued RC practice", text: "Access more passage practice when you need focused training beyond a fixed set." },
      { title: "Subject variety", text: "Work with unfamiliar subject matter rather than depending on topic comfort." },
      { title: "Difficulty choice", text: "The existing generator interface includes difficulty selection for practice." },
      { title: "Reasoning-focused review", text: "Pair new passages with Auctor RC’s emphasis on understanding mistakes." },
    ],
    visual: { src: "/features/rc-generator.png", alt: "Auctor RC reading comprehension generator with subject and difficulty practice options", width: 982, height: 822 },
    whyItMatters: [
      "CAT passages can arrive from philosophy, science, economics, history or social theory. The exam does not require prior expertise, but it does require composure when the subject feels unfamiliar. Varied practice helps students rely on structure and evidence instead of background knowledge.",
      "Volume alone is not the advantage. A generator becomes useful when every passage feeds a review process: What did the author claim? Which transition changed the argument? Why was a wrong option attractive? Those questions convert another attempt into training.",
    ],
    audience: ["CAT aspirants who need a wider pool of RC passages", "Students practising unfamiliar subject areas", "Learners who want difficulty-based reading practice", "Aspirants combining generated practice with PYQs and mocks"],
    related: [
      { href: "/blog/mastering-cat-reading-comprehension-unveiling-strategies-and-insights-behind-sample-questions-and-answers", title: "CAT RC strategies and sample questions", description: "Learn how to analyse passages and options before expanding practice volume." },
      { href: "/blog/mastering-reading-comprehension-for-cat-unlocking-the-secrets-to-high-scores", title: "Reading comprehension for higher CAT scores", description: "Build a sound method for varied passage practice." },
    ],
    faqs: [
      { question: "What is the Auctor RC Generator?", answer: "It is a feature for accessing RC passage practice, with subject and difficulty options represented in the existing product interface." },
      { question: "Does generated RC practice replace CAT previous-year questions?", answer: "No. PYQs remain important for understanding the exam. Generated material can provide additional skill practice between PYQs and mocks." },
      { question: "How should I review a generated passage?", answer: "Review the passage structure, evidence for the correct choice and the precise flaw in each option you considered." },
      { question: "Is subject knowledge required?", answer: "CAT RC primarily tests comprehension and reasoning. Practising unfamiliar subjects can help you learn to rely on the passage itself." },
      { question: "Where can I use the generator?", answer: "The generator is available within the separate Auctor RC application after signup." },
    ],
  },
  {
    slug: "vocabulary-lab",
    name: "Vocabulary Lab",
    eyebrow: "Vocabulary in reading context",
    title: "Vocabulary Lab for CAT VARC Preparation",
    description: "Build useful CAT vocabulary through contextual practice that supports reading comprehension rather than isolated word memorisation.",
    hero: "Strengthen the vocabulary you need to follow arguments, interpret tone and read unfamiliar CAT passages with less friction.",
    overview: [
      "Vocabulary Lab is represented in Auctor Labs’ existing skill-development experience as part of reading training. Its place in CAT preparation is contextual: vocabulary should make a passage easier to interpret, not become an endless list of obscure definitions.",
      "A strong working vocabulary helps readers recognise contrast, qualification and attitude. The useful question is not only ‘What does this word mean?’ but also ‘What is this word doing in the author’s argument?’",
    ],
    problems: [
      { title: "Isolated memorisation", text: "Word lists are difficult to retain when meaning is separated from actual reading." },
      { title: "Context confusion", text: "A familiar word can carry a different force depending on the sentence and argument." },
      { title: "Slow processing", text: "Stopping at every unfamiliar word interrupts the relationships that make a passage coherent." },
    ],
    steps: [
      { title: "Meet the word in context", text: "Use the surrounding sentence and argument before reaching for a memorised definition." },
      { title: "Infer its role", text: "Decide whether the word signals approval, doubt, contrast, intensity or qualification." },
      { title: "Confirm the meaning", text: "Refine the contextual inference into a usable understanding of the word." },
      { title: "Recognise it again", text: "Repeated encounters turn a fragile definition into working reading vocabulary." },
    ],
    benefits: [
      { title: "Context-first learning", text: "Connect meaning to sentences and arguments rather than memorising in isolation." },
      { title: "Better passage flow", text: "Reduce the urge to stop and translate every unfamiliar expression." },
      { title: "Sharper tone reading", text: "Notice how diction contributes to attitude and author intent." },
      { title: "A stronger reading habit", text: "Treat vocabulary building as part of daily reading development." },
    ],
    visualPlaceholder: "Product screenshot placeholder: add an approved Vocabulary Lab screen from the Auctor RC application when one is available.",
    whyItMatters: [
      "CAT does not usually test vocabulary as a standalone list. It tests whether language prevents you from following a dense argument or distinguishing between close interpretations. Contextual vocabulary work therefore supports comprehension, inference and tone together.",
      "You also do not need to know every word in a passage. A capable reader learns when an unknown term is central, when its approximate role is enough and when the surrounding logic makes the sentence usable without a perfect definition.",
    ],
    audience: ["Aspirants who pause frequently at unfamiliar words", "Students who forget vocabulary learned from lists", "Readers who struggle with dense academic prose", "CAT candidates who want vocabulary to support—not replace—RC practice"],
    related: [
      { href: "/blog/focusing-on-words-blinds-you-to-the-real-meaning", title: "Why focusing on words can hide meaning", description: "Learn when vocabulary attention starts interfering with passage-level comprehension." },
      { href: "/blog/rc-tone-hidden-skill", title: "Tone is about intent, not isolated words", description: "Connect diction with the author’s broader purpose." },
    ],
    faqs: [
      { question: "Is vocabulary important for CAT VARC?", answer: "Yes, but mainly because it supports comprehension, inference and tone. CAT preparation should not become an exercise in memorising rare words." },
      { question: "How is contextual vocabulary different from a word list?", answer: "Contextual practice connects a word to the sentence, attitude and argument in which it appears, making the meaning more usable." },
      { question: "Do I need to understand every word in a CAT passage?", answer: "No. You need enough understanding to follow the argument and identify when an unfamiliar word materially changes the meaning." },
      { question: "Can vocabulary practice improve reading speed?", answer: "A stronger working vocabulary can reduce unnecessary pauses, but efficient reading also depends on syntax, structure and attention." },
      { question: "Where is Vocabulary Lab available?", answer: "It is part of the separate Auctor RC product experience. This page does not recreate the authenticated feature." },
    ],
  },
  {
    slug: "birbal-editorial-decoder",
    name: "Birbal Editorial Decoder",
    eyebrow: "Decode argument, tone and intent",
    title: "Birbal Editorial Decoder for CAT VARC",
    description: "Use Birbal’s reasoning-led approach to examine editorial arguments, author intent and tone for stronger CAT reading comprehension.",
    hero: "Turn editorial reading into active CAT VARC practice by looking beyond the topic to the reasoning beneath the text.",
    overview: [
      "Birbal is Auctor RC’s AI mentor for understanding reasoning mistakes, inference traps and why answers are correct or incorrect. Editorial decoding applies that reasoning-led approach to the kind of argument-rich reading students often use for VARC preparation.",
      "The objective is not to collect facts from an editorial. It is to recognise the central claim, see how the author builds it and distinguish tone from topic. Those habits transfer more directly to CAT RC.",
    ],
    problems: [
      { title: "Passive newspaper reading", text: "Finishing an editorial can feel productive even when its argument is difficult to explain afterward." },
      { title: "Topic over structure", text: "Students remember what the article discussed but miss how the author reasoned." },
      { title: "Vague tone labels", text: "Tone is often guessed from one dramatic word instead of the author’s sustained intent." },
    ],
    steps: [
      { title: "Read the editorial", text: "Follow the central issue while marking claims, contrasts and qualifications." },
      { title: "State the argument", text: "Summarise what the author wants the reader to accept—not merely the subject." },
      { title: "Decode tone and intent", text: "Use language and structure together to identify the author’s stance." },
      { title: "Question the reasoning", text: "Use Birbal’s established reasoning-support role to examine assumptions and interpretation errors." },
    ],
    benefits: [
      { title: "Active editorial reading", text: "Turn a general reading habit into an argument-analysis exercise." },
      { title: "Author-intent practice", text: "Separate the writer’s purpose from the passage topic." },
      { title: "Tone awareness", text: "Use evidence across the text rather than relying on a single adjective." },
      { title: "Reasoning explanations", text: "Birbal’s confirmed role is to help explain RC reasoning and inference mistakes." },
    ],
    visual: { src: "/features/birbal.png", alt: "Birbal AI mentor interface supporting editorial and CAT RC reasoning analysis", width: 1552, height: 601 },
    whyItMatters: [
      "Editorials can expose students to compressed arguments, competing viewpoints and carefully qualified language. But simply reading them does not guarantee CAT improvement. Transfer happens when you actively identify the author’s claim, evidence, assumptions and attitude.",
      "This also builds restraint. CAT inference and tone questions reward the option the passage supports—not the strongest opinion a reader can imagine. Learning to stay within an author’s actual language is a valuable exam skill.",
    ],
    audience: ["Students who already read editorials but cannot measure the benefit", "Aspirants struggling with author tone and purpose", "Readers who summarise topics but miss arguments", "CAT candidates working on inference and critical reading"],
    related: [
      { href: "/blog/rc-tone-hidden-skill", title: "The hidden skill behind RC tone", description: "Learn to infer attitude from intent rather than isolated vocabulary." },
      { href: "/blog/your-comprehension-is-strong-yet-your-inferences-are-weak", title: "Strong comprehension, weak inference", description: "See why understanding facts is not the same as reading implications." },
    ],
    faqs: [
      { question: "What is Birbal?", answer: "Birbal is Auctor RC’s AI mentor for understanding RC reasoning mistakes, correct and incorrect answers, and inference traps." },
      { question: "Why use editorials for CAT VARC?", answer: "Editorials can provide practice with arguments, viewpoints, tone and qualification when read actively rather than as a source of facts." },
      { question: "Does reading editorials alone improve RC?", answer: "Not necessarily. Improvement depends on analysing structure, purpose and reasoning instead of only finishing the article." },
      { question: "How should I identify author tone?", answer: "Consider the author’s purpose and sustained attitude across the text, then use specific language as evidence." },
      { question: "Does this page contain the Birbal product?", answer: "No. This is a public explanation. Birbal is accessed through the separate Auctor RC application." },
    ],
  },
  {
    slug: "precision-drills",
    name: "Precision Drills",
    eyebrow: "Accuracy before guesswork",
    title: "Precision Drills for CAT RC Accuracy",
    description: "Develop more careful CAT RC decisions through focused precision practice for context, evidence and option elimination.",
    hero: "Practise the small reading and option-selection decisions that determine whether close CAT RC questions become correct answers.",
    overview: [
      "Precision Drills focus attention on accuracy: reading the scope of a claim, respecting context and eliminating options for a stated reason. They are positioned as targeted practice, not as a promise that more questions automatically produce a higher score.",
      "The principle is straightforward. When two options feel plausible, the useful skill is identifying the exact word, inference or scope shift that makes one less defensible than the other.",
    ],
    problems: [
      { title: "Careless scope shifts", text: "An option can sound relevant while making a broader or narrower claim than the passage supports." },
      { title: "Intuitive elimination", text: "Rejecting a choice because it feels wrong makes the same mistake difficult to diagnose." },
      { title: "Accuracy plateaus", text: "More full passages may repeat an option-selection weakness without isolating it." },
    ],
    steps: [
      { title: "Inspect the claim", text: "Identify exactly what the passage and question allow the answer to say." },
      { title: "Compare close options", text: "Look for changes in scope, certainty, causation or author attitude." },
      { title: "Eliminate with evidence", text: "Give every rejection a reason grounded in the text rather than preference." },
      { title: "Name the mistake", text: "Record the trap so that it becomes recognisable in later RC practice." },
    ],
    benefits: [
      { title: "Option-level attention", text: "Slow down at the point where close choices actually diverge." },
      { title: "Evidence-led elimination", text: "Replace vague instinct with a passage-based reason." },
      { title: "Context discipline", text: "Judge a sentence by its role in the full argument." },
      { title: "Actionable review", text: "Describe the decision error instead of recording only right or wrong." },
    ],
    visualPlaceholder: "Product screenshot placeholder: add an approved Precision Drills screen from the Auctor RC application when one is available.",
    whyItMatters: [
      "CAT RC answer choices are designed to be plausible. Wrong options often borrow the passage’s language while changing its force: a possibility becomes a certainty, a local point becomes the main idea or the author’s qualified view becomes extreme.",
      "Precision is therefore not perfectionism. It is the habit of checking whether each choice matches the text at the right level of scope and certainty. Targeted practice can make that habit explicit before it must operate under mock-test pressure.",
    ],
    audience: ["Students stuck at an inconsistent RC accuracy level", "Aspirants frequently choosing between the final two options", "Readers who understand passages but lose marks in elimination", "CAT candidates who need more disciplined error review"],
    related: [
      { href: "/blog/improve-rc-accuracy-cat", title: "Why RC accuracy gets stuck", description: "Diagnose the decision-making problem behind a persistent accuracy plateau." },
      { href: "/blog/accuracy-in-rc-ignoring-context-could-ruin-your-score", title: "Why context controls RC accuracy", description: "See how locally attractive choices fail against the passage as a whole." },
    ],
    faqs: [
      { question: "What do Precision Drills train?", answer: "They focus on careful context reading, evidence-led option comparison and identifying why an RC choice fails." },
      { question: "Are Precision Drills full RC passages?", answer: "They are presented as targeted accuracy practice. Full passages and mocks remain important for applying the skill under complete test conditions." },
      { question: "Why do two RC options often seem correct?", answer: "Both may use relevant language, but one commonly changes scope, certainty, causation or the author’s intended position." },
      { question: "How should I review an incorrect answer?", answer: "Name the exact decision error and locate the textual evidence that should have changed your choice." },
      { question: "Where can I access Precision Drills?", answer: "The drills belong to the separate Auctor RC application. This page is a public explanation and does not recreate product logic." },
    ],
  },
];

export function getFeaturePage(slug: string) {
  return featurePages.find((feature) => feature.slug === slug);
}
