export function extractArticleBodyLinks(content) {
  const markdown = [...String(content || "").matchAll(/(^|[^!])\[([^\]]+)\]\(([^)]+)\)/gm)].map(match => ({ anchor: match[2], url: match[3] }));
  const jsx = [...String(content || "").matchAll(/<(?:a|Link)\b[^>]*\bhref=["']([^"']+)["'][^>]*>/g)].map(match => ({ anchor: "", url: match[1] }));
  return [...markdown, ...jsx].filter(link => link.url.startsWith("/"));
}

export function classifyInternalLinks(content, suggestions = [], validUrls = []) {
  const inserted = extractArticleBodyLinks(content), valid = new Set(validUrls);
  const byUrl = new Map();
  for (const suggestion of suggestions) byUrl.set(String(suggestion.url), { ...suggestion, url: String(suggestion.url), state: "SUGGESTED" });
  for (const link of inserted) {
    const path = link.url.split("#")[0], existing = byUrl.get(link.url) || byUrl.get(path);
    byUrl.set(existing?.url || link.url, { ...existing, ...link, state: valid.has(path) ? "VERIFIED" : "BROKEN" });
  }
  return [...byUrl.values()];
}
