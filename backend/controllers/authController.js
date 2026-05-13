const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const env = require("../config/env");
const { findAdminByEmail } = require("../models/userModel");

const loginAttempts = new Map();
const LOCK_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function getAttemptKey(email, ip) {
  return `${String(email || "").toLowerCase()}|${String(ip || "")}`;
}

function isLocked(key, now) {
  const entry = loginAttempts.get(key);
  if (!entry) return false;
  if (now - entry.firstAttemptAt > LOCK_WINDOW_MS) {
    loginAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key, now) {
  const current = loginAttempts.get(key);
  if (!current || now - current.firstAttemptAt > LOCK_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }
  current.count += 1;
  loginAttempts.set(key, current);
}

async function login(req, res, next) {
  try {
    const { email, password } = req.validated;
    const now = Date.now();
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const attemptKey = getAttemptKey(email, ip);

    if (isLocked(attemptKey, now)) {
      return res.status(429).json({ message: "Too many failed login attempts. Please try again later." });
    }

    const admin = await findAdminByEmail(email);

    if (!admin) {
      recordFailure(attemptKey, now);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      recordFailure(attemptKey, now);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    loginAttempts.delete(attemptKey);

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin", jti: crypto.randomUUID() },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn,
        algorithm: "HS256",
        issuer: env.jwtIssuer,
        audience: env.jwtAudience,
        subject: String(admin.id),
      }
    );

    return res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    return next(error);
  }
}

module.exports = { login };
