import { sql } from '../config/db.js';

export interface ShortUrl {
  id: string;
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: Date;
  updated_at: Date;
}

export const createShortUrl = async (short_code: string, original_url: string): Promise<ShortUrl> => {
  const result = await sql`
    INSERT INTO short_urls (short_code, original_url)
    VALUES (${short_code}, ${original_url})
    RETURNING *
  `;
  return result[0] as ShortUrl;
};

export const getShortUrls = async (): Promise<ShortUrl[]> => {
  const result = await sql`
    SELECT * FROM short_urls
    ORDER BY created_at DESC
  `;
  return result as ShortUrl[];
};

export const updateShortUrl = async (id: string, short_code: string, original_url: string): Promise<ShortUrl> => {
  const result = await sql`
    UPDATE short_urls
    SET short_code = ${short_code},
        original_url = ${original_url},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as ShortUrl;
};

export const deleteShortUrl = async (id: string): Promise<void> => {
  await sql`
    DELETE FROM short_urls
    WHERE id = ${id}
  `;
};

export const findAndIncrementClicks = async (short_code: string): Promise<ShortUrl | null> => {
  const result = await sql`
    UPDATE short_urls
    SET clicks = clicks + 1
    WHERE short_code = ${short_code}
    RETURNING *
  `;
  return (result[0] as ShortUrl) || null;
};
