const express = require("express");
const { body } = require("express-validator");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  getPublicSettingsHandler,
  getAdminSettingsHandler,
  updateSettingsHandler,
  upsertContentBlockHandler,
} = require("../controllers/siteSettingsController");

const router = express.Router();

router.get("/public", getPublicSettingsHandler);
router.get("/admin", protect, requireRole("admin"), getAdminSettingsHandler);

router.put(
  "/admin/settings",
  protect,
  requireRole("admin"),
  [
    body("headingFont").optional().isString().isLength({ min: 2, max: 100 }),
    body("paragraphFont").optional().isString().isLength({ min: 2, max: 100 }),
    body("headingWeight").optional().isInt({ min: 100, max: 900 }),
    body("paragraphWeight").optional().isInt({ min: 100, max: 900 }),
    body("headingSizeScale").optional().isFloat({ min: 0.6, max: 2 }),
    body("paragraphSizeScale").optional().isFloat({ min: 0.6, max: 2 }),
    body("brandPrimary").optional().matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/),
    body("brandSecondary").optional().matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/),
    body("buttonRadius").optional().isInt({ min: 0, max: 40 }),
    body("buttonPaddingY").optional().isInt({ min: 4, max: 30 }),
    body("buttonPaddingX").optional().isInt({ min: 8, max: 60 }),
  ],
  validateRequest,
  updateSettingsHandler
);

router.put(
  "/admin/blocks",
  protect,
  requireRole("admin"),
  [
    body("key").trim().isLength({ min: 2, max: 120 }),
    body("label").optional().isLength({ min: 2, max: 255 }),
    body("contentType").optional().isIn(["text", "image", "button", "html", "json"]),
    body("value").optional().isString().isLength({ max: 20000 }),
    body("isPublished").optional().isBoolean(),
  ],
  validateRequest,
  upsertContentBlockHandler
);

module.exports = router;
