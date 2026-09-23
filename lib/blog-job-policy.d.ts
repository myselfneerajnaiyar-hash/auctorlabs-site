export function classifyGenerationFailure(error:unknown):"permanent"|"transient"|"timeout";
export function canRetryGenerationJob(job:Record<string,unknown>|null):boolean;
