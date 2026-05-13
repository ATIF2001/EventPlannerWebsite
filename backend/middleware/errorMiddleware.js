const env = require("../config/env");

function errorHandler(err, req, res, next) {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: statusCode >= 500 && env.nodeEnv === "production" ? "Server error" : err.message || "Server error",
  });
}

module.exports = { errorHandler };
