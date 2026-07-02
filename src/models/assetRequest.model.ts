import { sql } from '../config/db.js';

export interface AssetRequest {
  id?: string;
  asset_id: string;
  name: string;
  whatsapp: string;
  organization?: string;
  reason: string;
  email?: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export const create = async (requestData: AssetRequest) => {
  const { asset_id, name, whatsapp, organization, reason, email } = requestData;
  const result = await sql`
    INSERT INTO asset_requests (asset_id, name, whatsapp, organization, reason, email)
    VALUES (${asset_id}, ${name}, ${whatsapp}, ${organization || null}, ${reason}, ${email || null})
    RETURNING *
  `;
  return result[0];
};

export const findAll = async () => {
  const result = await sql`
    SELECT ar.*, da.title as asset_title, da.repo_url, da.demo_url, da.guide_url
    FROM asset_requests ar
    LEFT JOIN digital_assets da ON ar.asset_id = da.id
    ORDER BY ar.created_at DESC
  `;
  return result;
};

export const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
  const result = await sql`
    UPDATE asset_requests 
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${id} 
    RETURNING *
  `;
  return result[0];
};

export const remove = async (id: string) => {
  const result = await sql`
    DELETE FROM asset_requests WHERE id = ${id} RETURNING id
  `;
  return result[0];
};
