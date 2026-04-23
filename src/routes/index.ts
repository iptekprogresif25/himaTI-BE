import { Hono } from "hono";
import { cors } from "hono/cors";
import { rateLimiter } from "hono-rate-limiter";
import type { Context } from "hono";

import authRoutes from "./auth.route.js"
import activityRoutes from "./activity.route.js"
import productRoutes from "./product.routes.js";
import aspirationRoute from "./aspiration.route.js";

const routes = new Hono()

routes.use(cors({
  origin: 'https://hima-ti.uniku.ac.id',
  credentials: true,
}))

routes.use(
  '*',
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    keyGenerator: (c: Context) => {
      return c.req.header('x-forwarded-for') || 'anonymous'
    },
  })
)

routes.route('/auth', authRoutes);
routes.route('/activity', activityRoutes);
routes.route('/product', productRoutes);
routes.route('/aspiration', aspirationRoute);

export default routes