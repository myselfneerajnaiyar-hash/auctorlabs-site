"use client";

type Props = {
  title: string;
  saveState: "Saved" | "Unsaved changes" | "Saving…" | "Save failed";
  saveError: string;
  dirty: boolean;
  busy: boolean;
  publishEnabled: boolean;
  blockers: string[];
  warnings: string[];
  onSave: () => void;
  onPublish: () => void;
  onBack: () => void;
};

export default function ArticleWorkspaceHeader({title,saveState,saveError,dirty,busy,publishEnabled,blockers,warnings,onSave,onPublish,onBack}:Props) {
  const readiness = blockers.length ? `${blockers.length} blocker${blockers.length === 1 ? "" : "s"}` : warnings.length ? "Warnings" : "Ready";
  return <header aria-label="Article workspace" className="sticky top-[env(safe-area-inset-top,0px)] z-30 -mx-6 -mt-6 mb-4 rounded-t-2xl border-b border-orange-500/20 bg-[#101522] py-2 [padding-left:max(0.75rem,env(safe-area-inset-left))] [padding-right:max(0.75rem,env(safe-area-inset-right))] lg:flex lg:items-center lg:gap-4">
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <button type="button" onClick={onBack} aria-label="Back to Library" title="Back to Library" className="flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-2 text-sm text-orange-300 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-orange-300"><span aria-hidden="true">←</span><span className="hidden sm:inline">Library</span></button>
      <h2 title={title} className="min-w-0 flex-1 truncate text-sm font-semibold sm:text-base">{title}</h2>
      <span role="status" aria-live="polite" aria-label="Save status" className={`shrink-0 text-xs ${saveState === "Saved" ? "text-emerald-300" : saveState === "Save failed" ? "text-red-300" : "text-amber-300"}`}>{saveState}</span>
    </div>
    <div className="mt-1 flex items-center justify-end gap-2 lg:mt-0 lg:shrink-0">
      <button type="button" aria-label="Save & Revalidate" disabled={busy} onClick={onSave} className="min-h-10 rounded-lg bg-orange-500 px-3 text-xs font-bold text-black disabled:opacity-40 sm:text-sm">Save<span className="hidden sm:inline"> &amp; Revalidate</span></button>
      <details className="group">
        <summary aria-label={`Readiness: ${readiness}`} className={`flex min-h-10 cursor-pointer list-none items-center rounded-lg border border-white/15 px-2 text-xs focus-visible:outline-2 focus-visible:outline-orange-300 sm:px-3 sm:text-sm [&::-webkit-details-marker]:hidden ${blockers.length ? "text-red-200" : warnings.length ? "text-amber-200" : "text-emerald-300"}`}><span className="hidden sm:inline">Readiness: </span>{readiness}<span aria-hidden="true" className="ml-1 group-open:rotate-180">⌄</span></summary>
        <div id="publish-status" className="absolute inset-x-0 top-full mt-1 max-h-[min(60dvh,24rem)] overflow-y-auto overscroll-contain rounded-xl border border-white/15 bg-[#101522] p-4 text-sm shadow-xl lg:left-auto lg:w-96">
          <p className="font-semibold">Publish readiness — saved draft</p>
          {dirty&&<p className="mt-2 text-amber-200">Unsaved changes are not included. Save &amp; Revalidate before publishing.</p>}
          {busy&&<p className="mt-2 text-amber-200">Publish is temporarily unavailable while the current operation finishes.</p>}
          {blockers.length ? <><p className="mt-3 font-medium text-red-200">Publishing is blocked:</p><ul className="mt-2 list-disc space-y-2 pl-5 text-red-200">{blockers.map(reason=><li key={reason}>{reason}</li>)}</ul></> : <p className="mt-3 text-emerald-300">No publish blockers.</p>}
          {warnings.length>0&&<details className="mt-3"><summary className="cursor-pointer text-amber-200">{warnings.length} warning{warnings.length===1?"":"s"} (not blockers)</summary><ul className="mt-2 list-disc space-y-2 pl-5 text-amber-100">{warnings.map((warning,index)=><li key={index}>{warning}</li>)}</ul></details>}
          <p className="mt-3 text-xs text-slate-400">At least 2 accepted human images and 1 valid contextual internal link are required. Supporting visuals are optional.</p>
        </div>
      </details>
      <button type="button" disabled={!publishEnabled} onClick={onPublish} aria-describedby="publish-status" className="min-h-10 rounded-lg bg-emerald-500 px-3 text-xs font-bold text-black disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm">Publish</button>
    </div>
    {saveError&&<p role="alert" title={saveError} className="mt-1 text-xs text-red-200 lg:absolute lg:inset-x-0 lg:top-full lg:mt-0 lg:rounded-b-lg lg:bg-[#101522] lg:px-3 lg:py-2">Save failed: {saveError}</p>}
  </header>;
}
