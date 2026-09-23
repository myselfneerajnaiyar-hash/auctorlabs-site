// Leave 40 seconds of the 800-second route allowance for failure persistence.
export const GENERATION_WORK_MS = 760_000;
export const BRIEF_ATTEMPT_MS = 90_000;
export const BRIEF_TOTAL_MS = 180_000;
export const DOWNSTREAM_RESERVE_MS = 480_000;

export function generationTimeout(message) {
  return Object.assign(new Error(message), { name: "BlogGenerationTimeout", code: "BLOG_GENERATION_TIMEOUT" });
}

export function createGenerationBudget({ timeoutMs = GENERATION_WORK_MS, now = Date.now } = {}) {
  const controller = new AbortController();
  const deadline = now() + timeoutMs;
  const assertActive = () => {
    if (controller.signal.aborted) throw controller.signal.reason;
    if (now() >= deadline) throw generationTimeout("Blog generation exceeded its execution budget. Retry the job.");
  };
  return {
    deadline, signal: controller.signal, assertActive,
    async run(work) {
      let timer;
      const expired = new Promise((_, reject) => {
        timer = setTimeout(() => {
          const error = generationTimeout("Blog generation exceeded its execution budget. Retry the job.");
          controller.abort(error);
          reject(error);
        }, Math.max(1, deadline - now()));
      });
      try { return await Promise.race([Promise.resolve().then(work), expired]); }
      finally { clearTimeout(timer); }
    },
  };
}

// Keep all normalized sources and editorial information; omit the duplicate
// raw provider payload, request/cost metadata, and storage identifiers.
export function compactBriefResearch(research) {
  return {
    query: research.query, verified: research.verified,
    results: research.results, relatedSearches: research.relatedSearches,
    questions: research.questions,
  };
}

export async function requestContentBrief(request, {
  deadline = Date.now() + GENERATION_WORK_MS, signal,
  timeoutMs = BRIEF_ATTEMPT_MS, now = Date.now,
} = {}) {
  const attemptMs = Math.min(BRIEF_ATTEMPT_MS, Math.max(1, Number(timeoutMs) || BRIEF_ATTEMPT_MS));
  const end = Math.min(now() + BRIEF_TOTAL_MS, deadline - DOWNSTREAM_RESERVE_MS);
  for (let attempt = 1; attempt <= 2; attempt++) {
    if (signal?.aborted) throw signal.reason;
    const available = Math.min(attemptMs, end - now());
    if (available <= 0) throw generationTimeout("Content brief could not finish within its reserved time budget. Retry the job.");
    const controller = new AbortController();
    let timer, abort;
    const stopped = new Promise((_, reject) => {
      abort = () => { controller.abort(signal.reason); reject(signal.reason); };
      signal?.addEventListener("abort", abort, { once: true });
      timer = setTimeout(() => {
        const error = generationTimeout("Content brief request timed out.");
        controller.abort(error); reject(error);
      }, available);
    });
    try {
      return await Promise.race([
        Promise.resolve().then(() => request({ timeout: available, maxRetries: 0, signal: controller.signal })),
        stopped,
      ]);
    } catch (error) {
      if (signal?.aborted) throw signal.reason;
      const timedOut = error?.code === "BLOG_GENERATION_TIMEOUT" || error?.name === "APIConnectionTimeoutError" || /request timed out/i.test(error?.message || "");
      if (!timedOut) throw error;
      if (attempt === 2 || now() >= end) throw generationTimeout(`Content brief generation timed out after ${attempt} bounded attempt${attempt === 1 ? "" : "s"}. No article or images were generated. Retry the job.`);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    }
  }
}
