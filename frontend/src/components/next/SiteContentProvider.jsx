"use client";

import { createContext, useContext, useMemo } from "react";

const SiteContentContext = createContext({ settings: null, blocks: [] });

export function SiteContentProvider({ initialSettings = null, initialBlocks = [], children }) {
  const value = useMemo(
    () => ({ settings: initialSettings, blocks: Array.isArray(initialBlocks) ? initialBlocks : [] }),
    [initialSettings, initialBlocks]
  );
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContentContext() {
  return useContext(SiteContentContext);
}
