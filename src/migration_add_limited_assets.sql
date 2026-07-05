ALTER TABLE digital_assets ADD COLUMN IF NOT EXISTS is_limited BOOLEAN DEFAULT false;
ALTER TABLE asset_requests ADD COLUMN IF NOT EXISTS borrow_start_date DATE;
ALTER TABLE asset_requests ADD COLUMN IF NOT EXISTS borrow_end_date DATE;

-- Update existing AR asset to be limited
UPDATE digital_assets SET is_limited = true WHERE category ILIKE '%AR%' OR title ILIKE '%AR Cardboard%';
