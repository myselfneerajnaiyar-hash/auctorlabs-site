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

