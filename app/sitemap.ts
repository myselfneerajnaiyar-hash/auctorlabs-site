export default function sitemap() {
  const baseUrl = "https://auctorlabs.in";

  const urls = [
    // Static pages
    "",
    "/about",
    "/contact",
    "/pricing",
    "/products",
    "/success",
    "/auctor-rc",

    // Blog main page
    "/blog",

    // Blog posts (all 23)
    "/blog/focusing-on-words-blinds-you-to-the-real-meaning",
    "/blog/mastering-rc-youre-just-one-misread-away-from-failure",
    "/blog/your-comfort-with-tone-masks-a-deeper-misunderstanding-in-rc",
    "/blog/your-comprehension-is-strong-yet-your-inferences-are-weak",
    "/blog/mastering-cat-reading-comprehension-unveiling-strategies-and-insights-behind-sample-questions-and-answers",
    "/blog/mastering-cat-verbal-ability-secrets-to-conquering-reading-comprehension-challenges",
    "/blog/mastering-inference-questions-in-cat-unlocking-the-secrets-to-critical-thinking-success",
    "/blog/mastering-reading-comprehension-for-cat-unlocking-the-secrets-to-high-scores",
    "/blog/mastering-reading-comprehension-insider-strategies-to-elevate-your-cat-prep",
    "/blog/mastering-reading-comprehension-unlocking-strategies-to-elevate-your-cat-preparation",
    "/blog/mastering-reading-comprehension-unlocking-the-secrets-to-higher-accuracy-in-cat",
    "/blog/mastering-verbal-ability-and-reading-comprehension-for-cat-strategies-to-unlock-your-full-potential",
    "/blog/unlocking-precision-mastering-reading-comprehension-accuracy-for-cat-success",
    "/blog/unlocking-success-common-rc-mistakes-cat-aspirants-make-and-how-to-overcome-them",
    "/blog/unlocking-success-how-daily-reading-comprehension-transforms-your-cat-preparation",
    "/blog/unlocking-success-mastering-reading-comprehension-for-cat-with-proven-strategies",
    "/blog/unlocking-success-top-common-rc-mistakes-cat-aspirants-must-avoid",
    "/blog/rc-inference-decision-trap",
    "/blog/rc-tone-hidden-skill",
  ];

  return urls.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
}