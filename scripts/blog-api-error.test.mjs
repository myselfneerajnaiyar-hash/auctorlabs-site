import assert from "node:assert/strict";
import test from "node:test";
import { apiErrorMessage } from "../lib/blog-api-error.mjs";

test("HTTP 429 structured quota error keeps the existing useful explanation",()=>{
  assert.equal(apiErrorMessage({error:{code:"QUOTA_EXCEEDED",message:"Daily keyword research limit reached. Try again tomorrow."}},429),"Daily keyword research limit reached. Try again tomorrow.");
});
test("string errors and safe message shapes continue to work",()=>{
  for(const body of [{error:"Select a valid audience."},{error:{message:"Select a valid audience."}},{message:"Select a valid audience."}])assert.equal(apiErrorMessage(body,400),"Select a valid audience.");
});
test("missing and malformed messages use safe status-aware fallbacks",()=>{
  for(const body of [null,{},[],{error:{}},{error:{message:{nested:"bad"}}},{error:{details:"private debug data"}}])assert.equal(apiErrorMessage(body,429),"Too many requests. Please try again later.");
  assert.match(apiErrorMessage({},401),/sign in/);assert.match(apiErrorMessage({},503),/could not complete/);
});
test("only the safe message is read; details, stack and credentials are never serialized",()=>{
  const body={error:{message:"Please try again later.",details:{password:"private-password"},stack:"private stack",credentials:"private-credential"}};
  assert.equal(apiErrorMessage(body,500),"Please try again later.");
  for(const message of ["API key: sk-fake-test-secret", "Authorization: Bearer private-token", "password=private-password", "Error at handler (route.ts:12)","Supabase authentication failed", "DataForSEO returned HTTP 401.", "token=private-token", "https://provider.test?token=private", "Traceback: internal failure", "eyJfake.payload.signature", "relation blog_jobs does not exist", "internal\nstack", "x".repeat(301)]){
    assert.equal(apiErrorMessage({error:{message}},500),"The request could not complete. Please try again.");
  }
  assert.equal(apiErrorMessage({error:{code:"INVALID_CREDENTIALS",message:"Private provider account detail"}},500),"The request could not complete. Please try again.");
  assert.equal(apiErrorMessage({error:{code:{toString:"not callable"}}},500),"The request could not complete. Please try again.");
});
