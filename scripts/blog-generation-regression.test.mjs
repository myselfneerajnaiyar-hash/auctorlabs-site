import assert from 'node:assert/strict';
import test,{beforeEach} from 'node:test';
import {readFileSync} from 'node:fs';
import {jobFixture as f} from './helpers/blog-generation-harness.mjs';
const {runBlogJob}=await import('../lib/blog-jobs.ts');
const job={id:'test-job',topic:'CAT RC practice',audience:'CAT'},admin={id:'test-admin'};
beforeEach(()=>{f.job={...job,status:'pending',stages:{researching:'pending',brief:'pending',writing:'pending',imagePlanning:'pending',featuredImage:'pending'}};f.writes=[];f.requests=[];f.engineWrites=[];f.budgetMs=null;f.research=async()=>({snapshotIds:[],briefContext:{}});});
test('real job and engine persist a brief timeout, stop before writing/images and allow a bounded job retry',async()=>{
 f.response=async()=>{throw Object.assign(Error('Request timed out.'),{name:'APIConnectionTimeoutError'});};
 await runBlogJob(admin,job);
 assert.equal(f.requests.length,2);assert.ok(f.requests.every(r=>r.payload.text.format.name==='content_brief'&&r.options.maxRetries===0));
 assert.equal(f.job.status,'failed');assert.equal(f.job.failure_kind,'timeout');assert.equal(f.job.stages.brief,'failed');assert.equal(f.job.stages.researching,'complete');
 assert.equal(f.job.stages.writing,'pending');assert.equal(f.job.stages.imagePlanning,'pending');assert.equal(f.job.lease_expires_at,null);assert.ok(f.job.completed_at);
 assert.match(f.job.error,/brief: Content brief generation timed out after 2 bounded attempts/);
});
test('successful real brief advances to writing with schema and image configuration unchanged',async()=>{
 const file=JSON.parse(readFileSync(new URL('../content/briefs/cat-varc-passages.json',import.meta.url),'utf8'));const brief={...(file.brief||file),titleCandidates:[{title:'Reading CAT passages with a clear purpose in mind',total:70}]};
 f.response=async payload=>{if(payload.text.format.name==='content_brief')return{output_text:JSON.stringify(brief)};throw Error('Test stopped on reaching writing');};
 await runBlogJob(admin,job);
 assert.deepEqual(f.requests.map(r=>r.payload.text.format.name),['content_brief','editorial_article']);
 assert.equal(f.job.stages.brief,'complete');assert.equal(f.job.stages.writing,'failed');assert.equal(f.requests[1].options,undefined,'only the brief gets the new request policy');
 const input=JSON.parse(f.requests[0].payload.input);assert.equal(input.serpResearch.evidence,undefined);assert.ok(Array.isArray(input.serpResearch.results));
 assert.equal(f.requests[0].payload.text.format.schema.properties.titleCandidates.minItems,3);assert.ok(f.requests[0].payload.text.format.schema.required.includes('imageConcept'));
 assert.equal(f.job.stages.featuredImage,'pending');
});
test('a hung job persists failure before its deadline and late research cannot revive it',async()=>{
 f.budgetMs=10;let release;f.research=()=>new Promise(resolve=>{release=resolve});f.response=()=>{throw Error('OpenAI must not be reached')};
 await runBlogJob(admin,job);assert.equal(f.job.status,'failed');assert.equal(f.job.failure_kind,'timeout');assert.match(f.job.error,/researching:.*execution budget/);
 const writes=f.writes.length;release({snapshotIds:[],briefContext:{}});await new Promise(resolve=>setTimeout(resolve,10));
 assert.equal(f.writes.length,writes);assert.equal(f.requests.length,0);assert.equal(f.job.lease_expires_at,null);
});
