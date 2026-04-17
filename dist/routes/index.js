import { Hono } from "hono";
import authRoutes from "./auth.route.js";
import activityRoutes from "./activity.route.js";
import productRoutes from "./product.routes.js";
const routes = new Hono();
routes.route('/auth', authRoutes);
routes.route('/activity', activityRoutes);
routes.route('/product', productRoutes);
export default routes;
