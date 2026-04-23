import type { Context } from 'hono'

export const getQueryOptions = (
  c: Context,
  options?: {
    defaultLimit?: number
    maxLimit?: number
  }
) => {

  const defaultLimit = options?.defaultLimit ?? 10
  const maxLimit = options?.maxLimit ?? 50

  const page = Math.max(parseInt(c.req.query('page') || '1'), 1)
  const limit = Math.min(
    parseInt(c.req.query('limit') || String(defaultLimit)),
    maxLimit
  )
  const offset = (page - 1) * limit

  const search = c.req.query('search') || ''

  const sortBy = c.req.query('sortBy') || 'created_at'

  // 🔥 FIX DI SINI
  const order: "ASC" | "DESC" =
    c.req.query('order') === 'asc' ? 'ASC' : 'DESC'

  return { page, limit, offset, search, sortBy, order }
}

export const createMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit)
})