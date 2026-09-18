export function articleSections(content="") {
  const matches=[...String(content).matchAll(/^##\s+(.+)$/gm)];
  return matches.map((match,index)=>({heading:match[1],start:match.index,end:matches[index+1]?.index??content.length,content:content.slice(match.index,matches[index+1]?.index??content.length)}));
}

export function buildBirbalContext({article,assets=[],links=[],performance=[]}) {
  const frontmatter=article.frontmatter||{},brief=article.brief?.brief||article.brief||{};
  return {
    article:{id:article.id,title:article.title,slug:article.slug,content:article.content,sections:articleSections(article.content).map(({heading,content})=>({heading,content})),status:article.status,currentRevision:article.updated_at},
    seo:{primaryKeyword:frontmatter.primaryKeyword||null,secondaryKeywords:frontmatter.secondaryKeywords||[],keywordResearch:frontmatter.researchIntelligence||brief.researchIntelligence||null,searchVolume:frontmatter.searchVolume??null,cpc:frontmatter.cpc??null,difficulty:frontmatter.keywordDifficulty??null,opportunityScore:frontmatter.opportunityScore??null,evidenceConfidence:frontmatter.evidenceConfidence??null},
    research:{decision:frontmatter.researchDecision||null,topicSignals:frontmatter.topicSignals||[],contentGap:brief.contentGaps||null},
    review:{score:frontmatter.contentQualityScore??null,findings:frontmatter.auditReport?.fixes||frontmatter.qualityWarnings||[],qualityDimensions:frontmatter.qualityDimensions||null},
    images:assets.map(asset=>({id:asset.image_key,type:asset.asset_type,position:asset.placement,prompt:asset.prompt,altText:asset.alt_text,status:asset.status,url:asset.public_url})),
    auctor:{internalLinkOpportunities:links},
    gsc:performance,
  };
}

export function applyBirbalOperations(article,operations=[]) {
  let content=String(article.content),title=String(article.title),description=String(article.description);const applied=[];
  for(const operation of operations){
    if(operation.type==="replace_text"){
      const target=String(operation.target||"");if(!target||content.split(target).length!==2)throw new Error("Birbal could not safely identify one exact passage. Please select or quote the passage more precisely.");
      content=content.replace(target,String(operation.replacement||""));applied.push(operation.summary||"Rewrote a targeted passage");
    }else if(operation.type==="insert_after"){
      const target=String(operation.target||"");if(!target||content.split(target).length!==2)throw new Error("Birbal could not safely identify one insertion point. Please name the section more precisely.");
      content=content.replace(target,`${target}\n\n${String(operation.replacement||"").trim()}`);applied.push(operation.summary||"Added targeted content");
    }else if(operation.type==="set_title"){title=String(operation.replacement||title);applied.push(operation.summary||"Updated the title");}
    else if(operation.type==="set_description"){description=String(operation.replacement||description);applied.push(operation.summary||"Updated the description");}
  }
  if(!applied.length)throw new Error("Birbal proposed no safe article edit.");
  return{title,description,content,applied};
}

export function birbalNeedsConfirmation(operations=[]){return operations.length>1||operations.some(operation=>String(operation.type).startsWith("image_"));}
