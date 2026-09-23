import { removeInlineImageFromMdx } from "../scripts/blog-engine.mjs";
// Generation jobs use the same candidate list as the workspace. No new storage.
export function stageGeneratedImages(content, frontmatter) {
  const data=structuredClone(frontmatter);
  data.inlineImages=(data.inlineImages||[]).map(image=>{
    if(image.status!=="generated")return image;
    content=removeInlineImageFromMdx(content,image.id);
    return {...image,status:"proposed",source:"ai"};
  });
  if(data.image){
    data.inlineImages.push({id:"featured",target:"featured",type:"editorial",role:"human",placement:"featured",purpose:"Featured editorial image",conceptDescription:data.imagePrompt,visualConceptId:"featured-editorial",prompt:data.imagePrompt,alt:data.imageAlt||data.title,src:data.image,status:"proposed",source:"ai"});
    data.image="";
  }
  data.inlineImageSummary={planned:data.inlineImages.length,generated:0,failed:data.inlineImages.filter(i=>i.status==="failed").length};
  return {content,data};
}
