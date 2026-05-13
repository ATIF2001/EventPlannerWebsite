const dotenv = require("dotenv");

dotenv.config();
const clean = (value, fallback = "") => String(value ?? fallback).trim();
const isProduction = (process.env.NODE_ENV || "development") === "production";

function assertRequired(name, value) {
  if (!value) {
    throw new Error(`${name} is required`);
  }
}

const databaseUrl = clean(process.env.DATABASE_URL);
const jwtSecret = clean(process.env.JWT_SECRET);
const adminPassword = clean(process.env.ADMIN_PASSWORD);
const jwtIssuer = clean(process.env.JWT_ISSUER || "mk-weddingplanner-api");
const jwtAudience = clean(process.env.JWT_AUDIENCE || "mk-weddingplanner-admin");

assertRequired("JWT_SECRET", jwtSecret);

if (isProduction) {
  assertRequired("DATABASE_URL", databaseUrl);
  assertRequired("JWT_SECRET", jwtSecret);
  if (jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }
  assertRequired("ADMIN_PASSWORD", adminPassword);
}

if (jwtSecret && jwtSecret === "change_this_super_secret") {
  throw new Error("JWT_SECRET uses an insecure default value. Set a strong secret in environment.");
}

if (adminPassword && adminPassword === "admin123") {
  throw new Error("ADMIN_PASSWORD uses an insecure default value. Set a strong admin password in environment.");
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  databaseUrl,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtIssuer,
  jwtAudience,
  adminEmail: process.env.ADMIN_EMAIL || "admin@weddingplanner.com",
  adminPassword,
  awsRegion: clean(process.env.S3_REGION || process.env.AWS_REGION || "us-east-1"),
  awsAccessKeyId: clean(process.env.S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID),
  awsSecretAccessKey: clean(process.env.S3_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY),
  awsS3Bucket: clean(process.env.S3_BUCKET || process.env.AWS_S3_BUCKET),
  awsS3BaseUrl: clean(process.env.AWS_S3_BASE_URL || ""),
  s3Endpoint: clean(process.env.S3_ENDPOINT || "").replace(/\/+$/, ""),
  s3ForcePathStyle: String(process.env.S3_FORCE_PATH_STYLE || "false").toLowerCase() === "true",
  mailHost: clean(process.env.MAIL_HOST),
  mailPort: Number(process.env.MAIL_PORT || 465),
  mailUser: clean(process.env.MAIL_USER),
  mailPass: clean(process.env.MAIL_PASS),
  mailFrom: clean(process.env.MAIL_FROM),
  resendApiKey: clean(process.env.RESEND_API_KEY),
  resendFrom: clean(process.env.RESEND_FROM),
  contactInboxEmail: clean(process.env.CONTACT_INBOX_EMAIL || "mratifbutt1@gmail.com"),
};
