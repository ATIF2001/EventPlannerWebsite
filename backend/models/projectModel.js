const pool = require("../config/db");

function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    description: row.description,
    coverImage: row.cover_image,
    galleryImages: row.gallery_images || [],
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createProject(payload) {
  const { title, slug, category, description, coverImage, galleryImages, isPublished } = payload;
  const result = await pool.query(
    `INSERT INTO projects (title, slug, category, description, cover_image, gallery_images, is_published)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [title, slug, category, description, coverImage, galleryImages, isPublished]
  );
  return mapProject(result.rows[0]);
}

async function updateProject(id, payload) {
  const { title, slug, category, description, coverImage, galleryImages, isPublished } = payload;
  const result = await pool.query(
    `UPDATE projects
     SET title=$1, slug=$2, category=$3, description=$4, cover_image=$5, gallery_images=$6, is_published=$7, updated_at=NOW()
     WHERE id=$8
     RETURNING *`,
    [title, slug, category, description, coverImage, galleryImages, isPublished, id]
  );
  return result.rows[0] ? mapProject(result.rows[0]) : null;
}

async function listProjects({ category, includeUnpublished = false } = {}) {
  const values = [];
  const where = [];
  if (category) {
    values.push(category);
    where.push(`category = $${values.length}`);
  }
  if (!includeUnpublished) {
    where.push("is_published = true");
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const result = await pool.query(`SELECT * FROM projects ${whereClause} ORDER BY created_at DESC`, values);
  return result.rows.map(mapProject);
}

async function getProjectBySlug(slug) {
  const result = await pool.query("SELECT * FROM projects WHERE slug = $1 LIMIT 1", [slug]);
  return result.rows[0] ? mapProject(result.rows[0]) : null;
}

async function getProjectById(id) {
  const result = await pool.query("SELECT * FROM projects WHERE id = $1 LIMIT 1", [id]);
  return result.rows[0] ? mapProject(result.rows[0]) : null;
}

async function deleteProject(id) {
  const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING id", [id]);
  return Boolean(result.rows[0]);
}

module.exports = {
  createProject,
  updateProject,
  listProjects,
  getProjectBySlug,
  getProjectById,
  deleteProject,
};
