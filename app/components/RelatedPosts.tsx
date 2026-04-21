export default function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  
  const allPosts = [
    {
      slug: "focusing-on-words-blinds-you-to-the-real-meaning",
      title: "Focusing on Words Blinds You to the Real Meaning",
    },
    {
      slug: "mastering-rc-youre-just-one-misread-away-from-failure",
      title: "You're Just One Misread Away from Failure",
    },
    {
      slug: "your-comfort-with-tone-masks-a-deeper-misunderstanding-in-rc",
      title: "Tone Comfort is Misleading",
    },
    {
      slug: "your-comprehension-is-strong-yet-your-inferences-are-weak",
      title: "Strong Comprehension, Weak Inference",
    },
    {
      slug: "mastering-cat-reading-comprehension-unveiling-strategies-and-insights-behind-sample-questions-and-answers",
      title: "RC Strategies with Sample Questions",
    },
    {
      slug: "mastering-cat-verbal-ability-secrets-to-conquering-reading-comprehension-challenges",
      title: "Verbal Ability + RC Secrets",
    },
    {
      slug: "mastering-inference-questions-in-cat-unlocking-the-secrets-to-critical-thinking-success",
      title: "Mastering Inference Questions",
    },
    {
      slug: "mastering-reading-comprehension-for-cat-unlocking-the-secrets-to-high-scores",
      title: "RC for High Scores",
    },
    {
      slug: "mastering-reading-comprehension-insider-strategies-to-elevate-your-cat-prep",
      title: "Insider RC Strategies",
    },
    {
      slug: "mastering-reading-comprehension-unlocking-strategies-to-elevate-your-cat-preparation",
      title: "RC Strategy Guide",
    },
    {
      slug: "mastering-reading-comprehension-unlocking-the-secrets-to-higher-accuracy-in-cat",
      title: "RC Accuracy Secrets",
    },
    {
      slug: "mastering-verbal-ability-and-reading-comprehension-for-cat-strategies-to-unlock-your-full-potential",
      title: "VA + RC Full Potential",
    },
    {
      slug: "unlocking-precision-mastering-reading-comprehension-accuracy-for-cat-success",
      title: "Precision in RC",
    },
    {
      slug: "unlocking-success-common-rc-mistakes-cat-aspirants-make-and-how-to-overcome-them",
      title: "Common RC Mistakes",
    },
    {
      slug: "unlocking-success-how-daily-reading-comprehension-transforms-your-cat-preparation",
      title: "Daily RC Transformation",
    },
    {
      slug: "unlocking-success-mastering-reading-comprehension-for-cat-with-proven-strategies",
      title: "Proven RC Strategies",
    },
    {
      slug: "unlocking-success-top-common-rc-mistakes-cat-aspirants-must-avoid",
      title: "Top RC Mistakes",
    },
    {
      slug: "rc-inference-decision-trap",
      title: "RC Inference Decision Trap",
    },
    {
      slug: "rc-tone-hidden-skill",
      title: "RC Tone Hidden Skill",
    },
  ];

  const related = allPosts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, 3);

  return (
    <div className="mt-20">
      <h3 className="text-2xl font-bold mb-6">Related Articles</h3>

      <div className="grid gap-4">
        {related.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-5 border border-white/10 rounded-xl hover:bg-white/5 transition"
          >
            {post.title}
          </a>
        ))}
      </div>
    </div>
  );
}