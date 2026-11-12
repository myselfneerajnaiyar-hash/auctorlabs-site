const MARKDOWN_BLOCK = /^(?:#{1,6}\s|[-*+]\s|\d+[.)]\s|>\s|```|\|)/;
const LIKELY_HEADING = /^(?:(?:\d+[.)])\s+)?[A-Z][^.!?]{1,88}$/;

function isHeading(line) {
  const value = line.trim();
  if (!value || value.length > 90 || MARKDOWN_BLOCK.test(value) || /[.!?]$/.test(value)) return false;
  return /^[A-Z0-9][A-Z0-9\s:—–,&'’()-]+$/.test(value) || LIKELY_HEADING.test(value);
}

export function formatManualArticle(input) {
  const lines = String(input || "").replace(/\r\n?/g, "\n").split("\n").map(line => line.trimEnd());
  const output = [];
  let inCode = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith("```")) inCode = !inCode;
    if (!line) {
      if (output.length && output[output.length - 1] !== "") output.push("");
      continue;
    }
    if (!inCode && !line.startsWith("#") && isHeading(line)) {
      if (output.length && output[output.length - 1] !== "") output.push("");
      output.push(`## ${line.replace(/^(\d+[.)])\s+/, "")}`);
      output.push("");
      continue;
    }
    output.push(line);
    const next = lines[index + 1]?.trim() || "";
    if (!inCode && next && !MARKDOWN_BLOCK.test(line) && !MARKDOWN_BLOCK.test(next) && output[output.length - 1] !== "") output.push("");
    if (!inCode && next && MARKDOWN_BLOCK.test(line) && !/^[-*+]\s|\d+[.)]\s/.test(line) && output[output.length - 1] !== "") output.push("");
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function insertManualImageAt(content, markdown, requestedPosition) {
  const source = String(content || "");
  let position = Math.max(0, Math.min(source.length, Number.isFinite(requestedPosition) ? requestedPosition : source.length));
  const protectedMarkdown = /!\[[^\]]*\]\([^\n)]*\)|\[[^\]]+\]\([^\n)]*\)|`[^`\n]+`|\{\/\*[^*]*\*\/\}|<!--[\s\S]*?-->/g;
  for (const match of source.matchAll(protectedMarkdown)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    if (position > start && position < end) {
      position = end;
      break;
    }
  }
  const before = source.slice(0, position).trimEnd();
  const after = source.slice(position).trimStart();
  return [before, markdown, after].filter(Boolean).join("\n\n");
}
