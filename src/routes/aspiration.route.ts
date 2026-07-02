import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { authMiddleware } from "../middleware/auth.middleware.js"
import * as controller from "../controllers/aspiration.controller.js"

import {
  createAspirationSchema,
  idSchema
} from "../validators/aspiration.validator.js"

const aspirationRoute = new Hono()

aspirationRoute.get("/", controller.getAll)

aspirationRoute.get(
  "/:id",
  zValidator("param", idSchema),
  controller.getOne
)

aspirationRoute.post(
  "/",
  zValidator("form", createAspirationSchema),
  controller.create
)


aspirationRoute.delete(
  "/:id",
  authMiddleware,
  zValidator("param", idSchema),
  controller.remove
)

export default aspirationRoute