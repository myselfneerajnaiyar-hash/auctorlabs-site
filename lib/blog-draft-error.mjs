export function blogDraftErrorMessage(error) {
  if (typeof error === "string" && error.trim()) return error.trim();
  if (error && typeof error === "object") {
    if (typeof error.message === "string" && error.message.trim()) return error.message.trim();
    if (typeof error.error === "string" && error.error.trim()) return error.error.trim();
  }
  return "Draft save failed. Please retry.";
}

export function blogDraftErrorStatus(message) {
  return /changed in another session|version conflict/i.test(message) ? 409 : 400;
}
