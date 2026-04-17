import { sql } from "../config/db.js"

// ✅ GET ALL
export const findAll = async () => {
  return await sql`
    SELECT * FROM aspirations
    ORDER BY created_at DESC
  `
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