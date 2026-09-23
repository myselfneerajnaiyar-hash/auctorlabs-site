import assert from "node:assert/strict";
import test, {beforeEach} from "node:test";
import sharp from "sharp";
import {cms,fixture} from "./helpers/blog-studio-harness.mjs";
import {completeInlineImagePlan} from "./blog-engine.mjs";
import {directedImage,distinctConcepts} from "../lib/blog-image-concepts.mjs";
import {stageGeneratedImages} from "../lib/blog-image-review.mjs";
import {editorialRequirements} from "../lib/blog-editorial-requirements.mjs";
const {addCmsInlineImage,planCmsInlineImages,regenerateCmsInlineImage,regenerateCmsFeaturedImage,uploadCmsInlineImage,acceptCmsInlineImage,removeCmsInlineImage}=await import("../lib/blog-cms-images.ts");
const admin={id:"editor",role:"owner"};
let prompts,planning,validations;
beforeEach(()=>{
  fixture();prompts=[];planning=[];validations=[];cms.uploads=[];
  cms.imageEngine={generate:async prompt=>{prompts.push(prompt);return Buffer.from("fixture")},validate:async(bytes,prompt)=>{validations.push(prompt)},plan:async(brief,content,options)=>{planning.push(options);return completeInlineImagePlan([], [{id:"insight",heading:"Insight",context:"Reading"}]).map((image,index)=>options.imageDirection?directedImage(image,`${options.imageDirection} scene ${index}`):image)}};
});
const latest=()=>cms.row.frontmatter.inlineImages.at(-1);
const state=()=>editorialRequirements(cms.row,cms.assets,["/blog/published"]);
test("planner supplies two distinct human stories even when no candidates are returned",()=>{
 const images=completeInlineImagePlan([],[{id:"insight",heading:"Insight"}]);assert.equal(images.length,2);assert.equal(distinctConcepts(images).length,2);assert.notEqual(images[0].conceptDescription,images[1].conceptDescription);assert.match(images[0].prompt,/time pressure/);assert.match(images[1].prompt,/explaining/);
});
test("planner filters duplicate concepts even with different IDs",()=>{
 const one={id:"one",role:"human",placement:"insight",visualConceptId:"same-story",scene:"A tense learner reading in class"};
 const images=completeInlineImagePlan([one,{...one,id:"two"}],[{id:"insight",heading:"Insight"}]);assert.equal(images.filter(i=>i.visualConceptId==="same-story").length,1);assert.equal(distinctConcepts(images).length,2);
});
test("human direction reaches planning and generation; blank keeps planned prompts",async()=>{
 await addCmsInlineImage(admin,"current","insight","A student mapping ideas in a library");assert.equal(planning[0].imageDirection,"A student mapping ideas in a library");assert.match(prompts[0],/mapping ideas/);assert.ok(planning[0].existingImages.length);
 fixture();await addCmsInlineImage(admin,"current","insight","");assert.equal(planning[1].imageDirection,"");assert.match(prompts[1],/time pressure/);
});
test("generated candidates are individually staged, Keep and Discard preserve unrelated content",async()=>{
 const before=cms.row.content,metadata=structuredClone(cms.row.frontmatter);await planCmsInlineImages(admin,"current");const candidates=cms.row.frontmatter.inlineImages.filter(i=>i.status==="proposed");assert.equal(candidates.length,2);assert.equal(cms.row.content,before);
 await acceptCmsInlineImage(admin,"current",candidates[0].id);assert.ok(cms.row.content.includes(`inline-image:${candidates[0].id}`));await removeCmsInlineImage(admin,"current",candidates[1].id);assert.ok(!cms.row.content.includes(candidates[1].id));assert.ok(cms.row.content.includes('[related reading](/blog/published)'));assert.ok(cms.row.content.includes('inline-image:human-0'));assert.equal(cms.row.frontmatter.title,metadata.title);assert.equal(cms.row.frontmatter.author,metadata.author);
});
test("replacement uses new instruction, preserves placement, changes role and leaves accepted asset intact until Keep",async()=>{
 const before=cms.row.content,oldAsset=structuredClone(cms.assets[0]);await regenerateCmsInlineImage(admin,"current","human-0","Replace with a comparison diagram of word spotting vs structure reading");const image=latest();assert.equal(image.status,"proposed");assert.equal(image.role,"supporting_visual");assert.equal(image.placement,"insight");assert.equal(image.replaces,"human-0");assert.match(prompts[0],/comparison diagram/);assert.equal(cms.row.content,before);assert.deepEqual(cms.assets[0],oldAsset);
 await acceptCmsInlineImage(admin,"current",image.id);assert.ok(!cms.row.content.includes('inline-image:human-0'));assert.ok(cms.row.content.includes('inline-image:human-1'));assert.ok(cms.row.content.includes(`[related reading](/blog/published)`));assert.equal(state().supportingVisuals,1);assert.equal(state().humanImages,1);
});
test("blank replacement is rejected and failed replacement preserves original",async()=>{
 await assert.rejects(regenerateCmsInlineImage(admin,"current","human-0",""),/Describe/);const before=cms.row.content;cms.imageEngine.generate=async()=>{throw Error("quality gate failed")};await regenerateCmsInlineImage(admin,"current","human-0","A learner teaching a peer");assert.equal(latest().status,"failed");assert.equal(cms.row.content,before);assert.equal(state().humanImages,2);
});
test("discarding replacement leaves original URL and readiness available to Undo",async()=>{
 await regenerateCmsInlineImage(admin,"current","human-0","A confident learner teaching a peer");const before=cms.row.content;await removeCmsInlineImage(admin,"current",latest().id);assert.equal(cms.row.content,before);assert.equal(state().humanImages,2);assert.equal(cms.assets[0].status,"generated");
});
async function upload(role,concept="A student discussing a map with a tutor") {
 const bytes=await sharp({create:{width:20,height:20,channels:3,background:'#abc'}}).jpeg().toBuffer();
 await uploadCmsInlineImage(admin,"current",new File([bytes],"own.jpg",{type:"image/jpeg"}),"insight",role,concept,"Custom alt");return latest();
}
test("uploaded human image uses existing asset storage, validates, stages and counts after Keep",async()=>{
 fixture({humans:1});const before=cms.row.content;const image=await upload("human");assert.equal(image.source,"uploaded");assert.equal(image.status,"proposed");assert.equal(cms.row.content,before);assert.equal(state().humanImages,1);assert.equal(cms.uploads[0].metadata.assetType,"inline");assert.equal(cms.uploads[0].bytes.subarray(1,4).toString(),"PNG");assert.match(validations[0],/Human-centered/);await acceptCmsInlineImage(admin,"current",image.id);assert.equal(state().humanImages,2);assert.equal(state().humanReady,true);
});
test("uploaded supporting image is optional and can be discarded before insertion",async()=>{
 const before=cms.row.content;const image=await upload("supporting_visual","A structure comparison diagram");await removeCmsInlineImage(admin,"current",image.id);assert.equal(cms.row.content,before);assert.equal(state().supportingVisuals,0);const second=await upload("supporting_visual","Paragraph structure flowchart");await acceptCmsInlineImage(admin,"current",second.id);assert.equal(state().supportingVisuals,1);assert.equal(state().humanReady,true);
});
test("corrupt or unsupported uploads and failed quality validation never persist",async()=>{
 await assert.rejects(uploadCmsInlineImage(admin,"current",new File(["bad"],"bad.png",{type:"image/png"}),"insight","human","Student"));await assert.rejects(uploadCmsInlineImage(admin,"current",new File(["svg"],"bad.svg",{type:"image/svg+xml"}),"insight","human","Student"),/PNG/);cms.imageEngine.validate=async()=>{throw Error("unsafe image")};await assert.rejects(upload("human"),/unsafe/);assert.equal(cms.uploads.length,0);
});
test("two accepted copies of one human concept count only once regardless of source",()=>{
 const images=cms.row.frontmatter.inlineImages;images[0].visualConceptId=images[1].visualConceptId="same-reading-scene";images[0].source="ai";images[1].source="uploaded";assert.equal(state().humanImages,1);assert.equal(state().humanReady,false);images[1].visualConceptId="peer-teaching";assert.equal(state().humanReady,true);
});
test("featured replacement stages and accepts with immutable key, without double counting",async()=>{
 cms.row.frontmatter.image="https://cdn.test/featured.png";cms.assets.push({image_key:"featured",asset_type:"featured",status:"generated",public_url:cms.row.frontmatter.image});await regenerateCmsFeaturedImage(admin,"current","A learner reviewing a plan with a coach");const image=latest();assert.equal(cms.row.frontmatter.image,"https://cdn.test/featured.png");await acceptCmsInlineImage(admin,"current",image.id);assert.equal(cms.row.frontmatter.featuredImageKey,image.id);assert.equal(state().humanImages,3);
});
test("initial generation enters the same review queue for inline and featured images",()=>{
 const staged=stageGeneratedImages(cms.row.content,{...cms.row.frontmatter,image:"https://cdn.test/featured.png",imagePrompt:"A learner outside"});assert.equal(staged.data.image,"");assert.equal(staged.data.inlineImages.length,3);assert.ok(staged.data.inlineImages.every(i=>i.status==="proposed"));assert.ok(!staged.content.includes('inline-image:'));assert.match(staged.content,/related reading/);
});
