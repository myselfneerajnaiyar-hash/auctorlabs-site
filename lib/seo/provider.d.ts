export type SeoCapability="keyword_metrics"|"serp"|"trends"|"related_keywords"|"backlinks"|"search_performance";
export type SeoStatus="SUCCESS"|"FAILED"|"UNAVAILABLE"|"CACHED"|"STALE";
export type SeoRequest={keyword:string;country?:string;language?:string;device?:string;searchEngine?:string};
export const SEO_CAPABILITIES:SeoCapability[];
export function normalizeSeoRequest(input?:Partial<SeoRequest>):Required<SeoRequest>;
export function seoRequestFingerprint(provider:string,capability:SeoCapability,input:Partial<SeoRequest>):string;
export function providerSupports(provider:{capabilities:SeoCapability[]},capability:SeoCapability):boolean;
export function unavailableProviderResult(provider:string,capability:SeoCapability,reason:string,request?:Partial<SeoRequest>):Record<string,unknown>;
