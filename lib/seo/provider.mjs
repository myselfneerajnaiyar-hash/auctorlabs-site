import { createHash } from "node:crypto";

export const SEO_CAPABILITIES=["keyword_metrics","serp","trends","related_keywords","backlinks","search_performance"];
export function normalizeSeoRequest(input={}){return{keyword:String(input.keyword||"").trim().replace(/\s+/g," "),country:String(input.country||"IN").toUpperCase(),language:String(input.language||"en").toLowerCase(),device:String(input.device||"desktop").toLowerCase(),searchEngine:String(input.searchEngine||"google").toLowerCase()};}
export function isValidResearchKeyword(raw){if(typeof raw!=="string")return false;const keyword=normalizeSeoRequest({keyword:raw}).keyword;return keyword.length>=3&&keyword.length<=120&&raw.length<=240&&!/[\p{Cc}\p{Cf}\p{Cs},;<>\\{}\[\]|]+/u.test(raw)&&/[\p{L}\p{N}]/u.test(keyword)&&!/(.)\1{19,}/u.test(keyword);}
export function seoRequestFingerprint(provider,capability,input){const request=normalizeSeoRequest(input),canonical=JSON.stringify({provider,capability,...request,keyword:request.keyword.toLocaleLowerCase("en")});return createHash("sha256").update(canonical).digest("hex");}
export function providerSupports(provider,capability){return Array.isArray(provider?.capabilities)&&provider.capabilities.includes(capability);}
export function unavailableProviderResult(provider,capability,reason,request={}){return{provider,capability,status:"UNAVAILABLE",sourceType:"UNAVAILABLE",fetchedAt:null,expiresAt:null,requestMetadata:normalizeSeoRequest(request),costMetadata:{requestCount:0,amount:null,currency:null},error:{code:"UNSUPPORTED_CAPABILITY",message:reason},data:null};}
