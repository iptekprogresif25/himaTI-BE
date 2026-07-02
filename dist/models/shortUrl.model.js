import { sql } from '../config/db.js';
export const createShortUrl = async (short_code, original_url) => {
    const result = await sql `
    INSERT INTO short_urls (short_code, original_url)
    VALUES (${short_code}, ${original_url})
    RETURNING *
  `;
    return result[0];
};
export const getShortUrls = async () => {
    const result = await sql `
    SELECT * FROM short_urls
    ORDER BY created_at DESC
  `;
    return result;
};
export const updateShortUrl = async (id, short_code, original_url) => {
    const result = await sql `
    UPDATE short_urls
    SET short_code = ${short_code},
        original_url = ${original_url},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
    return result[0];
};
export const deleteShortUrl = async (id) => {
    await sql `
    DELETE FROM short_urls
    WHERE id = ${id}
  `;
};
export const findAndIncrementClicks = async (short_code) => {
    const result = await sql `
    UPDATE short_urls
    SET clicks = clicks + 1
    WHERE short_code = ${short_code}
    RETURNING *
  `;
    return result[0] || null;
};
