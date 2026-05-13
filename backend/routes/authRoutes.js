const express = require("express");
const { body } = require("express-validator");
const { login } = require("../controllers/authController");
const { validateRequest } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Valid email required").normalizeEmail(),
    body("password").isString().isLength({ min: 8, max: 128 }).withMessage("Password is required"),
  ],
  validateRequest,
  login
);

module.exports = router;
