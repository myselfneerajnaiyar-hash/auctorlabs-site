export function lifecycleTarget(status, action) {
  const transitions = { published:{unpublish:"unpublished"}, unpublished:{edit:"draft",archive:"archived"}, draft:{archive:"archived"}, archived:{restore:"draft"} };
  return transitions[status]?.[action] || null;
}
