import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { authMiddleware } from "../middleware/auth.middleware.js"
import * as controller from "../controllers/product.controller.js"
import {
  createProductSchema,
  updateProductSchema,
  idSchema
} from "../validators/product.validator.js"

const productRoute = new Hono()

productRoute.get("/", controller.getAll)

productRoute.get("/:id", controller.getOne)

productRoute.post("/", authMiddleware, zValidator("form", createProductSchema), controller.create)

productRoute.patch("/:id", authMiddleware, zValidator("param", idSchema), zValidator("form", updateProductSchema), controller.update)

productRoute.delete("/:id", authMiddleware, zValidator("param", idSchema), controller.remove)

export default productRoute
