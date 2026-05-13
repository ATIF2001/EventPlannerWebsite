const pool = require("../config/db");

function mapBlog(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    content: row.content,
    featuredImage: row.featured_image,
    images: row.images || [],
    tags: row.tags || [],
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createBlog(payload) {
  const { title, slug, description, content, featuredImage, images, tags, isPublished } = payload;
  const result = await pool.query(
    `INSERT INTO blogs (title, slug, description, content, featured_image, images, tags, is_published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [title, slug, description, content, featuredImage, images, tags, isPublished]
  );
  return mapBlog(result.rows[0]);
}

async function updateBlog(id, payload) {
  const { title, slug, description, content, featuredImage, images, tags, isPublished } = payload;
  const result = await pool.query(
    `UPDATE blogs
     SET title=$1, slug=$2, description=$3, content=$4, featured_image=$5, images=$6, tags=$7, is_published=$8, updated_at=NOW()
     WHERE id=$9
     RETURNING *`,
    [title, slug, description, content, featuredImage, images, tags, isPublished, id]
  );
  return result.rows[0] ? mapBlog(result.rows[0]) : null;
}

async function listBlogs({ includeUnpublished = false } = {}) {
  const result = includeUnpublished
    ? await pool.query("SELECT * FROM blogs ORDER BY created_at DESC")
    : await pool.query("SELECT * FROM blogs WHERE is_published = true ORDER BY created_at DESC");
  return result.rows.map(mapBlog);
}

async function getBlogBySlug(slug) {
  const result = await pool.query("SELECT * FROM blogs WHERE slug = $1 LIMIT 1", [slug]);
  return result.rows[0] ? mapBlog(result.rows[0]) : null;
}

async function getBlogById(id) {
  const result = await pool.query("SELECT * FROM blogs WHERE id = $1 LIMIT 1", [id]);
  return result.rows[0] ? mapBlog(result.rows[0]) : null;
}

async function deleteBlog(id) {
  const result = await pool.query("DELETE FROM blogs WHERE id = $1 RETURNING id", [id]);
  return Boolean(result.rows[0]);
}

module.exports = {
  createBlog,
  updateBlog,
  listBlogs,
  getBlogBySlug,
  getBlogById,
  deleteBlog,
};

