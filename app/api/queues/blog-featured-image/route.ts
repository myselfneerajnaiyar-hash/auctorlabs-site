import { handleCallback } from "@vercel/queue";
import { processCmsFeaturedImageJob } from "@/lib/blog-cms-images";

export const runtime = "nodejs";
export const maxDuration = 800;

export const POST = handleCallback(async (message: unknown, metadata) => {
  const jobId = message && typeof message === "object" && "jobId" in message
    ? String((message as { jobId: unknown }).jobId || "")
    : "";
  if (!jobId) {
    console.error("Ignoring malformed featured image queue message", { messageId: metadata.messageId });
    return;
  }
  await processCmsFeaturedImageJob(jobId);
}, {
  visibilityTimeoutSeconds: 300,
  retry: (_error, metadata) => ({ afterSeconds: Math.min(300, Math.max(30, metadata.deliveryCount * 30)) }),
});
