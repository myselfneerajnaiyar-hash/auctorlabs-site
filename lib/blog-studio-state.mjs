export function publishControlState(data, busy = false) {
  const blockers = Array.isArray(data?.technicalBlockers) ? data.technicalBlockers.filter(Boolean) : null;
  const eligible = data?.publishEligible === true && (!blockers || blockers.length === 0);
  return {
    enabled: !busy && eligible,
    blockers: blockers?.length ? blockers : eligible ? [] : data?.publishEligibilityReasons?.length ? data.publishEligibilityReasons : ["Publish readiness has not been verified yet. Reopen the draft to recheck."],
  };
}

export function scrollReviewIntoView(element) {
  if (!element || typeof element.scrollIntoView !== "function") return false;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

// Only these fields can be edited locally in the current Studio UI. Server
// audit/asset metadata must not make a freshly loaded draft appear unsaved.
export function draftEditSignature(draft) {
  return draft ? JSON.stringify([draft.slug, draft.content, draft.data.title || "", draft.data.description || "", draft.data.primaryKeyword || ""]) : "";
}

// A user can continue typing while a save is in flight. Keep those newer local
// edits while adopting the saved response's version and validation results.
export function retainEditsDuringSave(current, submitted, saved) {
  if (!current || current.slug !== submitted.slug) return current;
  const data = { ...saved.data };
  for (const field of ["title", "description", "primaryKeyword"]) {
    if (current.data[field] !== submitted.data[field]) data[field] = current.data[field];
  }
  return { ...saved, data, content: current.content !== submitted.content ? current.content : saved.content };
}
