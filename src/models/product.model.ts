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

  const data = await sql`
    SELECT * FROM products
    WHERE name ILIKE ${'%' + search + '%'}
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
    SELECT COUNT(*) FROM products
    WHERE name ILIKE ${'%' + search + '%'}
  `

  return Number(result[0].count)
}

export const findById = async (id: string) => {
  const result = await sql`
    SELECT * FROM products WHERE id = ${id}
  `
  return result[0]
}

export const create = async (data: any) => {

  const result = await sql`
    INSERT INTO products (
      name,
      description,
      category,
      image_url,
      image_public_id,
      url,
      price
    )
    VALUES (
      ${data.name},
      ${data.description},
      ${data.category},
      ${data.image_url},
      ${data.image_public_id},
      ${data.url},
      ${data.price}
    )
    RETURNING *
  `

  return result[0]
}


export const update = async (id: string, data: any) => {

  const result = await sql`
    UPDATE products
    SET
      name = COALESCE(${data.name}, name),
      description = COALESCE(${data.description}, description),
      category = COALESCE(${data.category}, category),
      image_url = COALESCE(${data.image_url}, image_url),
      image_public_id = COALESCE(${data.image_public_id}, image_public_id),
      url = COALESCE(${data.url}, url),
      price = COALESCE(${data.price}, price),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `

  return result[0]
}



export const remove = async (id: string) => {
  await sql`
    DELETE FROM products WHERE id=${id}
  `
}
