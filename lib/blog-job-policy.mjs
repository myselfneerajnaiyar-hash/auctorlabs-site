export function classifyGenerationFailure(error){const message=error instanceof Error?error.message:String(error);return /invalid|not configured|required|refusing|quality gate/i.test(message)?"permanent":"transient";}
export function canRetryGenerationJob(job){return job?.status==="failed"&&["transient","timeout"].includes(job.failure_kind)&&Number(job.attempt_count)<Number(job.max_attempts);}
