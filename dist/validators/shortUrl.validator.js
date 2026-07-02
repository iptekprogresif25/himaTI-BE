import { z } from 'zod';
export const createShortUrlSchema = z.object({
    short_code: z.string().min(1, 'Short code harus diisi').regex(/^[a-zA-Z0-9-_]+$/, 'Short code hanya boleh berisi huruf, angka, strip (-), dan underscore (_)'),
    original_url: z.string().url('URL tidak valid'),
});
export const updateShortUrlSchema = z.object({
    short_code: z.string().min(1, 'Short code harus diisi').regex(/^[a-zA-Z0-9-_]+$/, 'Short code hanya boleh berisi huruf, angka, strip (-), dan underscore (_)'),
    original_url: z.string().url('URL tidak valid'),
});
