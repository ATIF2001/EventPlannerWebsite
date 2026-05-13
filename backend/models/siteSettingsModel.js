const pool = require("../config/db");

function toCamel(row) {
  if (!row) return null;
  return {
    id: row.id,
    logoUrl: row.logo_url || "",
    headingFont: row.heading_font || "Poppins",
    paragraphFont: row.paragraph_font || "Poppins",
    headingWeight: row.heading_weight || 600,
    paragraphWeight: row.paragraph_weight || 400,
    headingSizeScale: Number(row.heading_size_scale || 1),
    paragraphSizeScale: Number(row.paragraph_size_scale || 1),
    brandPrimary: row.brand_primary || "#ffffff",
    brandSecondary: row.brand_secondary || "#d9d9d9",
    buttonRadius: Number(row.button_radius || 8),
    buttonPaddingY: Number(row.button_padding_y || 10),
    buttonPaddingX: Number(row.button_padding_x || 20),
    buttonStyle: row.button_style || "solid",
    footerPhone: row.footer_phone || "",
    footerEmail: row.footer_email || "",
    footerAddress: row.footer_address || "",
    updatedAt: row.updated_at,
  };
}

async function ensureSettingsRow() {
  await pool.query(`
    INSERT INTO site_settings (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING
  `);
}

async function getSiteSettings() {
  await ensureSettingsRow();
  const { rows } = await pool.query(`SELECT * FROM site_settings WHERE id = 1`);
  return toCamel(rows[0]);
}

async function updateSiteSettings(payload) {
  await ensureSettingsRow();
  const {
    logoUrl,
    headingFont,
    paragraphFont,
    headingWeight,
    paragraphWeight,
    headingSizeScale,
    paragraphSizeScale,
    brandPrimary,
    brandSecondary,
    buttonRadius,
    buttonPaddingY,
    buttonPaddingX,
    buttonStyle,
    footerPhone,
    footerEmail,
    footerAddress,
  } = payload;

  const { rows } = await pool.query(
    `
      UPDATE site_settings
      SET
        logo_url = $1,
        heading_font = $2,
        paragraph_font = $3,
        heading_weight = $4,
        paragraph_weight = $5,
        heading_size_scale = $6,
        paragraph_size_scale = $7,
        brand_primary = $8,
        brand_secondary = $9,
        button_radius = $10,
        button_padding_y = $11,
        button_padding_x = $12,
        button_style = $13,
        footer_phone = $14,
        footer_email = $15,
        footer_address = $16,
        updated_at = NOW()
      WHERE id = 1
      RETURNING *
    `,
    [
      logoUrl || "",
      headingFont || "Poppins",
      paragraphFont || "Poppins",
      Number(headingWeight || 600),
      Number(paragraphWeight || 400),
      Number(headingSizeScale || 1),
      Number(paragraphSizeScale || 1),
      brandPrimary || "#ffffff",
      brandSecondary || "#d9d9d9",
      Number(buttonRadius || 8),
      Number(buttonPaddingY || 10),
      Number(buttonPaddingX || 20),
      buttonStyle || "solid",
      footerPhone || "",
      footerEmail || "",
      footerAddress || "",
    ]
  );

  return toCamel(rows[0]);
}

async function listContentBlocks() {
  const { rows } = await pool.query(
    `SELECT id, block_key, label, content_type, content_value, is_published, updated_at FROM site_content_blocks ORDER BY id ASC`
  );
  return rows.map((row) => ({
    id: row.id,
    key: row.block_key,
    label: row.label,
    contentType: row.content_type,
    value: row.content_value,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  }));
}

async function upsertContentBlock(payload) {
  const { key, label, contentType, value, isPublished } = payload;
  const { rows } = await pool.query(
    `
      INSERT INTO site_content_blocks (block_key, label, content_type, content_value, is_published)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (block_key)
      DO UPDATE SET
        label = EXCLUDED.label,
        content_type = EXCLUDED.content_type,
        content_value = EXCLUDED.content_value,
        is_published = EXCLUDED.is_published,
        updated_at = NOW()
      RETURNING id, block_key, label, content_type, content_value, is_published, updated_at
    `,
    [key, label || key, contentType || "text", value || "", Boolean(isPublished)]
  );

  const row = rows[0];
  return {
    id: row.id,
    key: row.block_key,
    label: row.label,
    contentType: row.content_type,
    value: row.content_value,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

module.exports = {
  getSiteSettings,
  updateSiteSettings,
  listContentBlocks,
  upsertContentBlock,
};
