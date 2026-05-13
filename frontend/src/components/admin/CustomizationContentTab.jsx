function CustomizationContentTab({
  pageCustomizationTemplates,
  selectedCustomizationPage,
  setSelectedCustomizationPage,
  getPageBlocks,
  updatePageBlockLocal,
  handleBlockImageUpload,
  handleSaveBlocksBatch,
  siteSaving,
  siteLoading,
  siteError,
  siteMessage,
}) {
  return (
    <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-6">
      <h3 className="text-2xl font-semibold">Page Content</h3>
      <p className="mt-1 text-sm text-white/65">Select a page and edit required text/images. Hero uploads are fixed to 1920x800.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.keys(pageCustomizationTemplates).map((pageKey) => (
          <button
            key={pageKey}
            type="button"
            onClick={() => setSelectedCustomizationPage(pageKey)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              selectedCustomizationPage === pageKey ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {pageKey.charAt(0).toUpperCase() + pageKey.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {getPageBlocks(selectedCustomizationPage).map((block) => (
          <div key={block.key} className="rounded-lg border border-white/10 bg-black/30 p-4">
            <p className="text-sm font-medium text-white/85">{block.label}</p>
            {block.contentType === "image" ? (
              <div className="mt-2">
                {block.value ? <img src={block.value} alt={block.label} className="mb-2 h-28 w-full rounded object-cover" /> : null}
                <button
                  type="button"
                  className="rounded border border-white/20 px-3 py-1 text-sm hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => handleBlockImageUpload(selectedCustomizationPage, block)}
                  disabled={siteSaving}
                >
                  Upload / Replace Image
                </button>
              </div>
            ) : (
              <textarea
                className="mt-2 w-full rounded-md border border-white/20 bg-black/20 p-2"
                rows={3}
                value={block.value}
                onChange={(e) => updatePageBlockLocal(selectedCustomizationPage, block.key, { value: e.target.value })}
              />
            )}
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
            getPageBlocks(selectedCustomizationPage),
            `${selectedCustomizationPage.charAt(0).toUpperCase() + selectedCustomizationPage.slice(1)} content saved successfully.`
          )
        }
        disabled={siteSaving || siteLoading}
      >
        {siteSaving ? "Saving..." : `Save ${selectedCustomizationPage.charAt(0).toUpperCase() + selectedCustomizationPage.slice(1)} Content`}
      </button>
    </div>
  );
}

export default CustomizationContentTab;
