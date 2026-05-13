const { validationResult, matchedData } = require("express-validator");

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }
  req.validated = matchedData(req, {
    locations: ["body", "query", "params"],
    includeOptionals: true,
  });
  return next();
}

module.exports = { validateRequest };
