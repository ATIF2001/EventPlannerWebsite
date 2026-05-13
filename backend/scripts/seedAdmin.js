const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const env = require("../config/env");

async function seedAdmin() {
  const existing = await pool.query("SELECT id FROM admins WHERE email = $1", [env.adminEmail]);
  if (existing.rows[0]) {
    console.log("Admin already exists");
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 10);
  await pool.query("INSERT INTO admins (email, password_hash) VALUES ($1, $2)", [
    env.adminEmail,
    passwordHash,
  ]);
  console.log("Admin seeded");
  await pool.end();
}

seedAdmin().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});

