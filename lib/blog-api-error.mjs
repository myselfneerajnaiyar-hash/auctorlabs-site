const publicErrors = {
  QUOTA_EXCEEDED: "Daily keyword research limit reached. Try again tomorrow.",
  RATE_LIMITED: "Too many requests. Please try again later.",
};
const fallback = status => status === 429 ? "Too many requests. Please try again later."
  : status === 401 ? "Your session has expired. Please sign in again."
  : status === 403 ? "You do not have permission to perform this action."
  : status >= 500 ? "The request could not complete. Please try again."
  : "Request failed. Please try again.";

export function apiErrorMessage(body, status) {
  if (!body || typeof body !== "object") return fallback(status);
  const error = body.error;
  const code = typeof error === "object" && error !== null ? error.code : body.code;
  if (typeof code === "string" && Object.hasOwn(publicErrors, code)) return publicErrors[code];
  if (typeof code === "string" && /credential|authentication|token|secret|api_key|http_40[13]/i.test(code)) return fallback(status);
  // Read message fields only, never serialize error objects, details or stacks.
  const message = typeof error === "string" ? error
    : error && typeof error.message === "string" ? error.message
    : typeof body.message === "string" ? body.message : "";
  const privateDetails = /(?:\b(?:authorization|bearer|password|credential|secret|api[_ -]?key|access[_ -]?token|refresh[_ -]?token|stack|traceback|exception|TypeError|ReferenceError|SyntaxError|APIConnectionError|sqlstate|supabase|postgres|service[_ -]?role)\b|\bsk-[\w-]+|\beyJ[\w-]+\.[\w-]+|https?:\/\/|[A-Z]:\\|\/(?:var|home|usr|app|node_modules)\/|\bat\s+\S+\s*\(|\.[cm]?[jt]sx?:\d+|\b(?:relation|column)\b.*\bdoes not exist\b)/i;
  const text = message.trim();
  const providerAuthentication = /\b(?:openai|dataforseo|resend)\b.*\b(?:401|403|auth\w*|key)\b|\bHTTP\s*40[13]\b|\btoken\s*[:=]/i;
  return text && text.length <= 300 && !/[\r\n<>{}]/.test(text) && !privateDetails.test(text) && !providerAuthentication.test(text) ? text : fallback(status);
}
