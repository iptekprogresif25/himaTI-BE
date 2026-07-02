import { Hono } from "hono";
import { cors } from "hono/cors";
import { rateLimiter } from "hono-rate-limiter";
import authRoutes from "./auth.route.js";
import activityRoutes from "./activity.route.js";
import productRoutes from "./product.routes.js";
import aspirationRoute from "./aspiration.route.js";
import digitalAssetRoute from "./digitalAsset.route.js";
import assetRequestRoute from "./assetRequest.route.js";
import shortUrlRoute from "./shortUrl.route.js";
const routes = new Hono();
routes.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
}));
routes.use('*', rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    keyGenerator: (c) => {
        return c.req.header('x-forwarded-for') || 'anonymous';
    },
}));
routes.route('/auth', authRoutes);
routes.route('/activity', activityRoutes);
routes.route('/product', productRoutes);
routes.route('/aspiration', aspirationRoute);
routes.route('/digital-asset', digitalAssetRoute);
routes.route('/asset-requests', assetRequestRoute);
routes.route('/short-url', shortUrlRoute);
export default routes;
