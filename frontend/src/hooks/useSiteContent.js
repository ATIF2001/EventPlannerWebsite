"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchPublicSiteSettings } from "../services/api";
import { useSiteContentContext } from "../components/next/SiteContentProvider";

export function useSiteContent() {
  const context = useSiteContentContext();
  const [settings, setSettings] = useState(context?.settings || null);
  const [blocks, setBlocks] = useState(Array.isArray(context?.blocks) ? context.blocks : []);

  useEffect(() => {
    let mounted = true;

    const applyData = (data) => {
      if (!mounted) return;
      setSettings(data?.settings || null);
      setBlocks(Array.isArray(data?.blocks) ? data.blocks : []);
    };

    const refresh = (force = false) => {
      fetchPublicSiteSettings({ force })
        .then(applyData)
        .catch(() => {});
    };

    // Only fetch once on client if server-seeded data is missing.
    if (!settings || blocks.length === 0) {
      refresh(true);
    }

    return () => {
      mounted = false;
    };
  }, [settings, blocks.length]);

  const map = useMemo(() => {
    const m = new Map();
    blocks.forEach((b) => m.set(b.key, b.value));
    return m;
  }, [blocks]);

  function getText(key, fallback) {
    return map.get(key) || fallback;
  }

  function getImage(key, fallback) {
    const value = map.get(key) || fallback;
    if (value && typeof value === "object" && typeof value.src === "string") {
      return value.src;
    }
    return value;
  }

  return { settings, blocks, getText, getImage };
}

