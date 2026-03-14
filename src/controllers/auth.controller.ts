import type { Context } from 'hono'
import * as authService from '../services/auth.service.js'

export const login = async (c: Context) => {

  const body = await c.req.json()

  const token = await authService.login(body.email, body.password)

  return c.json({ token })

}
