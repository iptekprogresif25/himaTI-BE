import { sql } from "../config/db.js"

export const findAll = async () => {
  return await sql`
    SELECT * FROM products
    ORDER BY created_at DESC
  `
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
      url
    )
    VALUES (
      ${data.name},
      ${data.description},
      ${data.category},
      ${data.image_url},
      ${data.image_public_id},
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
