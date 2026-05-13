import { useEffect, useMemo, useState } from "react";
import { fetchPublicSiteSettings } from "../services/api";

export function useSiteContent() {
  const [settings, setSettings] = useState(null);
  const [blocks, setBlocks] = useState([]);

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

    refresh(true);

    const intervalId = setInterval(() => {
      refresh(false);
    }, 60 * 1000);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        refresh(true);
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      mounted = false;
      clearInterval(intervalId);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, []);

  const map = useMemo(() => {
    const m = new Map();
    blocks.forEach((b) => m.set(b.key, b.value));
    return m;
  }, [blocks]);

  function getText(key, fallback) {
    return map.get(key) || fallback;
  }

  function getImage(key, fallback) {
    return map.get(key) || fallback;
  }

  return { settings, blocks, getText, getImage };
}
