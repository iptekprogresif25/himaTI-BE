import type { Context, Next } from "hono"
import { verifyToken } from '../utils/jwt.js'

export const authMiddleware = async (c: Context, next: Next) => {

  const authHeader = c.req.header("Authorization")

  if (!authHeader) {
    return c.json({ message: "Unauthorized" }, 401)
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return c.json({ message: "Invalid token format" }, 401)
  }

  try {
    const payload = verifyToken(token)
    c.set("user", payload)
  } catch {
    return c.json({ message: "Invalid token" }, 401)
  }

  await next()

}
