import type { Context } from "hono"
import * as aspirationService from "../services/aspiration.service.js"

export const getAll = async (c: Context) => {
  try {

    const aspirations = await aspirationService.getAspirations()

    return c.json(aspirations)

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}

export const getOne = async (c: Context) => {
  try {

    const id = c.req.param("id")

    if (!id) {
      return c.json({ message: "ID is required" }, 400)
    }

    const aspiration = await aspirationService.getAspirationById(id)

    if (!aspiration) {
      return c.json({ message: "Aspiration not found" }, 404)
    }

    return c.json(aspiration)

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}

export const create = async (c: Context) => {
  try {

    const body = await c.req.parseBody()

    const file = body.file as File | undefined

    // 🔥 VALIDASI FILE
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "video/mp4",
        "video/mpeg",
        "application/zip",
        "application/x-rar-compressed"
      ]

      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!allowedTypes.includes(file.type)) {
        return c.json({
          message: "File harus berupa gambar, video, zip, atau rar"
        }, 400)
      }

      if (file.size > maxSize) {
        return c.json({
          message: "Ukuran file maksimal 10MB"
        }, 400)
      }
    }

    const aspiration = await aspirationService.createAspiration({
      name: body.name as string,
      topic: body.topic as string,
      description: body.description as string,
      urgency: Number(body.urgency),
      contact_person: body.contact_person as string,
      category: body.category as string,
      file
    })

    // 🔥 HAPUS FIELD SENSITIF
    const { id, file_url, file_public_id, ...safeData } = aspiration

    return c.json(safeData, 201)

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}

export const remove = async (c: Context) => {
  try {

    const id = c.req.param("id")

    if (!id) {
      return c.json({ message: "ID is required" }, 400)
    }

    const aspiration = await aspirationService.deleteAspiration(id)

    if (!aspiration) {
      return c.json({ message: "Aspiration not found" }, 404)
    }

    return c.json({
      message: "Aspiration deleted successfully"
    })

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}