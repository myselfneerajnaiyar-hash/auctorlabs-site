const clean = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function conceptKey(image) {
  return clean(image.visualConceptId || image.conceptDescription || image.scene || image.prompt || image.id);
}
export function sameConcept(a, b) {
  if (conceptKey(a) === conceptKey(b)) return true;
  const words = image => new Set(clean(image.conceptDescription || image.scene || image.prompt).split(" ").filter(word => word.length > 3));
  const left = words(a), right = words(b);
  return left.size > 0 && right.size > 0 && [...left].filter(word => right.has(word)).length / Math.max(left.size, right.size) >= .8;
}
export function distinctConcepts(images) {
  return images.reduce((unique, image) => unique.some(other => sameConcept(image, other)) ? unique : [...unique, image], []);
}
export function directedImage(image, direction, role) {
  const text = String(direction || "").trim();
  if (!text) return image;
  const requestedRole = role || (/\b(diagram|flowchart|infographic|chart|conceptual illustration|comparison diagram)\b/i.test(text) ? "supporting_visual" : /\b(human|person|people|student|learner|portrait|photograph)\b/i.test(text) ? "human" : image.role || "human");
  return {...image, role: requestedRole, visualConceptId: clean(text).replaceAll(" ", "-"), conceptDescription: text, purpose: text, alt: text.replace(/[\[\]\r\n]/g," ").slice(0,500),
    prompt: `Create a relevant ${requestedRole === "human" ? "human-centered editorial image with a visible person" : "supporting visual; diagrams, comparisons and illustrations are welcome"} for this article section: ${image.sectionHeading || image.placement}. Editor's visual direction: ${text}. Preserve this direction and article relevance. Use a clear coherent composition. Reject unsafe, unrelated or severely defective treatments.`, source: "ai"};
}
