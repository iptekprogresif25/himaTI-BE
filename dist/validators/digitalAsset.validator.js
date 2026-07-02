import { z } from "zod";
export const idSchema = z.object({
    id: z.string().uuid()
});
// Since form data sends strings, techStack, features, and steps are expected to be JSON strings
export const createDigitalAssetSchema = z.object({
    title: z.string().min(1),
    desc: z.string().min(1),
    category: z.string().min(1),
    type: z.string().min(1), // e.g., 'ar', 'game', 'web'
    tech_stack: z.string().optional(),
    features: z.string().optional(),
    steps: z.string().optional(),
    repo_url: z.string().url().optional().or(z.literal('')),
    guide_url: z.string().url().optional().or(z.literal('')),
    icon: z.string().optional(), // e.g., 'Eye', 'Smartphone'
    demo_url: z.string().url().optional().or(z.literal('')),
    stats: z.string().optional(),
    difficulty: z.string().optional(),
    system_req: z.string().optional(),
    is_hot: z.union([z.boolean(), z.string()]).optional(),
    is_recommended: z.union([z.boolean(), z.string()]).optional(),
    developer: z.string().optional(),
    testimonial: z.string().optional(),
    changelog: z.string().optional(),
    faqs: z.string().optional()
});
export const updateDigitalAssetSchema = z.object({
    title: z.string().min(1).optional(),
    desc: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    type: z.string().min(1).optional(),
    tech_stack: z.string().optional(),
    features: z.string().optional(),
    steps: z.string().optional(),
    repo_url: z.string().url().optional().or(z.literal('')),
    guide_url: z.string().url().optional().or(z.literal('')),
    icon: z.string().optional(),
    demo_url: z.string().url().optional().or(z.literal('')),
    stats: z.string().optional(),
    difficulty: z.string().optional(),
    system_req: z.string().optional(),
    is_hot: z.union([z.boolean(), z.string()]).optional(),
    is_recommended: z.union([z.boolean(), z.string()]).optional(),
    developer: z.string().optional(),
    testimonial: z.string().optional(),
    changelog: z.string().optional(),
    faqs: z.string().optional()
});
