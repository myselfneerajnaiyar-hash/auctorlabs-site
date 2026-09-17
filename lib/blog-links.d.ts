export type InternalLinkState = "SUGGESTED" | "INSERTED" | "VERIFIED" | "BROKEN" | "REMOVED";
export type InternalLinkRecord = { url: string; anchor?: string; reason?: string; state: InternalLinkState };
export function extractArticleBodyLinks(content: unknown): Array<{ url: string; anchor: string }>;
export function classifyInternalLinks(content: unknown, suggestions?: unknown[], validUrls?: string[]): InternalLinkRecord[];
