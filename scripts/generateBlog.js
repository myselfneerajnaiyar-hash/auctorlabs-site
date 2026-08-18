// Backward-compatible entry point. Generation is intentionally draft-first.
// Use `npm run blog:sample` for the deterministic sample or the commands in
// scripts/blog-engine.mjs for inventory, audit, discovery and validation.
process.argv[2] ||= "sample";
await import("./blog-engine.mjs");
