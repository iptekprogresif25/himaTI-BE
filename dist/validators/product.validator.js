import { z } from "zod";
export const idSchema = z.object({
    id: z.string().uuid()
});
export const createProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1)
});
export const updateProductSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    image_url: z.string().url().optional(),
    category: z.string().min(1).optional()
});
