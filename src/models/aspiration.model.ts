import { sql } from "../config/db.js"

// 🔥 GET ALL + pagination + filter + sorting
export const findAllWithQuery = async ({
  search,
  status,
  sortColumn,
  order,
  limit,
  offset
}: {
  search: string
  status?: string
  sortColumn: string
  order: 'ASC' | 'DESC'
  limit: number
  offset: number
}) => {

  // base query
  let query = sql`
    SELECT * FROM aspirations
    WHERE topic ILIKE ${'%' + search + '%'}
  `

  // optional filter
  if (status) {
    query = sql`
      ${query} AND status = ${status}
    `
  }

  const allowedSort = ['id', 'created_at', 'topic']
  const safeSort = allowedSort.includes(sortColumn) ? sortColumn : 'created_at'

  const safeOrder = order === 'ASC' ? 'ASC' : 'DESC'

  // 🔥 inject manual (AMAN karena sudah whitelist)
  const data = await sql`
    SELECT * FROM aspirations
    WHERE topic ILIKE ${'%' + search + '%'}
    ${status ? sql`AND status = ${status}` : sql``}
    ORDER BY ${sql.unsafe(`${safeSort} ${safeOrder}`)}
    LIMIT ${limit} OFFSET ${offset}
  `

  return data
}

// 🔥 COUNT
export const countAll = async ({
  search,
  status
}: {
  search: string
  status?: string
}) => {

  let query = sql`
    SELECT COUNT(*) FROM aspirations
    WHERE topic ILIKE ${'%' + search + '%'}
  `

  if (status) {
    query = sql`
      ${query} AND status = ${status}
    `
  }

  const result = await query

  return Number(result[0].count)
}

// ✅ GET BY ID
export const findById = async (id: string) => {
  const result = await sql`
    SELECT * FROM aspirations WHERE id = ${id}
  `
  return result[0]
}

// ✅ CREATE
export const create = async (data: any) => {
  const result = await sql`
    INSERT INTO aspirations (
      name,
      topic,
      description,
      urgency,
      contact_person,
      category,
      file_url,
      file_public_id
    )
    VALUES (
      ${data.name},
      ${data.topic},
      ${data.description},
      ${data.urgency},
      ${data.contact_person},
      ${data.category},
      ${data.file_url},
      ${data.file_public_id}
    )
    RETURNING *
  `

  return result[0]
}

// ✅ DELETE
export const remove = async (id: string) => {
  await sql`
    DELETE FROM aspirations WHERE id = ${id}
  `
}