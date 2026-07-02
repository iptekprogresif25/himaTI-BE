import { sql } from "../config/db.js"

export const findAllWithQuery = async ({
  search,
  sortColumn,
  order,
  limit,
  offset
}: {
  search: string
  sortColumn: string
  order: "ASC" | "DESC"
  limit: number
  offset: number
}) => {

  // base query
  let query = sql`
    SELECT * FROM activities
    WHERE name ILIKE ${'%' + search + '%'}
  `

  const data = await sql`
    ${query}
    ORDER BY ${sql.unsafe(`${sortColumn} ${order}`)}
    LIMIT ${limit} OFFSET ${offset}
  `

  return data
}

export const countAll = async ({
  search
}: {
  search: string
}) => {

  const result = await sql`
    SELECT COUNT(*) FROM activities
    WHERE name ILIKE ${'%' + search + '%'}
  `

  return Number(result[0].count)
}

export const findById = async (id: string) => {
  const result = await sql`
    SELECT * FROM activities WHERE id = ${id}
  `
  return result[0]
}

export const create = async (data: any) => {

  const result = await sql`
    INSERT INTO activities (
      name,
      description,
      image_url,
      image_public_id,
      url
    )
    VALUES (
      ${data.name},
      ${data.description},
      ${data.image_url},
      ${data.image_public_id},
      ${data.url}
    )
    RETURNING *
  `

  return result[0]
}


export const update = async (id: string, data: any) => {

  const result = await sql`
    UPDATE activities
    SET
      name = COALESCE(${data.name}, name),
      description = COALESCE(${data.description}, description),
      image_url = COALESCE(${data.image_url}, image_url),
      image_public_id = COALESCE(${data.image_public_id}, image_public_id),
      url = COALESCE(${data.url}, url),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `

  return result[0]
}



export const remove = async (id: string) => {
  await sql`
    DELETE FROM activities WHERE id=${id}
  `
}
