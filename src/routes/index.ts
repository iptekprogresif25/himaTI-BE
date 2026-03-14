import { Hono } from "hono";
import authRoutes from "./auth.route.js"
import activityRoutes from "./activity.route.js"

const routes = new Hono()

routes.route('/auth', authRoutes);
routes.route('/activity', activityRoutes);

export default routes