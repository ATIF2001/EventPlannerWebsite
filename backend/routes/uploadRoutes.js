const express = require("express");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { s3Upload } = require("../config/s3");
const { uploadImageHandler } = require("../controllers/uploadController");

const router = express.Router();

router.post("/image", protect, requireRole("admin"), s3Upload.single("image"), uploadImageHandler);

module.exports = router;
