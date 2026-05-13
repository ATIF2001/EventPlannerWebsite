function requestAuditLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const userId = req.user?.id || "anonymous";
    console.log(
      `[AUDIT] ${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms user=${userId}`
    );
  });
  next();
}

module.exports = { requestAuditLogger };
