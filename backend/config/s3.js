const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const env = require("./env");
const path = require("path");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function fileFilter(req, file, cb) {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPG, PNG, WEBP, GIF are allowed."));
  }
  return cb(null, true);
}

const hasS3Config = Boolean(
  env.awsRegion &&
    env.awsAccessKeyId &&
    env.awsSecretAccessKey &&
    env.awsS3Bucket &&
    env.awsS3Bucket !== "your_bucket_name"
);

let s3 = null;
if (hasS3Config) {
  const s3Config = {
    region: env.awsRegion,
    credentials: {
      accessKeyId: env.awsAccessKeyId,
      secretAccessKey: env.awsSecretAccessKey,
    },
    forcePathStyle: true,
    useAccelerateEndpoint: false,
    useArnRegion: false,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  };

  if (env.s3Endpoint) {
    s3Config.endpoint = env.s3Endpoint;
    s3Config.forcePathStyle = env.s3ForcePathStyle;
  }

  s3 = new S3Client(s3Config);
}

const localUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

const s3Upload = hasS3Config
  ? multer({
      storage: multerS3({
        s3,
        bucket: env.awsS3Bucket,
        ...(env.s3Endpoint ? {} : { acl: "public-read" }),
        metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
        key: (req, file, cb) => {
          const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
          cb(null, `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter,
    })
  : localUpload;

function getFileUrl(file) {
  if (!file) return null;
  if (file.location) return file.location;
  if (file.bucket && file.key && env.s3Endpoint) {
    const endpoint = env.s3Endpoint.replace(/\/$/, "");
    if (env.s3ForcePathStyle) {
      return `${endpoint}/${file.bucket}/${file.key}`;
    }
    const noProtocol = endpoint.replace(/^https?:\/\//, "");
    const protocol = endpoint.startsWith("https://") ? "https" : "http";
    return `${protocol}://${file.bucket}.${noProtocol}/${file.key}`;
  }
  return null;
}

module.exports = { s3Upload, getFileUrl, hasS3Config };
