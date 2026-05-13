const pool = require("../config/db");

const migrations = [
  {
    id: "001_create_admins_and_blogs",
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS blogs (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT NOT NULL,
          content TEXT NOT NULL,
          featured_image TEXT,
          images TEXT[] DEFAULT ARRAY[]::TEXT[],
          tags TEXT[] DEFAULT ARRAY[]::TEXT[],
          is_published BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
    },
  },
  {
    id: "002_add_blog_seo_and_publish_meta",
    up: async () => {
      await pool.query(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS published_at TIMESTAMP NULL;`);
      await pool.query(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255) NULL;`);
      await pool.query(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description TEXT NULL;`);
      await pool.query(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255) NULL;`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_blogs_is_published_created_at ON blogs(is_published, created_at DESC);`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);`);
    },
  },
  {
    id: "003_create_projects",
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          category VARCHAR(50) NOT NULL,
          description TEXT NOT NULL,
          cover_image TEXT,
          gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
          is_published BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_projects_category_created_at ON projects(category, created_at DESC);`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);`);
    },
  },
  {
    id: "004_create_site_settings",
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id INTEGER PRIMARY KEY,
          logo_url TEXT DEFAULT '',
          heading_font VARCHAR(100) DEFAULT 'Poppins',
          paragraph_font VARCHAR(100) DEFAULT 'Poppins',
          heading_weight INTEGER DEFAULT 600,
          paragraph_weight INTEGER DEFAULT 400,
          heading_size_scale NUMERIC(4,2) DEFAULT 1,
          paragraph_size_scale NUMERIC(4,2) DEFAULT 1,
          brand_primary VARCHAR(7) DEFAULT '#ffffff',
          brand_secondary VARCHAR(7) DEFAULT '#d9d9d9',
          button_radius INTEGER DEFAULT 8,
          button_padding_y INTEGER DEFAULT 10,
          button_padding_x INTEGER DEFAULT 20,
          button_style VARCHAR(20) DEFAULT 'solid',
          footer_phone TEXT DEFAULT '',
          footer_email TEXT DEFAULT '',
          footer_address TEXT DEFAULT '',
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS site_content_blocks (
          id SERIAL PRIMARY KEY,
          block_key VARCHAR(120) UNIQUE NOT NULL,
          label VARCHAR(255) NOT NULL,
          content_type VARCHAR(20) NOT NULL DEFAULT 'text',
          content_value TEXT NOT NULL DEFAULT '',
          is_published BOOLEAN DEFAULT true,
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await pool.query(`
        INSERT INTO site_settings (id)
        VALUES (1)
        ON CONFLICT (id) DO NOTHING;
      `);
    },
  },];

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id VARCHAR(255) PRIMARY KEY,
      run_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const { rows } = await pool.query("SELECT id FROM schema_migrations");
  const ran = new Set(rows.map((row) => row.id));

  for (const migration of migrations) {
    if (ran.has(migration.id)) {
      console.log(`Skipping ${migration.id} (already applied)`);
      continue;
    }

    console.log(`Applying ${migration.id}...`);
    await pool.query("BEGIN");
    try {
      await migration.up();
      await pool.query("INSERT INTO schema_migrations(id) VALUES($1)", [migration.id]);
      await pool.query("COMMIT");
      console.log(`Applied ${migration.id}`);
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}

migrate()
  .then(async () => {
    console.log("Migrations complete");
    await pool.end();
  })
  .catch(async (error) => {
    console.error("Migration failed:", error.message);
    await pool.end();
    process.exit(1);
  });


