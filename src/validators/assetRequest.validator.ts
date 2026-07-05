import { z } from 'zod';

export const createAssetRequestSchema = z.object({
  asset_id: z.string().uuid("Asset ID tidak valid"),
  name: z.string().min(1, "Nama wajib diisi"),
  whatsapp: z.string().min(9, "Nomor WhatsApp tidak valid"),
  organization: z.string().optional(),
  reason: z.string().min(5, "Alasan wajib diisi, minimal 5 karakter"),
  email: z.string().email("Email tidak valid").optional(),
  borrow_start_date: z.string().optional(),
  borrow_end_date: z.string().optional()
});

export const updateAssetRequestStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    message: "Status harus pending, approved, atau rejected"
  })
});
