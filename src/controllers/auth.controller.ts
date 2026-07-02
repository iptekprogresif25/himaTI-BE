import type { Context } from 'hono'
import * as authService from '../services/auth.service.js'

export const loginHandler = async (c: Context) => {
  try {
    const { email, password } = await c.req.json()

    const result = await authService.login(email, password)

    return c.json({
      message: result.message,
      data: result.data
    }, result.status as 200 | 201 | 400 | 401 | 404 | 500) 
  } catch (err) {
    return c.json({
      message: "Internal Server Error"
    }, 500)
  }
}
