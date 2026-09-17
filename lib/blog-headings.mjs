const PLACEHOLDER_HEADING = /^(?:heading|subheading|section|section heading|title|subtitle|h[2-6]|placeholder)(?:\s+\d+)?$/i;

export function headingSlug(text) {
  return String(text || "").normalize("NFKD").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-") || "section";
}

export function headingText(markdown) {
  return String(markdown || "").replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_~`]/g, "").trim();
}

export function extractArticleHeadings(content) {
  const used = new Map();
  return [...String(content || "").matchAll(/^(#{1,6})[ \t]*(.*?)[ \t]*$/gm)].map((match) => {
    const level = match[1].length, text = headingText(match[2].replace(/[ \t]+#+[ \t]*$/, "")), baseId = headingSlug(text), occurrence = (used.get(baseId) || 0) + 1;
    used.set(baseId, occurrence);
    return { level, text, id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`, baseId, occurrence };
  });
}

export function validateArticleHeadings(content) {
  const headings = extractArticleHeadings(content), issues = [];
  if (headings.some((heading) => !heading.text)) issues.push("Article contains an empty heading.");
  const placeholders = headings.filter((heading) => PLACEHOLDER_HEADING.test(heading.text));
  if (placeholders.length) issues.push(`Article contains placeholder headings: ${[...new Set(placeholders.map(item => item.text || "(empty)"))].join(", ")}.`);
  const duplicates = headings.filter((heading) => heading.occurrence > 1);
  if (duplicates.length) issues.push(`Article contains duplicate headings: ${[...new Set(duplicates.map(item => item.text))].join(", ")}.`);
  if (headings.some((heading) => heading.level === 1)) issues.push("Article body must not contain an H1; the article title is the H1.");
  for (let index = 1; index < headings.length; index += 1) if (headings[index].level > headings[index - 1].level + 1) issues.push(`Invalid heading hierarchy: H${headings[index - 1].level} is followed by H${headings[index].level} (${headings[index].text}).`);
  return { headings, issues };
}

export function tocHeadings(content) { return extractArticleHeadings(content).filter((heading) => heading.level === 2 || heading.level === 3); }
