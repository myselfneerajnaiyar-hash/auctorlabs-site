// Bundle the actual client components for an isolated browser check, using only
// installed dependencies. Requests are fixture-backed; production is untouched.
import {createRequire} from "node:module";
import {readFileSync,existsSync} from "node:fs";
import path from "node:path";
import ts from "typescript";
const require=createRequire(import.meta.url);
export function studioBrowserBundle(){
  const root=process.cwd(),modules=[],ids=new Map();
  function add(file){
    file=require.resolve(file);if(ids.has(file))return ids.get(file);
    const id=modules.length;ids.set(file,id);modules.push("");
    let source=readFileSync(file,"utf8");
    if(/\.(tsx?|mjs)$/.test(file))source=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020,allowJs:true}}).outputText;
    source=source.replace(/require\(["']([^"']+)["']\)/g,(_match,specifier)=>{
      let target=specifier.startsWith("@/")?path.join(root,specifier.slice(2)):specifier.startsWith(".")?path.resolve(path.dirname(file),specifier):require.resolve(specifier,{paths:[path.dirname(file)]});
      if(!path.extname(target))target=["",".tsx",".ts",".mjs",".js"].map(ext=>target+ext).find(candidate=>existsSync(candidate))||target;
      return `__require(${add(target)})`;
    });
    modules[id]=`function(module,exports,__require){${source}\n}`;return id;
  }
  const react=add(require.resolve("react")),dom=add(require.resolve("react-dom/client")),studio=add(path.join(root,"app/admin/blog/studio.tsx"));
  return `var process={env:{NODE_ENV:"production"}};var __modules=[${modules.join(",")}];var __cache={};function __require(id){if(__cache[id])return __cache[id].exports;var m=__cache[id]={exports:{}};__modules[id](m,m.exports,__require);return m.exports;}__require(${dom}).createRoot(document.getElementById('root')).render(__require(${react}).createElement(__require(${studio}).default));`;
}

export const studioBrowserFixture=String.raw`
window.calls=[];window.confirm=()=>true;
window.fetch=async(url,init={})=>{
  window.calls.push({url,...init});let body;
  if(url==='/api/admin/blog')body={posts:[{slug:'a',title:'Article A',status:'draft'},{slug:'b',title:'Article B',status:'draft'}],topics:[],categories:[],qualityThreshold:80};
  else if(url.includes('search-performance'))body={status:'UNAVAILABLE'};
  else if(url.includes('/draft/')){const slug=url.split('/').pop();body={slug,version:'1',content:'## Insight\n\nArticle content with related reading.',internalLinkRecommendations:[{url:'/blog/published',targetArticle:'Published article',anchor:'related reading',context:'In the introduction',reason:'Related subject'}],data:{title:'Article '+slug.toUpperCase(),description:'SEO description',primaryKeyword:'reading',inlineImages:[{id:'proposal',role:'human',status:'proposed',placement:'insight',purpose:'A learner reading',src:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect width="600" height="400" fill="%23666"/%3E%3C/svg%3E'}],publishEligible:false,technicalBlockers:['One contextual internal link is required.'],auditReport:{fixes:[{severity:'MEDIUM',message:'Improve the introduction',reason:'Explain the topic clearly'}]}},checks:{externalLinks:[],seoIssues:[]}}}
  else if(url.includes('/birbal'))body={reply:'Proposal for Article A',proposal:[{type:'replace_text',target:'Article content',replacement:'Improved content',summary:'Improve Article A'}]};
  else throw Error('Unexpected fixture request '+url);
  return {ok:true,json:async()=>body};
};
`;
