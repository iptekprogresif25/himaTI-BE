import { z } from "zod"

// ✅ PARAM ID
export const idSchema = z.object({
  id: z.string().uuid()
})


// ✅ CREATE
export const createAspirationSchema = z.object({
  name: z.string().optional(),
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
  urgency: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Urgency must be a number"
    }),
  contact_person: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  file: z.any().optional() // file (multipart)
})
