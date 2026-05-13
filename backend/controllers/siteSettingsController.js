const { validationResult } = require("express-validator");
const {
  getSiteSettings,
  updateSiteSettings,
  listContentBlocks,
  upsertContentBlock,
} = require("../models/siteSettingsModel");

async function getPublicSettingsHandler(req, res, next) {
  try {
    const settings = await getSiteSettings();
    const blocks = await listContentBlocks();
    return res.json({ settings, blocks: blocks.filter((b) => b.isPublished) });
  } catch (error) {
    return next(error);
  }
}

async function getAdminSettingsHandler(req, res, next) {
  try {
    const settings = await getSiteSettings();
    const blocks = await listContentBlocks();
    return res.json({ settings, blocks });
  } catch (error) {
    return next(error);
  }
}

async function updateSettingsHandler(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const updated = await updateSiteSettings(req.body || {});
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
}

async function upsertContentBlockHandler(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const block = await upsertContentBlock(req.body || {});
    return res.json(block);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getPublicSettingsHandler,
  getAdminSettingsHandler,
  updateSettingsHandler,
  upsertContentBlockHandler,
};
