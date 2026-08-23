// Backward-compatible entry point for the AI editorial engine.
// Generated content is always written to content/drafts for human review.
process.argv[2] ||= "generate";
await import("./blog-engine.mjs");
