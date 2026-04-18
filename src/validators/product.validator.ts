import { z } from "zod"

export const idSchema = z.object({
  id: z.string().uuid()
})

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  url: z.string().url(),
  price: z.coerce.number().positive(),
})


export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image_url: z.string().url().optional(),
  category: z.string().min(1).optional(),
  url: z.string().url().optional(),
  price: z.coerce.number().positive().optional(),
})


