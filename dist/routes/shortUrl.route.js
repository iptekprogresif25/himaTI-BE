import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import * as shortUrlController from '../controllers/shortUrl.controller.js';
import { createShortUrlSchema, updateShortUrlSchema } from '../validators/shortUrl.validator.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const shortUrlRoutes = new Hono();
// Public route for redirecting
shortUrlRoutes.get('/redirect/:code', shortUrlController.redirectShortUrl);
// Admin routes
shortUrlRoutes.get('/', authMiddleware, shortUrlController.getShortUrls);
shortUrlRoutes.post('/', authMiddleware, zValidator('json', createShortUrlSchema), shortUrlController.createShortUrl);
shortUrlRoutes.put('/:id', authMiddleware, zValidator('json', updateShortUrlSchema), shortUrlController.updateShortUrl);
shortUrlRoutes.delete('/:id', authMiddleware, shortUrlController.deleteShortUrl);
export default shortUrlRoutes;
