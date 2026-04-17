import { sql } from "../config/db.js";
export const findAll = async () => {
    return await sql `
    SELECT * FROM activities
    ORDER BY created_at DESC
  `;
};
export const findById = async (id) => {
    const result = await sql `
    SELECT * FROM activities WHERE id = ${id}
  `;
    return result[0];
};
export const create = async (data) => {
    const result = await sql `
    INSERT INTO activities (
      name,
      description,
      image_url,
      image_public_id,
      url
    )
    VALUES (
      ${data.name},
      ${data.description},
      ${data.image_url},
      ${data.image_public_id},
      ${data.url}
    )
    RETURNING *
  `;
    return result[0];
};
export const update = async (id, data) => {
    const result = await sql `
    UPDATE activities
    SET
      name = COALESCE(${data.name}, name),
      description = COALESCE(${data.description}, description),
      image_url = COALESCE(${data.image_url}, image_url),
      image_public_id = COALESCE(${data.image_public_id}, image_public_id),
      url = COALESCE(${data.url}, url),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
    return result[0];
};
export const remove = async (id) => {
    await sql `
    DELETE FROM activities WHERE id=${id}
  `;
};
