export function conceptKey(image: any): string;
export function sameConcept(a: any, b: any): boolean;
export function distinctConcepts(images: any[]): any[];
export function directedImage<T>(image: T, direction: string, role?: "human" | "supporting_visual"): T;
