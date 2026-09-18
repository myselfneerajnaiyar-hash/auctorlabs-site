export function articleSections(content?:string):{heading:string;start:number;end:number;content:string}[];
export function buildBirbalContext(input:{article:Record<string,any>;assets?:Record<string,any>[];links?:Record<string,any>[];performance?:Record<string,any>[]}):Record<string,any>;
export function applyBirbalOperations(article:{title:string;description:string;content:string},operations:Record<string,any>[]):{title:string;description:string;content:string;applied:string[]};
export function birbalNeedsConfirmation(operations?:Record<string,any>[]):boolean;
