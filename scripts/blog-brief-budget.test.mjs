import assert from "node:assert/strict";
import test from "node:test";
import { compactBriefResearch, createGenerationBudget, requestContentBrief, BRIEF_ATTEMPT_MS, BRIEF_TOTAL_MS, GENERATION_WORK_MS, DOWNSTREAM_RESERVE_MS } from "../lib/blog-brief-request.mjs";

test("brief input removes duplicate provider payload while retaining every source and question", () => {
  const results=[{title:"CAT RC",url:"https://example.test/research",snippet:"Useful evidence",sourceType:"organic"}];
  const research={query:"CAT RC practice",verified:true,results,questions:["How to infer?"],relatedSearches:["RC accuracy"],evidence:{data:{organic:results},requestMetadata:{keyword:"CAT RC practice"},snapshotIds:["private-storage-id"]}};
  const compact=compactBriefResearch(research);
  assert.deepEqual(compact.results,results);assert.deepEqual(compact.questions,research.questions);
  assert.deepEqual(compact.relatedSearches,research.relatedSearches);assert.equal(compact.verified,true);
  assert.ok(JSON.stringify(compact).length<JSON.stringify(research).length);
  assert.equal(compact.evidence,undefined);
});

test("successful brief returns in one attempt and keeps the stage within job and lease budgets", async () => {
  let calls=0;
  const result=await requestContentBrief(async options=>{calls++;assert.equal(options.timeout,90_000);assert.equal(options.maxRetries,0);return {output_text:'{"title":"Useful brief"}'};});
  assert.match(result.output_text,/Useful brief/);assert.equal(calls,1);
  assert.ok(BRIEF_TOTAL_MS<300_000);assert.equal(BRIEF_ATTEMPT_MS*2,BRIEF_TOTAL_MS);
  assert.ok(BRIEF_TOTAL_MS+DOWNSTREAM_RESERVE_MS<GENERATION_WORK_MS);assert.ok(GENERATION_WORK_MS<800_000);
});

test("one timeout is retried once, with an independently cancellable request", async () => {
  const signals=[];
  const result=await requestContentBrief(async options=>{signals.push(options.signal);if(signals.length===1)throw Object.assign(new Error("Request timed out."),{name:"APIConnectionTimeoutError"});return "brief";});
  assert.equal(result,"brief");assert.equal(signals.length,2);assert.notEqual(signals[0],signals[1]);
});

test("a hung brief aborts both attempts and returns a useful bounded failure", async () => {
  const signals=[];
  await assert.rejects(requestContentBrief(options=>{signals.push(options.signal);return new Promise(()=>{});},{timeoutMs:5}),/Content brief generation timed out after 2 bounded attempts/);
  assert.equal(signals.length,2);assert.ok(signals.every(signal=>signal.aborted));
});

test("non-timeout failures are not retried", async () => {
  let calls=0;
  await assert.rejects(requestContentBrief(async()=>{calls++;throw Error("Invalid brief schema");}),/Invalid brief schema/);
  assert.equal(calls,1);
});

test("brief retry respects remaining budget and preserves downstream reserve", async () => {
  let time=0,calls=0;
  await assert.rejects(requestContentBrief(async options=>{calls++;assert.equal(options.timeout,100);time=101;throw new Error("Request timed out.");},{now:()=>time,deadline:DOWNSTREAM_RESERVE_MS+100}),/timed out after 1 bounded attempt/);
  assert.equal(calls,1);
  await assert.rejects(requestContentBrief(async()=>{calls++;},{now:()=>101,deadline:DOWNSTREAM_RESERVE_MS+100}),/reserved time budget/);
  assert.equal(calls,1);
});

test("job deadline aborts an in-flight brief without retrying or continuing work", async () => {
  const budget=createGenerationBudget({timeoutMs:10});let calls=0;
  await assert.rejects(budget.run(()=>requestContentBrief(()=>{calls++;return new Promise(()=>{});},{signal:budget.signal})),/execution budget/);
  assert.equal(calls,1);assert.equal(budget.signal.aborted,true);assert.throws(budget.assertActive,/execution budget/);
});
