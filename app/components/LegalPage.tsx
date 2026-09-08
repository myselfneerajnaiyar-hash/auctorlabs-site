import type {ReactNode} from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export type LegalSection={id:string;title:string;content:ReactNode};

export default function LegalPage({title,introduction,sections,children}:{title:string;introduction:string;sections:LegalSection[];children?:ReactNode}){
 return <><Navbar/><main className="min-h-screen bg-[#0b0f2a] text-white"><header className="border-b border-white/10 bg-[#07152D] px-6 pb-16 pt-32"><div className="mx-auto max-w-4xl"><p className="mb-3 text-sm font-semibold uppercase tracking-[.2em] text-orange-400">Auctor Labs</p><h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-gray-300">{introduction}</p><p className="mt-5 text-sm text-gray-500">Last updated: September 8, 2026</p>{children}</div></header><div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[240px_minmax(0,1fr)]"><nav aria-label="On this page" className="self-start rounded-xl border border-white/10 bg-[#11183d] p-5 lg:sticky lg:top-24"><h2 className="font-semibold">On this page</h2><ul className="mt-4 space-y-2 text-sm text-gray-400">{sections.map(section=><li key={section.id}><a className="hover:text-orange-300" href={`#${section.id}`}>{section.title}</a></li>)}</ul></nav><article className="min-w-0 space-y-12">{sections.map(section=><section key={section.id} id={section.id} className="scroll-mt-28"><h2 className="text-2xl font-semibold text-white">{section.title}</h2><div className="mt-4 space-y-4 text-base leading-8 text-gray-300 [&_a]:text-orange-400 [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">{section.content}</div></section>)}</article></div></main><Footer/></>;
}
