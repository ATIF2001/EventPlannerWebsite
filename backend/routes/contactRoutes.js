const express = require("express");
const { body } = require("express-validator");
const { submitContactForm } = require("../controllers/contactController");
const { validateRequest } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Name is required"),
    body("phone").trim().isLength({ min: 6, max: 30 }).withMessage("Phone number is required"),
    body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("message").trim().isLength({ min: 5, max: 4000 }).withMessage("Message is required"),
  ],
  validateRequest,
  submitContactForm
);

module.exports = router;
