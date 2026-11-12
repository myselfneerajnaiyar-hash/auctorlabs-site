import assert from "node:assert/strict";
import test from "node:test";
import { editorialRequirements } from "../lib/blog-editorial-requirements.mjs";
import { publicationTechnicalBlockers } from "../lib/blog-publish-policy.ts";
import { draftEditSignature, publishControlState, retainEditsDuringSave } from "../lib/blog-studio-state.mjs";

const validUrls=["/blog/related"];
const image=id=>({id,role:"human",status:"generated",src:`https://cdn.test/${id}.png`});
const asset=item=>({id:`asset-${item.id}`,image_key:item.id,asset_type:"inline",status:"generated",public_url:item.src});
function row(images,link="[related guidance](/blog/related)"){
  return{slug:"current",title:"Useful title",description:"Useful description",content:`## Insight\n\nContext ${link}.\n\n${images.map(item=>`{/* inline-image:${item.id} */}\n\n![${item.id}](${item.src})`).join("\n\n")}`,frontmatter:{date:"2026-09-21",author:"Auctor Labs",inlineImages:images}};
}
function serverState(images,link){const draft=row(images,link),assets=images.map(asset),requirements=editorialRequirements(draft,assets,validUrls),technicalBlockers=publicationTechnicalBlockers(draft,assets,{invalidInternalLinks:[],validInternalUrls:validUrls});return{requirements,technicalBlockers,publishEligible:technicalBlockers.length===0};}


test("Publish is enabled when server requirements and blockers pass",()=>{
  const state=serverState([image("one"),image("two")]);
  assert.equal(state.requirements.humanReady,true);
  assert.equal(state.requirements.linksReady,true);
  assert.equal(publishControlState(state).enabled,true);
});

test("Publish remains disabled below two accepted human images",()=>assert.equal(publishControlState(serverState([image("one")])).enabled,false));
test("Publish remains disabled without a valid internal link",()=>assert.equal(publishControlState(serverState([image("one"),image("two")],"")).enabled,false));

test("Supporting visuals are recommended and never become a blocker",()=>{
  const supporting={...image("diagram"),role:"supporting_visual"};
  const state=serverState([image("one"),image("two"),supporting]);
  assert.equal(state.requirements.supportingVisuals,1);
  assert.equal(publishControlState(state).enabled,true);
});


test("frontend publish state uses the exact server-side blocker result",()=>{
  for(const state of [serverState([]),serverState([image("one")]),serverState([image("one"),image("two")]),serverState([image("one"),image("two")],"")]){
    assert.equal(publishControlState(state).enabled,state.technicalBlockers.length===0);
  }
});

test("busy state and unverified eligibility cannot be bypassed by an empty blocker list",()=>{
  const ready=serverState([image("one"),image("two")]);
  assert.equal(publishControlState(ready,true).enabled,false);
  assert.equal(publishControlState({...ready,publishEligible:false}).enabled,false);
  assert.equal(publishControlState({technicalBlockers:[]}).enabled,false);
  assert.match(publishControlState({technicalBlockers:[]}).blockers[0],/not been verified/);
});

test("manual metadata fields participate in the unsaved signature",()=>{
  const base={slug:"manual",content:"## Draft",data:{title:"Title",description:"Summary",date:"2026-10-02",author:"Editor",category:"Grammar",tags:["manual"],seoTitle:"SEO title",metaDescription:"Meta",primaryKeyword:"keyword",canonicalUrl:"https://auctorlabs.in/blog/manual",socialImage:"https://cdn.test/og.png",editableSlug:"manual",imageAlt:"Cover",inlineImages:[]}};
  const signature=draftEditSignature(base);
  for(const [field,value] of [["date","2026-10-03"],["author","Other editor"],["category","Vocabulary"],["tags",["changed"]],["seoTitle","Changed SEO"],["metaDescription","Changed meta"],["canonicalUrl","https://auctorlabs.in/custom"],["socialImage","https://cdn.test/other.png"],["editableSlug","changed-slug"],["imageAlt","Changed alt"]]){
    assert.notEqual(draftEditSignature({...base,data:{...base.data,[field]:value}}),signature,`${field} must mark the draft unsaved`);
  }
});

test("in-flight save retains newer manual SEO metadata and prose",()=>{
  const submitted={slug:"manual",content:"First body",data:{title:"First title",seoTitle:"First SEO",category:"Grammar"}},current={slug:"manual",content:"Newer body",data:{...submitted.data,seoTitle:"Newer SEO"}},saved={slug:"manual",content:"First body",version:"2",data:{...submitted.data,seoScore:90}};
  const retained=retainEditsDuringSave(current,submitted,saved);
  assert.equal(retained.content,"Newer body");assert.equal(retained.data.seoTitle,"Newer SEO");assert.equal(retained.data.seoScore,90);
});
