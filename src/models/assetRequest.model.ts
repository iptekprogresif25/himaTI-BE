import { sql } from '../config/db.js';

export interface AssetRequest {
  id?: string;
  asset_id: string;
  name: string;
  whatsapp: string;
  organization?: string;
  reason: string;
  email?: string;
  borrow_start_date?: string;
  borrow_end_date?: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export const create = async (requestData: AssetRequest) => {
  const { asset_id, name, whatsapp, organization, reason, email, borrow_start_date, borrow_end_date } = requestData;
  const result = await sql`
    INSERT INTO asset_requests (asset_id, name, whatsapp, organization, reason, email, borrow_start_date, borrow_end_date)
    VALUES (${asset_id}, ${name}, ${whatsapp}, ${organization || null}, ${reason}, ${email || null}, ${borrow_start_date || null}, ${borrow_end_date || null})
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

export const findBookedDatesByAssetId = async (assetId: string) => {
  const result = await sql`
    SELECT borrow_start_date, borrow_end_date
    FROM asset_requests
    WHERE asset_id = ${assetId}
      AND status = 'approved'
      AND borrow_start_date IS NOT NULL
      AND borrow_end_date IS NOT NULL
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
