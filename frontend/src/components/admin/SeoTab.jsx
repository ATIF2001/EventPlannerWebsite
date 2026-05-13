function SeoTab({
  seoCustomizationTemplates,
  selectedSeoPage,
  setSelectedSeoPage,
  getSeoBlocks,
  updatePageBlockLocal,
  handleSaveBlocksBatch,
  siteSaving,
  siteLoading,
  siteError,
  siteMessage,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10">
      <h2 className="text-3xl font-semibold">SEO</h2>
      <p className="mt-2 text-white/70">Manage SEO title, description, and keywords for all pages from one place.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {Object.keys(seoCustomizationTemplates).map((pageKey) => (
          <button
            key={pageKey}
            type="button"
            onClick={() => setSelectedSeoPage(pageKey)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              selectedSeoPage === pageKey ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {pageKey === "details" ? "Details" : pageKey.charAt(0).toUpperCase() + pageKey.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {getSeoBlocks(selectedSeoPage).map((block) => (
          <div key={block.key} className="rounded-lg border border-white/10 bg-black/30 p-4">
            <p className="text-sm font-medium text-white/85">{block.label}</p>
            <textarea
              className="mt-2 w-full rounded-md border border-white/20 bg-black/20 p-2"
              rows={3}
              value={block.value}
              onChange={(e) => updatePageBlockLocal(selectedSeoPage, block.key, { value: e.target.value })}
            />
          </div>
        ))}
      </div>
      {siteError ? <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">{siteError}</p> : null}
      {siteMessage ? <p className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">{siteMessage}</p> : null}
      <button
        type="button"
        className="mt-6 rounded-lg bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
        onClick={() =>
          handleSaveBlocksBatch(
            getSeoBlocks(selectedSeoPage),
            `${selectedSeoPage === "details" ? "Details" : selectedSeoPage.charAt(0).toUpperCase() + selectedSeoPage.slice(1)} SEO saved successfully.`
          )
        }
        disabled={siteSaving || siteLoading}
      >
        {siteSaving ? "Saving..." : `Save ${selectedSeoPage === "details" ? "Details" : selectedSeoPage.charAt(0).toUpperCase() + selectedSeoPage.slice(1)} SEO`}
      </button>
    </div>
  );
}

export default SeoTab;
