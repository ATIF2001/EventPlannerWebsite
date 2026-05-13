const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const contactRoutes = require("./routes/contactRoutes");
const projectRoutes = require("./routes/projectRoutes");
const siteSettingsRoutes = require("./routes/siteSettingsRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const { helmetMiddleware, globalLimiter, authLimiter, contactLimiter } = require("./middleware/securityMiddleware");
const { requestAuditLogger } = require("./middleware/requestMiddleware");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
const allowedOrigins = env.frontendUrl
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.use(helmetMiddleware);
app.use(globalLimiter);
app.use(requestAuditLogger);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/site-settings", siteSettingsRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port}`);
});
