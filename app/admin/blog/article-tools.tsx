"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- Existing server-evaluated draft metadata. */
import ImageTools, { type ImageInput } from "./image-tools";
import type { ReactNode } from "react";
import { extractArticleBodyLinks } from "@/lib/blog-links.mjs";

export const articleTools = ["Content", "Review", "Images", "Links", "SEO", "Birbal"] as const;
export type ArticleTool = typeof articleTools[number];
type Link = {targetArticle:string;url:string;anchor:string;context:string;reason:string};
type Props = {
  active: ArticleTool; onActivate: (tool:ArticleTool)=>void;
  draft: {slug:string;content:string;data:Record<string,any>;internalLinkRecommendations?:Link[]};
  dirty:boolean; busy:boolean; placement:string; headings:{label:string;value:string}[];
  onPlacement:(value:string)=>void; onImage:(action:string,id?:string,input?:ImageInput)=>Promise<void>|void;
  onInsert:(link:Link)=>void; onRemoveLink:(url:string)=>void;
  onMetadata:(field:string,value:string)=>void; onFix:()=>void; onRetryImages:()=>void;
  onAsk:(prompt:string)=>void; birbal:ReactNode;
};
const action = "text-xs text-orange-300 underline underline-offset-2 disabled:opacity-40";

export default function ArticleTools(props:Props) {
  const {active,onActivate,draft,dirty,busy,onAsk}=props, {data}=draft;
  const issues:any[]=data.publishEligibilityIssues||[];
  const blockers:string[]=data.technicalBlockers||data.publishEligibilityReasons||[];
  const warnings:string[]=data.publishWarnings||[];
  const fixes:any[]=data.auditReport?.fixes||[];
  const findings=[...blockers,...warnings];
  const improvements=fixes.filter(fix=>!findings.includes(fix.message));
  const links=extractArticleBodyLinks(draft.content);
  const suggestions:Link[]=(data.internalLinkStates||[]).filter((item:any)=>item.state==="SUGGESTED").map((item:any)=>({targetArticle:item.targetArticle||item.url,url:item.url,anchor:item.anchor||"",context:item.context||"",reason:item.reason||""}));
  const recommendations=[...new Map([...suggestions,...(draft.internalLinkRecommendations||[])].map(link=>[link.url,link])).values()].filter(link=>link.url!==`/blog/${draft.slug}`&&!links.some(item=>item.url===link.url));
  const reviewFinding=(message:string,index:number)=>{
    const issue=issues.find(item=>item.message===message),fix=fixes.find(item=>item.message===message);
    return <li key={`${index}-${message}`} className="space-y-2 border-t border-white/10 pt-3"><p>{message}</p>{fix?.reason&&<p className="text-xs text-slate-500">{fix.reason}</p>}<div className="flex flex-wrap gap-3">{issue&&<button disabled={busy} onClick={issue.action==="retry-images"?props.onRetryImages:props.onFix} className={action}>{issue.actionLabel}</button>}<button disabled={busy} onClick={()=>onAsk(`Fix this review finding only: ${message}.${fix?.reason?` Reason: ${fix.reason}`:""}`)} className={action}>Fix with Birbal</button></div></li>;
  };
  return <aside aria-label="Article tools" className="contents [overflow-wrap:anywhere] [&>section]:min-w-0 lg:[&>section]:col-start-2 lg:[&>section]:row-start-2">
    <nav aria-label="Editorial tools" className="flex flex-wrap gap-1 lg:col-span-full lg:row-start-1 rounded-xl border border-white/10 bg-black/20 p-1">
      {articleTools.map(tool=><button key={tool} type="button" aria-pressed={active===tool} aria-controls={tool==="Content"?"article-content":`tool-${tool.toLowerCase()}`} onClick={()=>onActivate(tool)} className={`min-h-10 rounded-lg px-3 py-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-orange-300 ${active===tool?"bg-orange-500 text-black":"text-slate-300 hover:bg-white/10"}`}>{tool}</button>)}
    </nav>
    <section id="tool-review" aria-label="Review tool" hidden={active!=="Review"}>
      <Panel title="Review"><p className="text-xs">Saved draft findings. {dirty&&"Save & Revalidate to review your latest edits."}</p><div className="mt-3 flex flex-wrap gap-3"><button disabled={busy} onClick={()=>onAsk("Fix everything the current review flagged, using separate targeted edits and preserving unaffected content.")} className={action}>Fix all</button>{warnings.length>0&&<button disabled={busy} onClick={props.onFix} className={action}>Fix Issues</button>}</div>
        <FindingGroup title="Blockers" empty="No publish blockers.">{blockers.map(reviewFinding)}</FindingGroup>
        <FindingGroup title="Warnings" empty="No publish warnings.">{warnings.map(reviewFinding)}</FindingGroup>
        <FindingGroup title="Improvements" empty="No additional suggestions.">{improvements.map((fix,index)=><li key={index} className="space-y-2 border-t border-white/10 pt-3"><p>{fix.message}</p><p className="text-xs text-slate-500">{fix.reason}</p><button disabled={busy} onClick={()=>onAsk(`Fix this review finding only: ${fix.message}. Reason: ${fix.reason}`)} className={action}>Fix with Birbal</button></li>)}</FindingGroup>
      </Panel>
    </section>
    <section id="tool-images" aria-label="Images tool" hidden={active!=="Images"} className="space-y-4">
      <ImageTools key={draft.slug} data={data} busy={busy} dirty={dirty} placement={props.placement} headings={props.headings} onPlacement={props.onPlacement} onImage={props.onImage}/>
    </section>
    <section id="tool-links" aria-label="Links tool" hidden={active!=="Links"} className="space-y-4">
      <Panel title="Internal links"><p>Internal links: {data.editorialRequirements?.internalLinks?.length||0}/1 required</p><p className="mt-2 text-xs">Verified count reflects the saved article. Save &amp; Revalidate after inserting or removing links.</p></Panel>
      <Panel title="Recommendations">{!recommendations.length&&<p>No additional published-article recommendations.</p>}{recommendations.map(link=><div key={link.url} className="mt-3 space-y-2 border-t border-white/10 pt-3"><a href={link.url} target="_blank" rel="noreferrer" className="text-orange-300">{link.targetArticle}</a><p className="text-xs">Anchor: {link.anchor} · Suggested</p><details className="text-xs"><summary>Context</summary>{link.context} {link.reason}</details><button disabled={busy} onClick={()=>props.onInsert(link)} className={action}>Insert in article</button></div>)}</Panel>
      <Panel title="Inserted / Verified">{!links.length&&<p>No internal links in the article.</p>}{links.map((link,index)=>{const saved=(data.internalLinkStates||[]).find((item:any)=>item.url===link.url);return <div key={`${link.url}-${index}`} className="mt-3 space-y-2 border-t border-white/10 pt-3"><p>{link.anchor||link.url}</p><a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-orange-300">{link.url}</a><p className="text-xs">{dirty?"Inserted · awaiting revalidation":saved?.state||"Inserted · awaiting revalidation"}</p><button disabled={busy} onClick={()=>props.onRemoveLink(link.url)} className={action}>Remove link</button></div>})}</Panel>
    </section>
    <section id="tool-seo" aria-label="SEO tool" hidden={active!=="SEO"}>
      <Panel title="SEO & metadata"><label className="block">Primary keyword<input aria-label="Primary keyword" value={data.primaryKeyword||""} onChange={e=>props.onMetadata("primaryKeyword",e.target.value)} className="mt-2 w-full min-w-0 rounded-lg border border-white/10 bg-black/30 p-3"/></label><label className="mt-4 block">SEO description<textarea aria-label="Meta description" value={data.description||""} onChange={e=>props.onMetadata("description",e.target.value)} className="mt-2 h-28 w-full rounded-lg border border-white/10 bg-black/30 p-3"/></label><p className="mt-4">On-page score: {data.seoScore??"—"}/100</p><p>AI editorial quality: {data.contentQualityScore??"—"}/100</p><p className="mt-2 text-xs">{data.readiness||"Not evaluated"} · Saved draft</p>{data.category&&<p className="mt-2">Category: {data.category}</p>}{data.audience&&<p>Audience: {data.audience}</p>}{data.auditReport&&<details className="mt-4 text-xs"><summary>Audit evidence</summary><p className="mt-2">Overall evidence check: {data.auditReport.overallScore}/100</p><p>{data.auditReport.basis}</p>{data.auditReport.unavailableSignals?.length>0&&<p className="mt-2">Unavailable signals: {data.auditReport.unavailableSignals.join(", ")}. These are not scored as failures.</p>}</details>}</Panel>
    </section>
    <section id="tool-birbal" aria-label="Birbal tool" hidden={active!=="Birbal"}>{props.birbal}</section>
  </aside>;
}

function Panel({title,children}:{title:string;children:ReactNode}) {return <div className="rounded-xl bg-black/20 p-4 text-sm text-slate-400"><h3 className="font-semibold text-white">{title}</h3><div className="mt-2">{children}</div></div>}
function FindingGroup({title,empty,children}:{title:string;empty:string;children:ReactNode[]}) {return <div className="mt-5"><h4 className="font-semibold text-slate-200">{title}</h4>{children.length?<ul className="mt-2 space-y-3">{children}</ul>:<p className="mt-2 text-xs text-slate-500">{empty}</p>}</div>}
