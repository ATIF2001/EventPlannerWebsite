const { validationResult } = require("express-validator");
const {
  createBlog,
  updateBlog,
  listBlogs,
  getBlogBySlug,
  getBlogById,
  deleteBlog,
} = require("../models/blogModel");
const { createSlug } = require("../utils/slug");
const { getFileUrl } = require("../config/s3");
const { sanitizeRichText } = require("../utils/sanitizeRichText");

function parseTags(rawTags) {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) return rawTags;
  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseImageUrls(rawImages) {
  if (!rawImages) return [];
  if (Array.isArray(rawImages)) return rawImages.filter(Boolean);
  try {
    const parsed = JSON.parse(rawImages);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_) {
    // ignore, fallback to comma-split
  }
  return String(rawImages)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function createBlogHandler(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const featuredImageFromUpload = getFileUrl(req.files?.featuredImage?.[0]);
    const featuredImage = featuredImageFromUpload || req.body.featuredImage || null;
    const uploadedImages = (req.files?.images || []).map((file) => getFileUrl(file)).filter(Boolean);
    const images = uploadedImages.length ? uploadedImages : parseImageUrls(req.body.images);
    const slug = req.body.slug ? createSlug(req.body.slug) : createSlug(req.body.title);

    const blog = await createBlog({
      title: req.body.title,
      slug,
      description: req.body.description,
      content: sanitizeRichText(req.body.content),
      featuredImage,
      images,
      tags: parseTags(req.body.tags),
      isPublished: req.body.isPublished === "true" || req.body.isPublished === true,
    });

    return res.status(201).json(blog);
  } catch (error) {
    return next(error);
  }
}

async function listPublishedBlogsHandler(req, res, next) {
  try {
    const includeUnpublished = req.path.includes("/admin/");
    const blogs = await listBlogs({ includeUnpublished });
    return res.json(blogs);
  } catch (error) {
    return next(error);
  }
}

async function getBlogBySlugHandler(req, res, next) {
  try {
    const blog = await getBlogBySlug(req.params.slug);
    if (!blog || !blog.isPublished) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.json(blog);
  } catch (error) {
    return next(error);
  }
}

async function updateBlogHandler(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const existing = await getBlogById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Blog not found" });

    const featuredImageFromUpload = getFileUrl(req.files?.featuredImage?.[0]);
    const featuredImage = featuredImageFromUpload || req.body.featuredImage || existing.featuredImage;
    const uploadedImages = (req.files?.images || []).map((file) => getFileUrl(file)).filter(Boolean);
    const slug = req.body.slug ? createSlug(req.body.slug) : createSlug(req.body.title);

    const blog = await updateBlog(req.params.id, {
      title: req.body.title,
      slug,
      description: req.body.description,
      content: sanitizeRichText(req.body.content),
      featuredImage,
      images: uploadedImages.length ? uploadedImages : parseImageUrls(req.body.images).length ? parseImageUrls(req.body.images) : existing.images,
      tags: parseTags(req.body.tags),
      isPublished: req.body.isPublished === "true" || req.body.isPublished === true,
    });
    return res.json(blog);
  } catch (error) {
    return next(error);
  }
}

async function deleteBlogHandler(req, res, next) {
  try {
    const deleted = await deleteBlog(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Blog not found" });
    return res.json({ message: "Blog deleted" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createBlogHandler,
  listPublishedBlogsHandler,
  getBlogBySlugHandler,
  updateBlogHandler,
  deleteBlogHandler,
};
