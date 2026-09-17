import dotenv from "dotenv";
import {createDataForSeoProvider,DATAFORSEO_ENDPOINTS} from "../lib/seo/providers/dataforseo.mjs";
import {createSupabaseSeoStore} from "../lib/seo/store.mjs";
import {refreshProviderEvidence} from "../lib/seo/refresh.mjs";

dotenv.config({path:".env.local",quiet:true});
export const PILOT_KEYWORDS=[
 "reading comprehension for competitive exams",
 "CAT VARC preparation",
 "reading comprehension trap answers",
 "how to improve reading comprehension accuracy",
 "author tone questions",
 "inference questions reading comprehension",
 "para jumbles CAT",
 "para summary CAT",
 "competitive exam English vocabulary",
 "learn vocabulary from context",
 "subject verb agreement competitive exams",
 "sentence placement CAT"
];
function money(value){return value==null?"UNAVAILABLE":`$${Number(value).toFixed(4)}`;}
export async function runPilot({force=false,provider,store}={}){const activeProvider=provider||createDataForSeoProvider(),activeStore=store===undefined?createSupabaseSeoStore():store;if(!activeStore)throw new Error("Supabase evidence storage is not configured.");if(activeStore.verifyKeywordMetricSchema){const schema=await activeStore.verifyKeywordMetricSchema();if(!schema.available)throw new Error(`Keyword metric persistence is unavailable (${schema.error?.code||"unknown"}); apply the SEO migrations before spending provider credits.`);}const results=[];for(const keyword of PILOT_KEYWORDS){const result=await refreshProviderEvidence({provider:activeProvider,capability:"keyword_metrics",request:{keyword,country:"IN",language:"en",device:"desktop"},store:activeStore,force});results.push({keyword,status:result.status,freshness:result.freshness||result.status,volume:result.data?.searchVolume??result.historicalSnapshot?.data?.searchVolume??null,cpc:result.data?.cpc??result.historicalSnapshot?.data?.cpc??null,competition:result.data?.competitionIndex??result.data?.competition??result.historicalSnapshot?.data?.competitionIndex??null,keywordDifficulty:result.data?.keywordDifficulty??result.historicalSnapshot?.data?.keywordDifficulty??null,cost:result.costMetadata?.amount??null,error:result.error?.code||null});}return results;}
const isCli=process.argv[1]&&new URL(`file:///${process.argv[1].replaceAll("\\","/")}`).href===import.meta.url;
if(isCli){if(!process.env.DATAFORSEO_LOGIN||!process.env.DATAFORSEO_PASSWORD){console.error("Provider implementation complete; live activation blocked only by missing DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD credentials.");process.exitCode=2;}else if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY){console.error("Pilot blocked: Supabase server configuration is required so paid provider results are persisted.");process.exitCode=2;}else{const force=process.argv.includes("--force"),results=await runPilot({force});console.table(results.map(item=>({keyword:item.keyword,volume:item.volume??"UNAVAILABLE",CPC:item.cpc??"UNAVAILABLE",competition:item.competition??"UNAVAILABLE",KD:item.keywordDifficulty??"UNAVAILABLE",status:item.status,cache:item.freshness,cost:money(item.cost),error:item.error||""})));const total=results.reduce((sum,item)=>sum+Number(item.cost||0),0);console.log(JSON.stringify({keywords:results.length,endpoints:DATAFORSEO_ENDPOINTS,totalProviderCost:total||null,currency:"USD",force},null,2));if(results.some(item=>item.status==="FAILED"))process.exitCode=1;}}
