import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url()
})


export const updateActivitySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image_url: z.string().url().optional(),
  url: z.string().url().optional()
})


