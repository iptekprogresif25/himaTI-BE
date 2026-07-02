import { sql } from "../config/db.js";
export const findAllWithQuery = async ({ search, sortColumn, order, limit, offset }) => {
    const data = await sql `
    SELECT da.*,
           COALESCE(da.likes, 0) as likes,
           COUNT(ar.id) as request_count
    FROM digital_assets da
    LEFT JOIN asset_requests ar ON da.id = ar.asset_id
    WHERE da.title ILIKE ${'%' + search + '%'}
    GROUP BY da.id
    ORDER BY ${sql.unsafe(`da.${sortColumn} ${order}`)}
    LIMIT ${limit} OFFSET ${offset}
  `;
    return data;
};
export const countAll = async ({ search }) => {
    const result = await sql `
    SELECT COUNT(*) FROM digital_assets
    WHERE title ILIKE ${'%' + search + '%'}
  `;
    return Number(result[0].count);
};
export const findById = async (id) => {
    const result = await sql `
    SELECT da.*,
           COALESCE(da.likes, 0) as likes,
           COUNT(ar.id) as request_count
    FROM digital_assets da
    LEFT JOIN asset_requests ar ON da.id = ar.asset_id
    WHERE da.id = ${id}
    GROUP BY da.id
  `;
    return result[0];
};
export const create = async (data) => {
    const result = await sql `
    INSERT INTO digital_assets (
      title,
      "desc",
      category,
      type,
      tech_stack,
      features,
      steps,
      repo_url,
      guide_url,
      image_url,
      image_public_id,
      icon,
      demo_url,
      stats,
      difficulty,
      system_req,
      is_hot,
      is_recommended,
      developer,
      testimonial,
      changelog,
      faqs
    )
    VALUES (
      ${data.title},
      ${data.desc},
      ${data.category},
      ${data.type},
      ${data.tech_stack},
      ${data.features},
      ${data.steps},
      ${data.repo_url},
      ${data.guide_url},
      ${data.image_url},
      ${data.image_public_id},
      ${data.icon},
      ${data.demo_url},
      ${data.stats},
      ${data.difficulty},
      ${data.system_req},
      ${data.is_hot},
      ${data.is_recommended},
      ${data.developer},
      ${data.testimonial},
      ${data.changelog},
      ${data.faqs}
    )
    RETURNING *
  `;
    return result[0];
};
export const update = async (id, data) => {
    const result = await sql `
    UPDATE digital_assets
    SET
      title = COALESCE(${data.title}, title),
      "desc" = COALESCE(${data.desc}, "desc"),
      category = COALESCE(${data.category}, category),
      type = COALESCE(${data.type}, type),
      tech_stack = COALESCE(${data.tech_stack}, tech_stack),
      features = COALESCE(${data.features}, features),
      steps = COALESCE(${data.steps}, steps),
      repo_url = COALESCE(${data.repo_url}, repo_url),
      guide_url = COALESCE(${data.guide_url}, guide_url),
      image_url = COALESCE(${data.image_url}, image_url),
      image_public_id = COALESCE(${data.image_public_id}, image_public_id),
      icon = COALESCE(${data.icon}, icon),
      demo_url = COALESCE(${data.demo_url}, demo_url),
      stats = COALESCE(${data.stats}, stats),
      difficulty = COALESCE(${data.difficulty}, difficulty),
      system_req = COALESCE(${data.system_req}, system_req),
      is_hot = COALESCE(${data.is_hot}, is_hot),
      is_recommended = COALESCE(${data.is_recommended}, is_recommended),
      developer = COALESCE(${data.developer}, developer),
      testimonial = COALESCE(${data.testimonial}, testimonial),
      changelog = COALESCE(${data.changelog}, changelog),
      faqs = COALESCE(${data.faqs}, faqs),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
    return result[0];
};
export const remove = async (id) => {
    await sql `
    DELETE FROM digital_assets WHERE id=${id}
  `;
};
export const incrementLikes = async (id) => {
    const result = await sql `
    UPDATE digital_assets
    SET likes = COALESCE(likes, 0) + 1
    WHERE id = ${id}
    RETURNING likes
  `;
    return result[0];
};
