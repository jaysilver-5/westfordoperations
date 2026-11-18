/** Route-level loading state, shown only if a navigation suspends. */
export default function Loading() {
  return <main id="main-content" className="shell min-h-[60vh] py-16" role="status" aria-label="Loading Westford page">
    <div className="mx-auto flex max-w-[760px] animate-pulse flex-col items-center gap-5 text-center" aria-hidden="true">
      <div className="h-3 w-38 rounded bg-[#dbe6d7]" />
      <div className="mt-4 h-12 w-[86%] rounded-lg bg-[#e0e9dd]" />
      <div className="h-12 w-[65%] rounded-lg bg-[#e0e9dd]" />
      <div className="mt-4 h-3.5 w-[83%] rounded bg-[#e2e9e0]" />
      <div className="h-3.5 w-[70%] rounded bg-[#e2e9e0]" />
    </div>
    <span className="sr-only">Loading page</span>
  </main>;
}
