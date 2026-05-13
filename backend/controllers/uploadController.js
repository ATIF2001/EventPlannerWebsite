const { getFileUrl } = require("../config/s3");

async function uploadImageHandler(req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const url = getFileUrl(file);
    if (!url) {
      return res.status(500).json({ message: "Failed to generate uploaded file URL" });
    }
    return res.status(201).json({ url });
  } catch (error) {
    return next(error);
  }
}

module.exports = { uploadImageHandler };

