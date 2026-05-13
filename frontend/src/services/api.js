import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const API_ROUTES = {
  authLogin: "/auth/login",
  blogs: "/blogs",
  blogsAdminAll: "/blogs/admin/all",
  uploadsImage: "/uploads/image",
  contact: "/contact",
  projects: "/projects",
  projectsAdminAll: "/projects/admin/all",
  siteSettingsPublic: "/site-settings/public",
  siteSettingsAdmin: "/site-settings/admin",
  siteSettingsAdminSettings: "/site-settings/admin/settings",
  siteSettingsAdminBlocks: "/site-settings/admin/blocks",
};

let activeRequests = 0;
const loadingListeners = new Set();
let publicSiteSettingsCache = null;
let publicSiteSettingsInFlight = null;
let publicSiteSettingsFetchedAt = 0;
const PUBLIC_SITE_SETTINGS_TTL_MS = 60 * 1000;

function emitApiLoading() {
  const isLoading = activeRequests > 0;
  loadingListeners.forEach((listener) => {
    try {
      listener(isLoading, activeRequests);
    } catch (_) {
      // no-op
    }
  });
}

function startRequest() {
  activeRequests += 1;
  emitApiLoading();
}

function endRequest() {
  activeRequests = Math.max(0, activeRequests - 1);
  emitApiLoading();
}

export function subscribeApiLoading(listener) {
  if (typeof listener !== "function") return () => {};
  loadingListeners.add(listener);
  listener(activeRequests > 0, activeRequests);
  return () => loadingListeners.delete(listener);
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  startRequest();
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  endRequest();
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  endRequest();
  return response;
}, (error) => {
  endRequest();
  return Promise.reject(error);
});

export async function loginAdmin(payload) {
  const { data } = await api.post(API_ROUTES.authLogin, payload);
  return data;
}

export async function fetchPublishedBlogs() {
  const { data } = await api.get(API_ROUTES.blogs);
  return data;
}

export async function fetchAllBlogsAdmin() {
  const { data } = await api.get(API_ROUTES.blogsAdminAll);
  return data;
}

export async function fetchBlogBySlug(slug) {
  const { data } = await api.get(`${API_ROUTES.blogs}/${slug}`);
  return data;
}

export async function createBlog(payload) {
  const { data } = await api.post(API_ROUTES.blogs, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateBlog(id, payload) {
  const { data } = await api.put(`${API_ROUTES.blogs}/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteBlog(id) {
  const { data } = await api.delete(`${API_ROUTES.blogs}/${id}`);
  return data;
}

export async function uploadImage(file) {
  const payload = new FormData();
  payload.append("image", file);
  const { data } = await api.post(API_ROUTES.uploadsImage, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function submitContactForm(payload) {
  const { data } = await api.post(API_ROUTES.contact, payload);
  return data;
}

export async function fetchProjects({ category, includeUnpublished = false } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  const basePath = includeUnpublished ? API_ROUTES.projectsAdminAll : API_ROUTES.projects;
  const query = params.toString();
  const { data } = await api.get(`${basePath}${query ? `?${query}` : ""}`);
  return data;
}

export async function fetchProjectBySlug(slug) {
  const { data } = await api.get(`${API_ROUTES.projects}/${slug}`);
  return data;
}

export async function createProject(payload) {
  const { data } = await api.post(API_ROUTES.projects, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateProject(id, payload) {
  const { data } = await api.put(`${API_ROUTES.projects}/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteProject(id) {
  const { data } = await api.delete(`${API_ROUTES.projects}/${id}`);
  return data;
}

export default api;

export async function fetchPublicSiteSettings({ force = false } = {}) {
  const isFresh = Date.now() - publicSiteSettingsFetchedAt < PUBLIC_SITE_SETTINGS_TTL_MS;
  if (!force && publicSiteSettingsCache && isFresh) return publicSiteSettingsCache;
  if (publicSiteSettingsInFlight) return publicSiteSettingsInFlight;
  publicSiteSettingsInFlight = api
    .get(API_ROUTES.siteSettingsPublic)
    .then(({ data }) => {
      publicSiteSettingsCache = data;
      publicSiteSettingsFetchedAt = Date.now();
      return data;
    })
    .finally(() => {
      publicSiteSettingsInFlight = null;
    });
  return publicSiteSettingsInFlight;
}

export function invalidatePublicSiteSettingsCache() {
  publicSiteSettingsCache = null;
  publicSiteSettingsInFlight = null;
  publicSiteSettingsFetchedAt = 0;
}

export async function fetchAdminSiteSettings() {
  const { data } = await api.get(API_ROUTES.siteSettingsAdmin);
  return data;
}

export async function updateAdminSiteSettings(payload) {
  const { data } = await api.put(API_ROUTES.siteSettingsAdminSettings, payload);
  invalidatePublicSiteSettingsCache();
  return data;
}

export async function upsertSiteContentBlock(payload) {
  const { data } = await api.put(API_ROUTES.siteSettingsAdminBlocks, payload);
  invalidatePublicSiteSettingsCache();
  return data;
}
