export type ArticleHeading = { level: number; text: string; id: string; baseId: string; occurrence: number };
export function headingSlug(text: unknown): string;
export function headingText(markdown: unknown): string;
export function extractArticleHeadings(content: unknown): ArticleHeading[];
export function validateArticleHeadings(content: unknown): { headings: ArticleHeading[]; issues: string[] };
export function tocHeadings(content: unknown): ArticleHeading[];
