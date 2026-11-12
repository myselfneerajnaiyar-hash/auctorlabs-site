import assert from "node:assert/strict";
import test, {beforeEach} from "node:test";
import sharp from "sharp";
import {cms,fixture} from "./helpers/blog-studio-harness.mjs";
import {completeInlineImagePlan} from "./blog-engine.mjs";
import {directedImage,distinctConcepts} from "../lib/blog-image-concepts.mjs";
import {stageGeneratedImages} from "../lib/blog-image-review.mjs";
import {editorialRequirements} from "../lib/blog-editorial-requirements.mjs";
const {addCmsInlineImage,planCmsInlineImages,regenerateCmsInlineImage,regenerateCmsFeaturedImage,startCmsFeaturedImageGeneration,processCmsFeaturedImageJob,uploadCmsInlineImage,uploadManualCmsImage,acceptCmsInlineImage,removeCmsInlineImage}=await import("../lib/blog-cms-images.ts");
const {saveCmsDraft}=await import("../lib/blog-cms-actions.ts");
const {getCmsDraft}=await import("../lib/blog-cms-actions.ts");
const {updateCmsJob}=await import("../lib/blog-cms-db.ts");
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
async function manualPng(name){const bytes=await sharp({create:{width:20,height:20,channels:3,background:"#abc"}}).png().toBuffer();return new File([bytes],name,{type:"image/png"});}
test("uploaded human image uses existing asset storage, validates, stages and counts after Keep",async()=>{
 fixture({humans:1});const before=cms.row.content;const image=await upload("human");assert.equal(image.source,"uploaded");assert.equal(image.status,"proposed");assert.equal(cms.row.content,before);assert.equal(state().humanImages,1);assert.equal(cms.uploads[0].metadata.assetType,"inline");assert.equal(cms.uploads[0].bytes.subarray(1,4).toString(),"PNG");assert.match(validations[0],/Human-centered/);await acceptCmsInlineImage(admin,"current",image.id);assert.equal(state().humanImages,2);assert.equal(state().humanReady,true);
});
test("uploaded supporting image is optional and can be discarded before insertion",async()=>{
 const before=cms.row.content;const image=await upload("supporting_visual","A structure comparison diagram");await removeCmsInlineImage(admin,"current",image.id);assert.equal(cms.row.content,before);assert.equal(state().supportingVisuals,0);const second=await upload("supporting_visual","Paragraph structure flowchart");await acceptCmsInlineImage(admin,"current",second.id);assert.equal(state().supportingVisuals,1);assert.equal(state().humanReady,true);
});
test("corrupt or unsupported uploads and failed quality validation never persist",async()=>{
 await assert.rejects(uploadCmsInlineImage(admin,"current",new File(["bad"],"bad.png",{type:"image/png"}),"insight","human","Student"));await assert.rejects(uploadCmsInlineImage(admin,"current",new File(["svg"],"bad.svg",{type:"image/svg+xml"}),"insight","human","Student"),/PNG/);cms.imageEngine.validate=async()=>{throw Error("unsafe image")};await assert.rejects(upload("human"),/unsafe/);assert.equal(cms.uploads.length,0);
});
test("manual featured upload persists the asset reference, alt text and unsaved article fields",async()=>{
 const bytes=await sharp({create:{width:20,height:20,channels:3,background:"#abc"}}).jpeg().toBuffer(),content=`${cms.row.content}\n\nLocally edited prose.`;
 const file=new File([bytes],"cover.jpg",{type:"image/jpeg"}),data={...cms.row.frontmatter,title:"Updated working title",author:"Working author",seoTitle:"Working SEO title",date:"2026-10-02",tags:["manual"]};
 await uploadManualCmsImage(admin,"current",file,"featured","Learner beside a whiteboard",{content,data,expectedUpdatedAt:cms.row.updated_at});
 const key=cms.row.frontmatter.featuredImageKey,asset=cms.assets.find(item=>item.image_key===key);
 assert.ok(cms.row.frontmatter.image);assert.equal(cms.row.frontmatter.imageAlt,"Learner beside a whiteboard");assert.equal(asset.alt_text,"Learner beside a whiteboard");assert.equal(cms.row.title,"Updated working title");assert.equal(cms.row.frontmatter.author,"Working author");assert.equal(cms.row.frontmatter.seoTitle,"Working SEO title");assert.ok(cms.row.content.includes("Locally edited prose."));
});
test("manual inline upload persists alt metadata and inserts renderer-compatible Markdown without losing working edits",async()=>{
 const bytes=await sharp({create:{width:20,height:20,channels:3,background:"#abc"}}).png().toBuffer(),content=`${cms.row.content}\n\nLocally edited paragraph.`;
 const file=new File([bytes],"diagram.png",{type:"image/png"}),data={...cms.row.frontmatter,description:"Edited summary",primaryKeyword:"edited keyword"};
 const draft=await uploadManualCmsImage(admin,"current",file,"inline","A diagram with labels",{content,data,expectedUpdatedAt:cms.row.updated_at});
 const inline=draft.data.inlineImages.at(-1);
 assert.equal(inline.alt,"A diagram with labels");assert.equal(inline.source,"uploaded");assert.ok(cms.row.content.includes("Locally edited paragraph."));assert.ok(cms.row.content.includes(`![A diagram with labels](${inline.src})`));assert.ok(draft.content.includes(inline.src));assert.match(cms.row.description,/^Edited summary/);assert.equal(cms.row.frontmatter.primaryKeyword,"edited keyword");
});
test("first manual inline upload at the beginning persists through draft retrieval and satisfies image readiness",async()=>{
 fixture({humans:0});const file=await manualPng("first.png"),content="Opening paragraph.\n\nClosing paragraph.";
 const saved=await uploadManualCmsImage(admin,"current",file,"inline","Opening image",{content,data:cms.row.frontmatter,expectedUpdatedAt:cms.row.updated_at,insertAt:0});
 const image=saved.data.inlineImages[0],refreshed=await getCmsDraft("current");
 assert.ok(cms.row.content.startsWith(`{/* inline-image:${image.id} */}\n\n![Opening image](${image.src})`));
 assert.equal(cms.assets.find(asset=>asset.image_key===image.id).placement,"inline");assert.equal(refreshed.content,cms.row.content);assert.equal(refreshed.data.inlineImages[0].placement,"inline");assert.equal(editorialRequirements(cms.row,cms.assets,["/blog/published"]).humanImages,1);
});
test("manual inline images inserted at the beginning, middle and end use the same MDX-safe block",async()=>{
 for(const position of ["beginning","middle","end"]){fixture({humans:0});const content="Opening words.\n\nMiddle words.\n\nClosing words.",insertAt=position==="beginning"?0:position==="middle"?content.indexOf("Middle"):content.length;
  const file=await manualPng(`${position}.png`);await uploadManualCmsImage(admin,"current",file,"inline",`${position} image`,{content,data:cms.row.frontmatter,expectedUpdatedAt:cms.row.updated_at,insertAt});
  const image=cms.row.frontmatter.inlineImages[0],marker=`{/* inline-image:${image.id} */}`,markdown=`![${position} image](${image.src})`,at=cms.row.content.indexOf(marker);
  assert.ok(at>=0);assert.equal(cms.row.content.indexOf(markdown),at+marker.length+2);
  for(const original of ["Opening words.","Middle words.","Closing words."])assert.ok(cms.row.content.includes(original));
  if(position==="beginning")assert.ok(at<cms.row.content.indexOf("Opening words."));
  if(position==="middle")assert.ok(cms.row.content.indexOf("Opening words.")<at&&at<cms.row.content.indexOf("Middle words."));
  if(position==="end")assert.ok(at>cms.row.content.indexOf("Closing words."));
  assert.equal(cms.row.frontmatter.inlineImages[0].placement,"inline");assert.equal(editorialRequirements(cms.row,cms.assets,["/blog/published"]).humanImages,1);
 }
});
test("multiple manual inline uploads retain separate metadata and count after save and refresh",async()=>{
 fixture({humans:0});const positions=[0,20,undefined];
 const alts=["Learner maps a passage","Tutor explains evidence","Student compares arguments"];
 for(let index=0;index<positions.length;index++){const content=cms.row.content,file=await manualPng(`image-${index}.png`);await uploadManualCmsImage(admin,"current",file,"inline",alts[index],{content,data:cms.row.frontmatter,expectedUpdatedAt:cms.row.updated_at,insertAt:positions[index]??content.length});}
 const refreshed=await getCmsDraft("current"),images=refreshed.data.inlineImages;
 assert.equal(images.length,3);assert.equal(new Set(images.map(image=>image.id)).size,3);assert.equal(new Set(images.map(image=>image.placement)).size,1);assert.ok(images.every(image=>refreshed.content.includes(`{/* inline-image:${image.id} */}`)&&refreshed.content.includes(`](${image.src})`)));assert.equal(editorialRequirements({content:refreshed.content,frontmatter:refreshed.data},cms.assets,["/blog/published"]).humanImages,3);
});
test("previously saved ordinary Markdown images remain compatible with readiness",()=>{
 fixture({humans:1});cms.row.content=cms.row.content.replace(/\{\/\* inline-image:[^*]+\*\/\}\s*/g,"");
 assert.equal(editorialRequirements(cms.row,cms.assets,["/blog/published"]).humanImages,1);
});
test("manual image upload rejects a stale working copy before storing an asset",async()=>{
 const bytes=await sharp({create:{width:20,height:20,channels:3,background:"#abc"}}).png().toBuffer(),before=structuredClone(cms.row),count=cms.assets.length;
 await assert.rejects(uploadManualCmsImage(admin,"current",new File([bytes],"cover.png",{type:"image/png"}),"featured","Cover",{content:cms.row.content,data:cms.row.frontmatter,expectedUpdatedAt:"stale-version"}),/changed in another session/);
 assert.equal(cms.assets.length,count);assert.deepEqual(cms.row,before);
});
test("concurrent article change during upload removes only the new uploaded asset",async()=>{
 fixture({humans:1});const existing=structuredClone(cms.assets[0]),content=cms.row.content,file=await manualPng("race.png");
 cms.onUpload=async()=>{cms.row={...cms.row,updated_at:"raced-version",content:`${cms.row.content}\n\nConcurrent editor change.`};};
 await assert.rejects(uploadManualCmsImage(admin,"current",file,"inline","Race image",{content,data:cms.row.frontmatter,expectedUpdatedAt:cms.row.updated_at,insertAt:content.length}),/changed while the image was uploading/);
 assert.deepEqual(cms.assets,[existing]);assert.equal(cms.uploads[0].deleted,true);assert.deepEqual(cms.cleanups,[{article:"article-1",id:cms.uploads[0].id}]);assert.ok(cms.row.content.includes("Concurrent editor change."));
});
test("compare-and-swap conflict during save cleans up the new asset without changing the winning draft",async()=>{
 fixture({humans:1});const existing=structuredClone(cms.assets[0]),content=cms.row.content,file=await manualPng("race.png");
 cms.beforeUpdate=async()=>{cms.row={...cms.row,updated_at:"raced-version",content:`${cms.row.content}\n\nConcurrent editor change.`};};
 await assert.rejects(uploadManualCmsImage(admin,"current",file,"inline","Race image",{content,data:cms.row.frontmatter,expectedUpdatedAt:cms.row.updated_at,insertAt:content.length}),/changed in another session/);
 assert.deepEqual(cms.assets,[existing]);assert.equal(cms.uploads[0].deleted,true);assert.ok(cms.row.content.includes("Concurrent editor change."));
});
test("two accepted copies of one human concept count only once regardless of source",()=>{
 const images=cms.row.frontmatter.inlineImages;images[0].visualConceptId=images[1].visualConceptId="same-reading-scene";images[0].source="ai";images[1].source="uploaded";assert.equal(state().humanImages,1);assert.equal(state().humanReady,false);images[1].visualConceptId="peer-teaching";assert.equal(state().humanReady,true);
});
test("featured replacement stages and accepts with immutable key, without double counting",async()=>{
 cms.row.frontmatter.image="https://cdn.test/featured.png";cms.assets.push({image_key:"featured",asset_type:"featured",status:"generated",public_url:cms.row.frontmatter.image});await regenerateCmsFeaturedImage(admin,"current","A learner reviewing a plan with a coach");const image=latest();assert.equal(cms.row.frontmatter.image,"https://cdn.test/featured.png");await acceptCmsInlineImage(admin,"current",image.id);assert.equal(cms.row.frontmatter.featuredImageKey,image.id);assert.equal(state().humanImages,3);
});
test("featured generation is queued once, uploads the image, and can be accepted",async()=>{
 const before=cms.row.content,title=cms.row.title,job=await startCmsFeaturedImageGeneration(admin,"current","A learner explaining a reading strategy");
 assert.equal(job.status,"pending");assert.equal(cms.row.frontmatter.featuredImageGeneration.id,job.jobId);
 const duplicate=await startCmsFeaturedImageGeneration(admin,"current","A different direction");assert.equal(duplicate.jobId,job.jobId);
 assert.equal(cms.jobs.length,1);assert.equal(duplicate.direction,job.direction);
 await processCmsFeaturedImageJob(job.jobId);
 const image=cms.row.frontmatter.inlineImages.find(item=>item.jobId===job.jobId);
 assert.equal(cms.row.frontmatter.featuredImageGeneration.status,"review_ready");assert.equal(cms.jobs[0].status,"complete");assert.equal(image.status,"proposed");assert.ok(image.src);assert.equal(cms.assets.at(-1).asset_type,"featured");
 assert.equal(cms.row.content,before);assert.equal(cms.row.title,title);
 await acceptCmsInlineImage(admin,"current",image.id);const writes=cms.writes.length;await acceptCmsInlineImage(admin,"current",image.id);assert.equal(cms.writes.length,writes);assert.equal(cms.row.frontmatter.image,image.src);assert.equal(cms.row.frontmatter.featuredImageKey,image.id);
});
test("featured generation failure is recorded while saved blog content remains editable",async()=>{
 const content=`${cms.row.content}\n\nSaved manual paragraph.`,title="Saved manual title";
 await saveCmsDraft(admin,"current",{content,data:{title},expectedUpdatedAt:cms.row.updated_at});
 const job=await startCmsFeaturedImageGeneration(admin,"current","A learner sharing an insight");
 cms.imageEngine.generate=async()=>{throw Error("provider unavailable")};
 await assert.rejects(processCmsFeaturedImageJob(job.jobId),/provider unavailable/);
 assert.equal(cms.row.frontmatter.featuredImageGeneration.status,"failed");assert.match(cms.row.frontmatter.featuredImageGeneration.error,/provider unavailable/);
 assert.equal(cms.row.title,title);assert.ok(cms.row.content.includes("Saved manual paragraph."));assert.equal(cms.row.status,"draft");
 cms.imageEngine.generate=async prompt=>{prompts.push(prompt);return Buffer.from("fixture")};
 const retry=await startCmsFeaturedImageGeneration(admin,"current","A learner sharing an insight in a study group");
 assert.equal(retry.jobId,job.jobId);assert.equal(cms.jobs.length,1);await processCmsFeaturedImageJob(retry.jobId);
 assert.equal(cms.row.frontmatter.featuredImageGeneration.status,"review_ready");assert.equal(cms.jobs[0].status,"complete");assert.equal(cms.row.title,title);assert.ok(cms.row.content.includes("Saved manual paragraph."));
});
test("an expired worker lease at the retry limit is finalized as failed instead of staying generating",async()=>{
 const job=await startCmsFeaturedImageGeneration(admin,"current","A learner considering a new idea");await updateCmsJob(job.jobId,{status:"processing",attempt_count:3,max_attempts:3,lease_expires_at:new Date(Date.now()-1000).toISOString()});
 await processCmsFeaturedImageJob(job.jobId);const persisted=cms.jobs[0];assert.equal(persisted.status,"failed");assert.equal(persisted.failure_kind,"permanent");assert.match(persisted.error,/automatic retry limit/);assert.equal(cms.row.frontmatter.featuredImageGeneration.status,"failed");
});
test("initial generation enters the same review queue for inline and featured images",()=>{
 const staged=stageGeneratedImages(cms.row.content,{...cms.row.frontmatter,image:"https://cdn.test/featured.png",imagePrompt:"A learner outside"});assert.equal(staged.data.image,"");assert.equal(staged.data.inlineImages.length,3);assert.ok(staged.data.inlineImages.every(i=>i.status==="proposed"));assert.ok(!staged.content.includes('inline-image:'));assert.match(staged.content,/related reading/);
});
