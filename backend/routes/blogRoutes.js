const express = require("express");
const { body } = require("express-validator");
const {
  createBlogHandler,
  listPublishedBlogsHandler,
  getBlogBySlugHandler,
  updateBlogHandler,
  deleteBlogHandler,
} = require("../controllers/blogController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { s3Upload } = require("../config/s3");
const { validateRequest } = require("../middleware/validationMiddleware");

const router = express.Router();

const uploadFields = s3Upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "images", maxCount: 20 },
]);

const blogValidation = [
  body("title").trim().isLength({ min: 3, max: 255 }).withMessage("Title is required"),
  body("description").trim().isLength({ min: 10, max: 2000 }).withMessage("Description is required"),
  body("content").trim().isLength({ min: 20 }).withMessage("Content is required"),
  body("slug").optional().trim().isLength({ min: 3, max: 255 }),
  body("isPublished").optional().isBoolean().toBoolean(),
  body("tags").optional().trim().isLength({ max: 500 }),
];

router.get("/admin/all", protect, requireRole("admin"), listPublishedBlogsHandler);
router.get("/", listPublishedBlogsHandler);
router.get("/:slug", getBlogBySlugHandler);
router.post("/", protect, requireRole("admin"), uploadFields, blogValidation, validateRequest, createBlogHandler);
router.put("/:id", protect, requireRole("admin"), uploadFields, blogValidation, validateRequest, updateBlogHandler);
router.delete("/:id", protect, requireRole("admin"), deleteBlogHandler);

module.exports = router;
