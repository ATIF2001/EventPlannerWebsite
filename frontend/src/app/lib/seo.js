import { SITE_NAME, SITE_URL, DEFAULT_IMAGE } from "../../config/site";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchPublicSettingsServer() {
  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/public`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { settings: null, blocks: [] };
    const data = await res.json();
    return {
      settings: data?.settings || null,
      blocks: Array.isArray(data?.blocks) ? data.blocks : [],
    };
  } catch {
    return { settings: null, blocks: [] };
  }
}

export function getBlockText(blocks, key, fallback) {
  const found = blocks.find((b) => b?.key === key)?.value;
  return found || fallback;
}

export async function buildPageMetadata({ path, titleKey, descriptionKey, keywordsKey, defaults, image = DEFAULT_IMAGE, noindex = false }) {
  const { blocks } = await fetchPublicSettingsServer();
  const title = getBlockText(blocks, titleKey, defaults.title);
  const description = getBlockText(blocks, descriptionKey, defaults.description);
  const keywords = getBlockText(blocks, keywordsKey, defaults.keywords || "");
  const canonical = `${SITE_URL}${path}`;
  const imageUrl = String(image || DEFAULT_IMAGE).startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_AE",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@mk.4events",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function fetchBlogsServer() {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchBlogBySlugServer(slug) {
  if (!slug) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchProjectsServer(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  try {
    const res = await fetch(`${API_BASE_URL}/projects${query}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchProjectBySlugServer(slug) {
  if (!slug) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

