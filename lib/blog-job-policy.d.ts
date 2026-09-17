export function classifyGenerationFailure(error:unknown):"permanent"|"transient";
export function canRetryGenerationJob(job:Record<string,unknown>|null):boolean;
