export type CorpusObservation={id:string|null;slug:string;url:string;title:string;description:string;primaryKeyword:string;secondaryKeywords:string[];searchIntent:string;cluster:string;status:string;headings:string[];internalLinks:string[];wordCount:number;text:string};
export function semanticSimilarity(left:unknown,right:unknown):number;
export function buildCorpusObservations(posts:Record<string,unknown>[]):CorpusObservation[];
export function buildCannibalizationEvidence(target:Record<string,unknown>,corpus:CorpusObservation[]):Record<string,unknown>;
export function buildContentGapEvidence(input?:Record<string,unknown>):Record<string,unknown>;
export function calculateOpportunityScore(input?:Record<string,unknown>):Record<string,unknown>;
