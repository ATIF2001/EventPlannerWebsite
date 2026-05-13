const { validationResult } = require("express-validator");
const { createSlug } = require("../utils/slug");
const { getFileUrl } = require("../config/s3");
const {
  createProject,
  updateProject,
  listProjects,
  getProjectBySlug,
  getProjectById,
  deleteProject,
} = require("../models/projectModel");

const allowedCategories = new Set(["corporate", "wedding", "outdoor"]);

function parseImageUrls(rawImages) {
  if (!rawImages) return [];
  if (Array.isArray(rawImages)) return rawImages.filter(Boolean);
  try {
    const parsed = JSON.parse(rawImages);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_) {
    // ignore
  }
  return String(rawImages)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeCategory(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "coporate" ? "corporate" : normalized;
}

async function createProjectHandler(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const category = normalizeCategory(req.body.category);
    if (!allowedCategories.has(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const coverFromUpload = getFileUrl(req.files?.coverImage?.[0]);
    const coverImage = coverFromUpload || req.body.coverImage || null;
    const uploadedGallery = (req.files?.galleryImages || []).map((file) => getFileUrl(file)).filter(Boolean);
    const galleryImages = uploadedGallery.length ? uploadedGallery : parseImageUrls(req.body.galleryImages);
    const slug = req.body.slug ? createSlug(req.body.slug) : createSlug(req.body.title);

    const project = await createProject({
      title: req.body.title,
      slug,
      category,
      description: req.body.description,
      coverImage,
      galleryImages,
      isPublished: req.body.isPublished === "true" || req.body.isPublished === true,
    });

    return res.status(201).json(project);
  } catch (error) {
    return next(error);
  }
}

async function listProjectsHandler(req, res, next) {
  try {
    const includeUnpublished = req.path.includes("/admin/");
    const category = req.query.category ? normalizeCategory(req.query.category) : undefined;
    const projects = await listProjects({ category, includeUnpublished });
    return res.json(projects);
  } catch (error) {
    return next(error);
  }
}

async function getProjectBySlugHandler(req, res, next) {
  try {
    const project = await getProjectBySlug(req.params.slug);
    if (!project || !project.isPublished) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json(project);
  } catch (error) {
    return next(error);
  }
}

async function updateProjectHandler(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const existing = await getProjectById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Project not found" });

    const category = normalizeCategory(req.body.category);
    if (!allowedCategories.has(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const coverFromUpload = getFileUrl(req.files?.coverImage?.[0]);
    const coverImage = coverFromUpload || req.body.coverImage || existing.coverImage;
    const uploadedGallery = (req.files?.galleryImages || []).map((file) => getFileUrl(file)).filter(Boolean);
    const fallbackGallery = parseImageUrls(req.body.galleryImages);
    const slug = req.body.slug ? createSlug(req.body.slug) : createSlug(req.body.title);

    const project = await updateProject(req.params.id, {
      title: req.body.title,
      slug,
      category,
      description: req.body.description,
      coverImage,
      galleryImages: uploadedGallery.length ? uploadedGallery : fallbackGallery.length ? fallbackGallery : existing.galleryImages,
      isPublished: req.body.isPublished === "true" || req.body.isPublished === true,
    });

    return res.json(project);
  } catch (error) {
    return next(error);
  }
}

async function deleteProjectHandler(req, res, next) {
  try {
    const deleted = await deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    return res.json({ message: "Project deleted" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProjectHandler,
  listProjectsHandler,
  getProjectBySlugHandler,
  updateProjectHandler,
  deleteProjectHandler,
};
