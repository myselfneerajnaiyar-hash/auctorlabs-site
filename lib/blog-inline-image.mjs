const MARKDOWN_IMAGE = /!\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\)/g;

export function inlineImageMarkdownBlock({ id, alt, src }) {
  return `{/* inline-image:${id} */}\n\n![${alt}](${src})`;
}

export function contentReferencesInlineImage(content, image) {
  if (!image?.src) return false;
  const references = [...String(content || "").matchAll(MARKDOWN_IMAGE)];
  return references.some((match) => {
    const destination = match[1].startsWith("<") && match[1].endsWith(">")
      ? match[1].slice(1, -1)
      : match[1];
    return destination === image.src;
  });
}
