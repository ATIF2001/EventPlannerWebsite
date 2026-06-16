import { SITE_URL } from "../config/site";
import { fetchBlogsServer, fetchProjectsServer } from "./lib/seo";

export default async function sitemap() {
  const now = new Date();
  const base = [
    "",
    "/about-us",
    "/blogs",
    "/contact-us",
    "/terms-and-conditions",
    "/projects/Corporate",
    "/projects/Wedding",
    "/projects/Outdoor",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const [blogs, corporate, wedding, outdoor] = await Promise.all([
    fetchBlogsServer(),
    fetchProjectsServer("corporate"),
    fetchProjectsServer("wedding"),
    fetchProjectsServer("outdoor"),
  ]);

  const blogUrls = blogs.map((b) => ({
    url: `${SITE_URL}/blogs/${b.slug}`,
    lastModified: b.updatedAt || b.createdAt || now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const projectUrls = [...corporate, ...wedding, ...outdoor].map((p) => ({
    url: `${SITE_URL}/projects/${p.category}/${p.slug}`,
    lastModified: p.updatedAt || p.createdAt || now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...base, ...blogUrls, ...projectUrls];
}

