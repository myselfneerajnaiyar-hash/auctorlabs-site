import assert from "node:assert/strict";
import test from "node:test";
import { editorialRequirements } from "../lib/blog-editorial-requirements.mjs";
import { publicationTechnicalBlockers } from "../lib/blog-publish-policy.ts";
import { publishControlState } from "../lib/blog-studio-state.mjs";

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
