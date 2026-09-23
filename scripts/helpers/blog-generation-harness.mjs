import {registerHooks} from 'node:module';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
export const jobFixture={job:null,writes:[],requests:[],engineWrites:[],response:null,research:null,budgetMs:null};
globalThis.__generationTest=jobFixture;
const root=new URL('../../',import.meta.url);
// No real provider, credential, persistence or filesystem mutation is used.
registerHooks({
 resolve(specifier,context,next){
  if(context.parentURL?.includes('/node_modules/'))return next(specifier,context);
  if(specifier==='server-only')return{url:'job-test:empty',shortCircuit:true};
  if(context.parentURL?.endsWith('/scripts/blog-engine.mjs')){
   const mocks={openai:'openai',dotenv:'dotenv',fs:'fs','../lib/seo/store.mjs':'store','../lib/seo/refresh.mjs':'research'};
   if(mocks[specifier])return{url:'job-test:'+mocks[specifier],shortCircuit:true};
  }
  if(context.parentURL?.endsWith('/lib/blog-jobs.ts')&&specifier==='./blog-brief-request.mjs')return{url:'job-test:budget',shortCircuit:true};
  if(specifier.startsWith('@/'))specifier=new URL(specifier.slice(2),root).href;
  if(specifier.startsWith('.')||specifier.startsWith('file:'))for(const ext of ['', '.ts','.tsx']){const url=new URL(specifier,context.parentURL).href+ext;if(existsSync(fileURLToPath(url)))return{url,shortCircuit:true};}
  return next(specifier,context);
 },
 load(url,context,next){
  let source;
  if(url==='job-test:empty')source='export {};';
  if(url==='job-test:dotenv')source='export default {config(){process.env.OPENAI_API_KEY="test-only-not-real";}};';
  if(url==='job-test:openai')source='export default class OpenAI {constructor(options){this.responses={create:async(payload,options)=>{globalThis.__generationTest.requests.push({payload,options});return globalThis.__generationTest.response(payload,options);}};}}';
  if(url==='job-test:fs')source='import fs from "node:fs";export default {...fs,mkdirSync(){},writeFileSync(...args){globalThis.__generationTest.engineWrites.push(args)}};';
  if(url==='job-test:store')source='export function createSupabaseSeoStore(){return null}';
  if(url==='job-test:research')source='export async function refreshProviderEvidence(){return{status:"SUCCESS",data:{organic:[],relatedSearches:[],questions:[]},error:null}}';
  if(url==='job-test:budget')source=`import {createGenerationBudget as real} from '${new URL('lib/blog-brief-request.mjs',root)}';export function createGenerationBudget(){return real(globalThis.__generationTest.budgetMs?{timeoutMs:globalThis.__generationTest.budgetMs}:{})}`;
  if(url.endsWith('/lib/blog-engine.ts'))source=`export {generateBlog} from '${new URL('scripts/blog-engine.mjs',root)}';export async function researchTopic(){return globalThis.__generationTest.research()}`;
  if(url.endsWith('/lib/seo/corpus.ts'))source='export async function getSeoCorpus(){return []}';
  if(url.endsWith('/lib/blog-cms-db.ts'))source=`const f=globalThis.__generationTest;
   export async function claimCmsJob(){f.job.status='processing';return structuredClone(f.job)}
   export async function getCmsJob(){return structuredClone(f.job)}
   export async function updateCmsJob(id,patch){f.writes.push(structuredClone(patch));Object.assign(f.job,patch);return structuredClone(f.job)}
   export async function heartbeatCmsJob(id,patch){return updateCmsJob(id,patch)}
   export async function createCmsJob(){throw Error('Unexpected job creation')}
   export async function uploadBlogAsset(){throw Error('Unexpected upload')}
   export async function updateBlogAssetMetadata(){throw Error('Unexpected image update')}
   export async function upsertCmsArticle(){throw Error('Unexpected draft persistence')}`;
  if(source!==undefined)return{source,format:'module',shortCircuit:true};
  if(/\.tsx?$/.test(url)&&url.startsWith(root.href))return{source:ts.transpileModule(readFileSync(new URL(url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText,format:'module',shortCircuit:true};
  return next(url,context);
 }
});
