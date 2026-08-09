import Link from "next/link";
import Image from "next/image";

const HOME_URL = "https://auctorlabs.in";
const SIGNUP_URL = "https://rc.auctorlabs.in/login";

type Theme = "accuracy" | "inference" | "tone" | "speed" | "strategy";

const relatedByTheme: Record<Theme, { slug: string; title: string; anchor: string }> = {
  accuracy: {
    slug: "improve-rc-accuracy-cat",
    title: "Why You're Stuck at 60% Accuracy in RC",
    anchor: "diagnosing the decisions behind low RC accuracy",
  },
  inference: {
    slug: "rc-inference-decision-trap",
    title: "Why Inference Questions Feel So Unfair",
    anchor: "the inference decision trap",
  },
  tone: {
    slug: "rc-tone-hidden-skill",
    title: "Tone in RC Is Not About Words — It's About Intent",
    anchor: "reading an author's intent instead of isolated words",
  },
  speed: {
    slug: "unlocking-success-how-daily-reading-comprehension-transforms-your-cat-preparation",
    title: "How Daily Reading Comprehension Transforms CAT Preparation",
    anchor: "building a sustainable daily RC habit",
  },
  strategy: {
    slug: "unlocking-success-mastering-reading-comprehension-for-cat-with-proven-strategies",
    title: "Mastering Reading Comprehension for CAT with Proven Strategies",
    anchor: "a broader CAT reading comprehension strategy",
  },
};

function getTheme(slug: string): Theme {
  if (slug.includes("tone") || slug.includes("words-blinds")) return "tone";
  if (slug.includes("inference") || slug.includes("implication") || slug.includes("insight")) return "inference";
  if (slug.includes("accuracy") || slug.includes("mistake") || slug.includes("elimination")) return "accuracy";
  if (slug.includes("daily") || slug.includes("speed") || slug.includes("verbal-ability")) return "speed";
  return "strategy";
}

const practiceCopy: Record<Theme, { skill: string; action: string; signupAnchor: string }> = {
  accuracy: {
    skill: "accuracy comes from reviewing why each option is supported, distorted, or outside the passage",
    action: "After every set, record the evidence you missed and the trap you accepted; patterns become visible only when the review is as deliberate as the attempt.",
    signupAnchor: "practise RC accuracy with guided review",
  },
  inference: {
    skill: "inference improves when you separate what the passage permits from what merely sounds plausible",
    action: "For each inference question, write the smallest claim the text supports before looking at the options, then compare every choice against that boundary.",
    signupAnchor: "train inference through regular CAT RC practice",
  },
  tone: {
    skill: "tone becomes clearer when you track the author's purpose, qualification, and attitude across the whole passage",
    action: "After reading, describe the author's intent in one precise sentence and identify the words or contrasts that justify it.",
    signupAnchor: "practise tone and reading comprehension",
  },
  speed: {
    skill: "useful reading speed grows from cleaner decisions, not from rushing through sentences",
    action: "Use short, timed sets and review where attention drifted, which transitions you missed, and which rereads were actually necessary.",
    signupAnchor: "build a consistent daily RC practice routine",
  },
  strategy: {
    skill: "strong CAT VARC preparation connects careful reading, evidence-led elimination, and honest review",
    action: "Practise in small sets, name the exact reason behind every option you reject, and revisit errors after a gap so that the lesson survives beyond one passage.",
    signupAnchor: "put this CAT RC strategy into practice",
  },
};

export default function BlogPracticeCTA({ slug }: { slug: string }) {
  const theme = getTheme(slug);
  const copy = practiceCopy[theme];
  let related = relatedByTheme[theme];

  // Never recommend the article the reader is already viewing.
  if (related.slug === slug) {
    related = relatedByTheme.inference;
  }

  return (
    <section aria-labelledby="practice-this-skill" className="my-14">
      <h2
        id="practice-this-skill"
        className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
      >
        A practical way to build this skill
      </h2>
      <p className="text-gray-300 leading-8 mb-6 text-[17px]">
        In practice, {copy.skill}. {copy.action} The learning systems at{" "}
        <Link href={HOME_URL} className="text-orange-400 underline decoration-orange-400/40 underline-offset-4 hover:text-orange-300">
          Auctor Labs
        </Link>{" "}
        are designed around this kind of deliberate skill-building. If you want a focused next step, you can{" "}
        <Link href={SIGNUP_URL} className="text-orange-400 underline decoration-orange-400/40 underline-offset-4 hover:text-orange-300">
          {copy.signupAnchor}
        </Link>{" "}
        and use the feedback to guide the next session. For a complementary perspective, read about{" "}
        <Link
          href={`/blog/${related.slug}`}
          title={related.title}
          className="text-orange-400 underline decoration-orange-400/40 underline-offset-4 hover:text-orange-300"
        >
          {related.anchor}
        </Link>.
      </p>

      <Link
        href={SIGNUP_URL}
        aria-label="Start practising CAT reading comprehension with Auctor RC"
        className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#090e22] shadow-2xl shadow-indigo-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B0F1A]"
      >
        <Image
          src="/blog/auctor-rc-practice-smarter-banner.png"
          alt="Practice smarter for CAT VARC with daily RC, an AI mentor, and performance analytics on Auctor RC"
          width={2048}
          height={683}
          sizes="(max-width: 1024px) 100vw, 800px"
          className="m-0 h-auto w-full rounded-none border-0 shadow-none transition duration-300 group-hover:scale-[1.01]"
          loading="lazy"
        />
        <span className="sr-only">Start practising with Auctor RC</span>
      </Link>
    </section>
  );
}
