const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const parsed = new URL(raw);
    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const SITE_NAME = "MK Wedding Planner";
export const DEFAULT_TITLE = "MK Wedding Planner | Luxury Events in UAE";
export const DEFAULT_DESCRIPTION =
  "MK Wedding Planner creates bespoke weddings, corporate events, and outdoor celebrations across the UAE.";
export const DEFAULT_IMAGE = "/logo192.png";
