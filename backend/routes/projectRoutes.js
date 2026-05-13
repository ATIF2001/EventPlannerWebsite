const express = require("express");
const { body } = require("express-validator");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { s3Upload } = require("../config/s3");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  createProjectHandler,
  listProjectsHandler,
  getProjectBySlugHandler,
  updateProjectHandler,
  deleteProjectHandler,
} = require("../controllers/projectController");

const router = express.Router();

const uploadFields = s3Upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 30 },
]);

const projectValidation = [
  body("title").trim().isLength({ min: 3, max: 255 }).withMessage("Title is required"),
  body("category").trim().isIn(["corporate", "wedding", "outdoor", "coporate"]).withMessage("Category is required"),
  body("description").trim().isLength({ min: 10, max: 3000 }).withMessage("Description is required"),
  body("slug").optional().trim().isLength({ min: 3, max: 255 }),
  body("isPublished").optional().isBoolean().toBoolean(),
];

router.get("/admin/all", protect, requireRole("admin"), listProjectsHandler);
router.get("/", listProjectsHandler);
router.get("/:slug", getProjectBySlugHandler);
router.post("/", protect, requireRole("admin"), uploadFields, projectValidation, validateRequest, createProjectHandler);
router.put("/:id", protect, requireRole("admin"), uploadFields, projectValidation, validateRequest, updateProjectHandler);
router.delete("/:id", protect, requireRole("admin"), deleteProjectHandler);

module.exports = router;
