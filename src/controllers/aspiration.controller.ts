import type { Context } from "hono"
import * as aspirationService from "../services/aspiration.service.js"
import { convertHeicToJpg } from "../utils/image.js"

export const getAll = async (c: Context) => {
  try {
    const result = await aspirationService.getAllWithQuery(c)
    return c.json(result)
  } catch (err) {
    console.error(err)
    return c.json({ message: "Internal Server Error" }, 500)
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

    let file = body.file as File | undefined

    if (file) {

      const isHeic = [
        "image/heic",
        "image/heif"
      ].includes(file.type)
      ||
      /\.(heic|heif)$/i.test(file.name)

      if (isHeic) {
        file = await convertHeicToJpg(file)
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "application/zip",
        "application/x-rar-compressed"
      ]

      if (!allowedTypes.includes(file.type)) {
        return c.json({
          message: "Format file tidak didukung"
        }, 400)
      }
    }

    const aspiration =
      await aspirationService.createAspiration({
        name: body.name as string,
        topic: body.topic as string,
        description: body.description as string,
        urgency: Number(body.urgency),
        contact_person: body.contact_person as string,
        category: body.category as string,
        file
      })

    return c.json(aspiration, 201)

  } catch(err) {

    console.error(err)

    return c.json({
      message:"Internal Server Error"
    },500)

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