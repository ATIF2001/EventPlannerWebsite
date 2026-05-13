"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import CropImageModal from "../components/admin/CropImageModal";
import CustomizationContentTab from "../components/admin/CustomizationContentTab";
import SeoTab from "../components/admin/SeoTab";
import {
  defaultSiteSettings,
  emptyForm,
  emptyProjectForm,
  fontOptions,
  HERO_IMAGE_ASPECT,
  pageCustomizationTemplates,
  quillFormats,
  seoCustomizationTemplates,
} from "../components/admin/adminConfig";
import { getCroppedImageFile } from "../utils/imageCrop";
import { createSlug } from "../utils/slug";
import {
  createBlog,
  createProject,
  deleteBlog,
  deleteProject,
  fetchAllBlogsAdmin,
  fetchProjects,
  updateBlog,
  updateProject,
  uploadImage,
  fetchAdminSiteSettings,
  updateAdminSiteSettings,
  upsertSiteContentBlock,
} from "../services/api";
import { logoutAdmin } from "../utils/auth";
import Seo from "../components/Seo";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

function AdminDashboardPage() {
  const navigate = useRouter();
  const quillRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [featuredUploading, setFeaturedUploading] = useState(false);
  const [editorImageUploading, setEditorImageUploading] = useState(false);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [projects, setProjects] = useState([]);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [projectCoverUploading, setProjectCoverUploading] = useState(false);
  const [projectGalleryUploading, setProjectGalleryUploading] = useState(false);
  const [activePanel, setActivePanel] = useState("blogs");
  const [dragIndex, setDragIndex] = useState(null);
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [siteBlocks, setSiteBlocks] = useState([]);
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteSaving, setSiteSaving] = useState(false);
  const [siteMessage, setSiteMessage] = useState("");
  const [siteError, setSiteError] = useState("");
  const [actionLocks, setActionLocks] = useState({});
  const [activeCustomizationTab, setActiveCustomizationTab] = useState("global");
  const [selectedCustomizationPage, setSelectedCustomizationPage] = useState("home");
  const [selectedSeoPage, setSelectedSeoPage] = useState("home");
  const lastActionAtRef = useRef({});
  const [cropState, setCropState] = useState({
    open: false,
    imageSrc: "",
    block: null,
    pageKey: "",
    aspect: HERO_IMAGE_ASPECT,
  });

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: () => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              setEditorImageUploading(true);
              setError("");
              try {
                const result = await uploadImage(file);
                const editor = quillRef.current?.getEditor();
                if (editor) {
                  const range = editor.getSelection(true);
                  editor.insertEmbed(range ? range.index : 0, "image", result.url, "user");
                  editor.setSelection((range ? range.index : 0) + 1);
                }
              } catch (err) {
                setError(err?.response?.data?.message || "Failed to upload editor image");
              } finally {
                setEditorImageUploading(false);
              }
            };
          },
        },
      },
    }),
    []
  );

  const isEdit = useMemo(() => Boolean(form.id), [form.id]);
  const isProjectEdit = useMemo(() => Boolean(projectForm.id), [projectForm.id]);

  async function loadBlogs() {
    setLoading(true);
    setError("");
    try {
      const items = await fetchAllBlogsAdmin();
      setBlogs(items);
    } catch (err) {
      setError("No blogs available");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlogs();
    loadProjects();
    loadSiteCustomization();
  }, []);

  useEffect(() => {
    if (!siteMessage && !siteError) return undefined;
    const timeoutId = setTimeout(() => {
      setSiteMessage("");
      setSiteError("");
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [siteMessage, siteError]);

  async function loadProjects() {
    setProjectLoading(true);
    setProjectError("");
    try {
      const items = await fetchProjects({ includeUnpublished: true });
      setProjects(items);
    } catch (err) {
      setProjectError("No projects available");
      setProjects([]);
    } finally {
      setProjectLoading(false);
    }
  }

  async function loadSiteCustomization() {
    // Loads both global settings and dynamic per-page content blocks.
    setSiteLoading(true);
    setSiteError("");
    try {
      const data = await fetchAdminSiteSettings();
      setSiteSettings((prev) => ({ ...prev, ...(data?.settings || {}) }));
      setSiteBlocks(Array.isArray(data?.blocks) ? data.blocks : []);
    } catch (err) {
      setSiteError(err?.response?.data?.message || "Failed to load website customization");
    } finally {
      setSiteLoading(false);
    }
  }

  async function handleSaveSiteSettings(event) {
    event.preventDefault();
    setSiteSaving(true);
    setSiteError("");
    setSiteMessage("");
    try {
      const updated = await updateAdminSiteSettings(siteSettings);
      setSiteSettings((prev) => ({ ...prev, ...(updated || {}) }));
      setSiteMessage("Website settings saved successfully.");
    } catch (err) {
      setSiteError(err?.response?.data?.message || "Failed to save website settings");
    } finally {
      setSiteSaving(false);
    }
  }

  async function handleSaveBlock(block) {
    // Per-block save is still used by image crop upload flow to persist one block immediately.
    const actionKey = `save-block:${block.key}`;
    const now = Date.now();
    const last = lastActionAtRef.current[actionKey] || 0;
    if (actionLocks[actionKey] || now - last < 1200) {
      setSiteMessage("Please wait, previous request is still processing.");
      return;
    }
    lastActionAtRef.current[actionKey] = now;
    setActionLocks((prev) => ({ ...prev, [actionKey]: true }));
    setSiteError("");
    setSiteMessage(`Saving ${block.label}...`);
    try {
      const updated = await upsertSiteContentBlock(block);
      setSiteBlocks((prev) => {
        const next = [...prev];
        const idx = next.findIndex((item) => item.key === updated.key);
        if (idx >= 0) next[idx] = updated;
        else next.push(updated);
        return next;
      });
      setSiteMessage(`Saved block: ${updated.label}`);
    } catch (err) {
      setSiteError(err?.response?.data?.message || "Failed to save content block");
    } finally {
      setActionLocks((prev) => ({ ...prev, [actionKey]: false }));
    }
  }

  async function handleSaveBlocksBatch(blocks, successMessage) {
    // Batch save for tab-level actions (Page Content / SEO).
    if (!Array.isArray(blocks) || blocks.length === 0) return;
    setSiteSaving(true);
    setSiteError("");
    setSiteMessage("Saving...");
    try {
      const updatedBlocks = await Promise.all(
        blocks.map((block) =>
          upsertSiteContentBlock({
            ...block,
            isPublished: true,
          })
        )
      );
      setSiteBlocks((prev) => {
        const next = [...prev];
        updatedBlocks.forEach((updated) => {
          const idx = next.findIndex((item) => item.key === updated.key);
          if (idx >= 0) next[idx] = updated;
          else next.push(updated);
        });
        return next;
      });
      setSiteMessage(successMessage);
    } catch (err) {
      setSiteError(err?.response?.data?.message || "Failed to save updates");
    } finally {
      setSiteSaving(false);
    }
  }

  function getPageBlocks(pageKey) {
    // Merge DB values on top of template defaults so the editor always renders complete fields.
    const templates = pageCustomizationTemplates[pageKey] || [];
    return templates.map((template) => {
      const existing = siteBlocks.find((block) => block.key === template.key);
      return existing ? { ...existing } : { ...template };
    });
  }

  function updatePageBlockLocal(pageKey, blockKey, patch) {
    const templates = pageCustomizationTemplates[pageKey] || [];
    const fallback = templates.find((t) => t.key === blockKey);
    setSiteBlocks((prev) => {
      const idx = prev.findIndex((item) => item.key === blockKey);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...patch };
        return next;
      }
      if (!fallback) return prev;
      return [...prev, { ...fallback, ...patch }];
    });
  }

  function getSeoBlocks(pageKey) {
    // Same merge strategy for SEO templates.
    const templates = seoCustomizationTemplates[pageKey] || [];
    return templates.map((template) => {
      const existing = siteBlocks.find((block) => block.key === template.key);
      return existing ? { ...existing } : { ...template };
    });
  }

  async function handleBlockImageUpload(pageKey, block) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setCropState({
          open: true,
          imageSrc: String(reader.result || ""),
          block,
          pageKey,
          aspect: block.key.includes("hero.image") ? HERO_IMAGE_ASPECT : 4 / 3,
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  async function handleCropConfirm(croppedAreaPixels) {
    // Crop + upload + immediate save for image fields; hero images are normalized to banner dimensions.
    if (!cropState.imageSrc || !cropState.block || !cropState.pageKey || !croppedAreaPixels) {
      setCropState({ open: false, imageSrc: "", block: null, pageKey: "", aspect: HERO_IMAGE_ASPECT });
      return;
    }
    setSiteSaving(true);
    setSiteError("");
    setSiteMessage("");
    try {
      const isHeroImage = cropState.block.key.includes("hero.image");
      const croppedFile = await getCroppedImageFile(
        cropState.imageSrc,
        croppedAreaPixels,
        `${cropState.block.key}.jpg`,
        isHeroImage ? { width: 1920, height: 800 } : undefined
      );
      const uploaded = await uploadImage(croppedFile);
      const next = { ...cropState.block, value: uploaded?.url || "" };
      updatePageBlockLocal(cropState.pageKey, cropState.block.key, { value: next.value });
      await handleSaveBlock(next);
      setSiteMessage(isHeroImage ? "Hero image cropped and saved at 1920x800." : "Image cropped and saved.");
    } catch (err) {
      setSiteError(err?.response?.data?.message || "Failed to crop/upload image");
    } finally {
      setSiteSaving(false);
      setCropState({ open: false, imageSrc: "", block: null, pageKey: "", aspect: HERO_IMAGE_ASPECT });
    }
  }

  function handleSiteLogoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSiteSaving(true);
    setSiteError("");
    setSiteMessage("");
    uploadImage(file)
      .then((result) => {
        setSiteSettings((prev) => ({ ...prev, logoUrl: result?.url || "" }));
        setSiteMessage("Logo uploaded. Click save to publish.");
      })
      .catch((err) => {
        setSiteError(err?.response?.data?.message || "Failed to upload logo");
      })
      .finally(() => {
        setSiteSaving(false);
        event.target.value = "";
      });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("slug", form.slug || createSlug(form.title));
      payload.append("description", form.description);
      payload.append("content", form.content);
      payload.append("tags", form.tags);
      payload.append("isPublished", String(form.isPublished));
      if (form.featuredImage) payload.append("featuredImage", form.featuredImage);

      if (isEdit) await updateBlog(form.id, payload);
      else await createBlog(payload);

      setForm(emptyForm);
      await loadBlogs();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(blog) {
    setForm({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      description: blog.description,
      content: blog.content,
      tags: (blog.tags || []).join(", "),
      isPublished: blog.isPublished,
      featuredImage: blog.featuredImage || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this blog?")) return;
    await deleteBlog(id);
    await loadBlogs();
  }

  async function handleTogglePublish(blog) {
    const payload = new FormData();
    payload.append("title", blog.title);
    payload.append("slug", blog.slug);
    payload.append("description", blog.description);
    payload.append("content", blog.content);
    payload.append("tags", (blog.tags || []).join(","));
    payload.append("isPublished", String(!blog.isPublished));
    await updateBlog(blog.id, payload);
    await loadBlogs();
  }

  async function handleFeaturedImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFeaturedUploading(true);
    setError("");
    try {
      const result = await uploadImage(file);
      setForm((prev) => ({ ...prev, featuredImage: result.url }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload featured image");
    } finally {
      setFeaturedUploading(false);
      event.target.value = "";
    }
  }

  async function handleProjectSubmit(event) {
    event.preventDefault();
    setProjectSaving(true);
    setProjectError("");
    try {
      const payload = new FormData();
      payload.append("title", projectForm.title);
      payload.append("slug", projectForm.slug || createSlug(projectForm.title));
      payload.append("category", projectForm.category);
      payload.append("description", projectForm.description);
      payload.append("isPublished", String(projectForm.isPublished));
      if (projectForm.coverImage) payload.append("coverImage", projectForm.coverImage);
      payload.append("galleryImages", JSON.stringify(projectForm.galleryImages));

      if (isProjectEdit) await updateProject(projectForm.id, payload);
      else await createProject(payload);

      setProjectForm(emptyProjectForm);
      await loadProjects();
    } catch (err) {
      setProjectError(err?.response?.data?.message || "Failed to save project");
    } finally {
      setProjectSaving(false);
    }
  }

  function handleProjectEdit(project) {
    setProjectForm({
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: project.category,
      description: project.description,
      isPublished: project.isPublished,
      coverImage: project.coverImage || "",
      galleryImages: project.galleryImages || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleProjectDelete(id) {
    if (!window.confirm("Delete this project?")) return;
    await deleteProject(id);
    await loadProjects();
  }

  async function handleProjectTogglePublish(project) {
    const payload = new FormData();
    payload.append("title", project.title);
    payload.append("slug", project.slug);
    payload.append("category", project.category);
    payload.append("description", project.description);
    payload.append("isPublished", String(!project.isPublished));
    payload.append("coverImage", project.coverImage || "");
    payload.append("galleryImages", JSON.stringify(project.galleryImages || []));
    await updateProject(project.id, payload);
    await loadProjects();
  }

  async function handleProjectCoverUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProjectCoverUploading(true);
    setProjectError("");
    try {
      const result = await uploadImage(file);
      setProjectForm((prev) => ({ ...prev, coverImage: result.url }));
    } catch (err) {
      setProjectError(err?.response?.data?.message || "Failed to upload cover image");
    } finally {
      setProjectCoverUploading(false);
      event.target.value = "";
    }
  }

  async function handleProjectGalleryUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setProjectGalleryUploading(true);
    setProjectError("");
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImage(file)));
      const urls = uploaded.map((item) => item.url).filter(Boolean);
      setProjectForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, ...urls] }));
    } catch (err) {
      setProjectError(err?.response?.data?.message || "Failed to upload gallery images");
    } finally {
      setProjectGalleryUploading(false);
      event.target.value = "";
    }
  }

  function moveGalleryImage(fromIndex, toIndex) {
    setProjectForm((prev) => {
      if (toIndex < 0 || toIndex >= prev.galleryImages.length) return prev;
      const next = [...prev.galleryImages];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...prev, galleryImages: next };
    });
  }

  function handleGalleryDragStart(index) {
    setDragIndex(index);
  }

  function handleGalleryDrop(dropIndex) {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      return;
    }
    moveGalleryImage(dragIndex, dropIndex);
    setDragIndex(null);
  }

  return (
    <>
      <style>{`
        .ql-toolbar { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.2) !important; border-radius: 8px 8px 0 0 !important; }
        .ql-toolbar .ql-stroke { stroke: rgba(255,255,255,0.7) !important; }
        .ql-toolbar .ql-fill { fill: rgba(255,255,255,0.7) !important; }
        .ql-toolbar .ql-picker { color: rgba(255,255,255,0.7) !important; }
        .ql-toolbar .ql-picker-options { background: #0e1117 !important; border-color: rgba(255,255,255,0.2) !important; }
        .ql-toolbar button:hover .ql-stroke, .ql-toolbar .ql-active .ql-stroke { stroke: #ffffff !important; }
        .ql-toolbar button:hover .ql-fill, .ql-toolbar .ql-active .ql-fill { fill: #ffffff !important; }
        .ql-container { background: #0e1117 !important; border-color: rgba(255,255,255,0.2) !important; border-radius: 0 0 8px 8px !important; min-height: 280px; }
        .ql-editor { color: white !important; min-height: 280px; font-size: 15px; line-height: 1.7; }
        .ql-editor.ql-blank::before { color: rgba(255,255,255,0.35) !important; font-style: normal; }
        .ql-editor h1, .ql-editor h2, .ql-editor h3 { color: white !important; }
        .ql-editor a { color: #60a5fa !important; }
        .ql-editor blockquote { border-left-color: rgba(255,255,255,0.3) !important; color: rgba(255,255,255,0.7) !important; }
        .ql-editor code, .ql-editor pre { background: rgba(255,255,255,0.08) !important; color: #e2e8f0 !important; border-radius: 4px; }
      `}</style>

      <main className="min-h-screen bg-[#05070b] px-6 pb-20 pt-52 text-white md:px-12">
        <Seo title="Admin Dashboard | MK Wedding Planner" path="/admin" noindex />
        <div className="mx-auto w-full max-w-[1400px]">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
            <h1 className="text-4xl font-semibold md:text-5xl">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg border border-white/20 px-5 py-2.5 hover:bg-white/10 transition"
                onClick={() => { logoutAdmin(); navigate.push("/login"); }}
                type="button"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <nav className="space-y-2">
                <button
                  type="button"
                  onClick={() => setActivePanel("blogs")}
                  className={`w-full rounded-lg px-4 py-3 text-left transition ${
                    activePanel === "blogs" ? "bg-white text-black" : "bg-black/20 text-white/85 hover:bg-white/10"
                  }`}
                >
                  Blog Management
                </button>
                <button
                  type="button"
                  onClick={() => setActivePanel("projects")}
                  className={`w-full rounded-lg px-4 py-3 text-left transition ${
                    activePanel === "projects" ? "bg-white text-black" : "bg-black/20 text-white/85 hover:bg-white/10"
                  }`}
                >
                  Project Management
                </button>
                <button
                  type="button"
                  onClick={() => setActivePanel("customization")}
                  className={`w-full rounded-lg px-4 py-3 text-left transition ${
                    activePanel === "customization" ? "bg-white text-black" : "bg-black/20 text-white/85 hover:bg-white/10"
                  }`}
                >
                  Website Customization
                </button>
                <button
                  type="button"
                  onClick={() => setActivePanel("seo")}
                  className={`w-full rounded-lg px-4 py-3 text-left transition ${
                    activePanel === "seo" ? "bg-white text-black" : "bg-black/20 text-white/85 hover:bg-white/10"
                  }`}
                >
                  SEO
                </button>
                <button
                  type="button"
                  onClick={() => setActivePanel("analytics")}
                  className={`hidden w-full rounded-lg px-4 py-3 text-left transition ${
                    activePanel === "analytics" ? "bg-white text-black" : "bg-black/20 text-white/85 hover:bg-white/10"
                  }`}
                >
                  Analytics
                </button>
              </nav>
            </aside>

            <section>
          <div className={`${activePanel === "blogs" ? "grid" : "hidden"} items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]`}>

            {/* Form */}
            <form
              className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10 lg:h-full"
              onSubmit={handleSubmit}
            >
              <h2 className="text-3xl font-semibold">{isEdit ? "Edit Blog" : "Create Blog"}</h2>

              <input
                className="w-full rounded-lg border border-white/20 bg-black/20 p-3 outline-none focus:border-white/40"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                    slug: createSlug(e.target.value),
                  }))
                }
                required
              />

              <input
                className="w-full rounded-lg border border-white/20 bg-black/20 p-3 outline-none focus:border-white/40"
                placeholder="Slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: createSlug(e.target.value) }))
                }
                required
              />

              <textarea
                className="w-full rounded-lg border border-white/20 bg-black/20 p-3 outline-none focus:border-white/40"
                placeholder="Short description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                required
              />

              {/* ReactQuill Editor */}
              <div>
                <label className="mb-2 block text-sm text-white/80">Content</label>
                {editorImageUploading ? (
                  <p className="mb-2 text-xs text-white/70">Uploading editor image...</p>
                ) : null}
                <div className="rounded-lg border border-white/20 overflow-hidden">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={form.content || ""}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, content: value }))
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Start writing your blog..."
                  />
                </div>
              </div>

              <input
                className="w-full rounded-lg border border-white/20 bg-black/20 p-3 outline-none focus:border-white/40"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tags: e.target.value }))
                }
              />

              {/* Title Image */}
              <div>
                <label className="mb-2 block text-sm text-white/80">Title Image</label>
                <input
                  id="title-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFeaturedImageUpload}
                />
                <label
                  htmlFor="title-image"
                  className="inline-flex cursor-pointer items-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm transition hover:border-white/40 hover:bg-white/10"
                >
                  {featuredUploading ? "Uploading..." : "Choose title image"}
                </label>
                {form.featuredImage ? (
                  <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
                    <img src={form.featuredImage} alt="Title preview" className="h-28 w-40 rounded object-cover" />
                    <button
                      type="button"
                      className="mt-2 rounded border border-red-400/60 px-3 py-1 text-xs text-red-300"
                      onClick={() => setForm((prev) => ({ ...prev, featuredImage: "" }))}
                    >
                      Remove
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Publish toggle */}
              <label className="inline-flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isPublished: e.target.checked }))
                  }
                  className="h-4 w-4 accent-white"
                />
                <span className="text-sm text-white/80">Publish immediately</span>
              </label>

              {error && <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  className="rounded-lg bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
                  disabled={saving}
                  type="submit"
                >
                  {saving ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/20 px-6 py-2.5 transition hover:bg-white/10"
                  onClick={() => setForm(emptyForm)}
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Blog list */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10 lg:flex lg:max-h-[calc(100vh-220px)] lg:flex-col lg:overflow-hidden">
              <h2 className="text-3xl font-semibold">Blog Management</h2>
              {loading && <p className="mt-4 text-white/70">Loading blogs...</p>}
              <div className="mt-6 space-y-4 lg:flex-1 lg:overflow-y-auto lg:pr-2">
                {blogs.map((blog) => (
                  <div key={blog.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                    {blog.featuredImage && (
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="mb-3 h-36 w-full rounded-lg object-cover"
                      />
                    )}
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <p className="text-lg font-semibold">{blog.title}</p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-xs ${
                          blog.isPublished
                            ? "bg-emerald-600/30 text-emerald-200"
                            : "bg-amber-600/30 text-amber-200"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-white/70">/{blog.slug}</p>
                    <p className="mt-1 text-xs text-white/60">
                      {new Date(blog.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className="rounded border border-white/20 px-3 py-1 text-sm transition hover:bg-white/10"
                        onClick={() => handleEdit(blog)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded border border-red-400/60 px-3 py-1 text-sm text-red-300 transition hover:bg-red-400/10"
                        onClick={() => handleDelete(blog.id)}
                        type="button"
                      >
                        Delete
                      </button>
                      <button
                        className="rounded border border-white/20 px-3 py-1 text-sm transition hover:bg-white/10"
                        onClick={() => handleTogglePublish(blog)}
                        type="button"
                      >
                        {blog.isPublished ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  </div>
                ))}
                {!loading && blogs.length === 0 && (
                  <p className="text-white/70">No blogs yet.</p>
                )}
              </div>
            </section>

          </div>

          <div className={`${activePanel === "projects" ? "grid" : "hidden"} items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]`}>
            <form
              className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10 lg:h-full"
              onSubmit={handleProjectSubmit}
            >
              <h2 className="text-3xl font-semibold">{isProjectEdit ? "Edit Project" : "Create Project"}</h2>

              <input
                className="w-full rounded-lg border border-white/20 bg-black/20 p-3 outline-none focus:border-white/40"
                placeholder="Project title"
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                    slug: createSlug(e.target.value),
                  }))
                }
                required
              />

              <input
                className="w-full rounded-lg border border-white/20 bg-black/20 p-3 outline-none focus:border-white/40"
                placeholder="Project slug"
                value={projectForm.slug}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, slug: createSlug(e.target.value) }))
                }
                required
              />

              <select
                className="w-full rounded-lg border border-white/20 bg-black/20 p-3 outline-none focus:border-white/40"
                value={projectForm.category}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option value="corporate">Corporate</option>
                <option value="wedding">Wedding</option>
                <option value="outdoor">Outdoor</option>
              </select>

              <textarea
                className="w-full rounded-lg border border-white/20 bg-black/20 p-3 outline-none focus:border-white/40"
                placeholder="Project description"
                rows={4}
                value={projectForm.description}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                required
              />

              <div>
                <label className="mb-2 block text-sm text-white/80">Card / Hero Image</label>
                <input
                  id="project-cover-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProjectCoverUpload}
                />
                <label
                  htmlFor="project-cover-image"
                  className="inline-flex cursor-pointer items-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm transition hover:border-white/40 hover:bg-white/10"
                >
                  {projectCoverUploading ? "Uploading..." : "Choose cover image"}
                </label>
                {projectForm.coverImage ? (
                  <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
                    <img src={projectForm.coverImage} alt="Project cover preview" className="h-28 w-40 rounded object-cover" />
                  </div>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/80">Gallery Images</label>
                <input
                  id="project-gallery-images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleProjectGalleryUpload}
                />
                <label
                  htmlFor="project-gallery-images"
                  className="inline-flex cursor-pointer items-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm transition hover:border-white/40 hover:bg-white/10"
                >
                  {projectGalleryUploading ? "Uploading..." : "Add gallery images"}
                </label>
                {projectForm.galleryImages.length > 0 ? (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {projectForm.galleryImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className={`relative rounded cursor-grab active:cursor-grabbing ${dragIndex === index ? "ring-2 ring-white/70" : ""}`}
                        draggable
                        onDragStart={() => handleGalleryDragStart(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleGalleryDrop(index)}
                        onDragEnd={() => setDragIndex(null)}
                        title="Drag to reorder"
                      >
                        <img src={image} alt={`Gallery ${index + 1}`} className="h-24 w-full rounded object-cover" />
                        <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between gap-1">
                          <span className="rounded bg-black/70 px-2 py-0.5 text-[10px]">Drag</span>
                          <button
                            type="button"
                            className="rounded bg-black/70 px-2 py-0.5 text-xs"
                            onClick={() =>
                              setProjectForm((prev) => ({ ...prev, coverImage: prev.galleryImages[index] || prev.coverImage }))
                            }
                            title="Set as cover"
                          >
                            Cover
                          </button>
                        </div>
                        <button
                          type="button"
                          className="absolute right-1 top-1 rounded bg-black/70 px-2 py-0.5 text-xs"
                          onClick={() =>
                            setProjectForm((prev) => ({
                              ...prev,
                              galleryImages: prev.galleryImages.filter((_, i) => i !== index),
                            }))
                          }
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <label className="inline-flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={projectForm.isPublished}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4 accent-white"
                />
                <span className="text-sm text-white/80">Publish immediately</span>
              </label>

              {projectError ? (
                <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">{projectError}</p>
              ) : null}

              <div className="flex gap-3 pt-2">
                <button
                  className="rounded-lg bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
                  disabled={projectSaving}
                  type="submit"
                >
                  {projectSaving ? "Saving..." : isProjectEdit ? "Update Project" : "Create Project"}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/20 px-6 py-2.5 transition hover:bg-white/10"
                  onClick={() => setProjectForm(emptyProjectForm)}
                >
                  Reset
                </button>
              </div>
            </form>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10 lg:flex lg:max-h-[calc(100vh-220px)] lg:flex-col lg:overflow-hidden">
              <h2 className="text-3xl font-semibold">Project Management</h2>
              {projectLoading ? <p className="mt-4 text-white/70">Loading projects...</p> : null}
              <div className="mt-6 space-y-4 lg:flex-1 lg:overflow-y-auto lg:pr-2">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="mb-3 h-36 w-full rounded-lg object-cover"
                      />
                    ) : null}
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <p className="text-lg font-semibold">{project.title}</p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-xs ${
                          project.isPublished
                            ? "bg-emerald-600/30 text-emerald-200"
                            : "bg-amber-600/30 text-amber-200"
                        }`}
                      >
                        {project.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-white/70">{project.category} / {project.slug}</p>
                    <p className="mt-1 text-xs text-white/60">
                      {new Date(project.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className="rounded border border-white/20 px-3 py-1 text-sm transition hover:bg-white/10"
                        onClick={() => handleProjectEdit(project)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded border border-red-400/60 px-3 py-1 text-sm text-red-300 transition hover:bg-red-400/10"
                        onClick={() => handleProjectDelete(project.id)}
                        type="button"
                      >
                        Delete
                      </button>
                      <button
                        className="rounded border border-white/20 px-3 py-1 text-sm transition hover:bg-white/10"
                        onClick={() => handleProjectTogglePublish(project)}
                        type="button"
                      >
                        {project.isPublished ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  </div>
                ))}
                {!projectLoading && projects.length === 0 ? (
                  <p className="text-white/70">No projects yet.</p>
                ) : null}
              </div>
            </section>
          </div>
          <div className={`${activePanel === "customization" ? "block" : "hidden"}`}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10">
              <h2 className="text-3xl font-semibold">Website Customization</h2>
              <p className="mt-2 text-white/70">Update required website content from one place. Changes are dynamic across all connected pages.</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCustomizationTab("global")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeCustomizationTab === "global" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Global Settings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCustomizationTab("content")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeCustomizationTab === "content" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Page Content
                </button>
              </div>

              <form className={`${activeCustomizationTab === "global" ? "mt-8" : "hidden"}`} onSubmit={handleSaveSiteSettings}>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white/85">Website Logo</label>
                  <input type="file" accept="image/*" onChange={handleSiteLogoUpload} className="block w-full rounded-lg border border-white/20 bg-black/20 p-2 text-sm" />
                  {siteSettings.logoUrl ? <img src={siteSettings.logoUrl} alt="logo preview" className="h-20 w-auto rounded bg-black/30 p-2" /> : null}

                  <label className="block text-sm font-medium text-white/85">Heading Font</label>
                  <select className="w-full rounded-lg border border-white/20 bg-black/20 p-3" value={siteSettings.headingFont} onChange={(e) => setSiteSettings((p) => ({ ...p, headingFont: e.target.value }))}>
                    {fontOptions.map((font) => <option key={font} value={font}>{font}</option>)}
                  </select>

                  <label className="block text-sm font-medium text-white/85">Paragraph Font</label>
                  <select className="w-full rounded-lg border border-white/20 bg-black/20 p-3" value={siteSettings.paragraphFont} onChange={(e) => setSiteSettings((p) => ({ ...p, paragraphFont: e.target.value }))}>
                    {fontOptions.map((font) => <option key={font} value={font}>{font}</option>)}
                  </select>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/80">Heading Weight</label>
                      <input type="number" min="100" max="900" step="100" className="w-full rounded-lg border border-white/20 bg-black/20 p-3" value={siteSettings.headingWeight} onChange={(e) => setSiteSettings((p) => ({ ...p, headingWeight: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label className="block text-sm text-white/80">Paragraph Weight</label>
                      <input type="number" min="100" max="900" step="100" className="w-full rounded-lg border border-white/20 bg-black/20 p-3" value={siteSettings.paragraphWeight} onChange={(e) => setSiteSettings((p) => ({ ...p, paragraphWeight: Number(e.target.value) }))} />
                    </div>
                  </div>
                </div>
                {siteError ? <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">{siteError}</p> : null}
                {siteMessage ? <p className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">{siteMessage}</p> : null}
                <button className="mt-6 rounded-lg bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/90 disabled:opacity-50" type="submit" disabled={siteSaving || siteLoading}>
                  {siteSaving ? "Saving..." : "Save Website Settings"}
                </button>
              </form>

              {activeCustomizationTab === "content" ? (
                <CustomizationContentTab
                  pageCustomizationTemplates={pageCustomizationTemplates}
                  selectedCustomizationPage={selectedCustomizationPage}
                  setSelectedCustomizationPage={setSelectedCustomizationPage}
                  getPageBlocks={getPageBlocks}
                  updatePageBlockLocal={updatePageBlockLocal}
                  handleBlockImageUpload={handleBlockImageUpload}
                  handleSaveBlocksBatch={handleSaveBlocksBatch}
                  siteSaving={siteSaving}
                  siteLoading={siteLoading}
                  siteError={siteError}
                  siteMessage={siteMessage}
                />
              ) : null}
            </div>
          </div>
          <div className={`${activePanel === "seo" ? "block" : "hidden"}`}>
            <SeoTab
              seoCustomizationTemplates={seoCustomizationTemplates}
              selectedSeoPage={selectedSeoPage}
              setSelectedSeoPage={setSelectedSeoPage}
              getSeoBlocks={getSeoBlocks}
              updatePageBlockLocal={updatePageBlockLocal}
              handleSaveBlocksBatch={handleSaveBlocksBatch}
              siteSaving={siteSaving}
              siteLoading={siteLoading}
              siteError={siteError}
              siteMessage={siteMessage}
            />
          </div>
          <div className={`${activePanel === "analytics" ? "block" : "hidden"}`}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10">
              <h2 className="text-3xl font-semibold">Analytics</h2>
              <p className="mt-2 text-white/70">Quick overview based on your current admin content.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm text-white/60">Total Blogs</p>
                  <p className="mt-2 text-3xl font-semibold">{blogs.length}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm text-white/60">Published Blogs</p>
                  <p className="mt-2 text-3xl font-semibold">{blogs.filter((b) => b.isPublished).length}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm text-white/60">Total Projects</p>
                  <p className="mt-2 text-3xl font-semibold">{projects.length}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm text-white/60">Published Projects</p>
                  <p className="mt-2 text-3xl font-semibold">{projects.filter((p) => p.isPublished).length}</p>
                </div>
              </div>
            </div>
          </div>
            </section>
          </div>
        </div>
      </main>
      <CropImageModal
        open={cropState.open}
        imageSrc={cropState.imageSrc}
        title={cropState.block?.key?.includes("hero.image") ? "Crop Hero Image" : "Crop Image"}
        aspect={cropState.aspect}
        onCancel={() => setCropState({ open: false, imageSrc: "", block: null, pageKey: "", aspect: HERO_IMAGE_ASPECT })}
        onConfirm={handleCropConfirm}
      />
    </>
  );
}

export default AdminDashboardPage;





