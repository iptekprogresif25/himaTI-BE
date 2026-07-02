import type { Context } from "hono"
import * as digitalAssetService from "../services/digitalAsset.service.js"

export const getAll = async (c: Context) => {
  try {
    const result = await digitalAssetService.getAllDigitalAssets(c)
    return c.json(result)
  } catch (err) {
    console.error(err)
    return c.json({ message: "Internal Server Error" }, 500)
  }
}

export const getOne = async (c: Context) => {
  try {
    const id = c.req.param("id")
    if (!id) return c.json({ message: "ID is required" }, 400)

    const asset = await digitalAssetService.getDigitalAssetById(id)
    if (!asset) return c.json({ message: "Digital Asset not found" }, 404)

    return c.json(asset)
  } catch (err) {
    console.error(err)
    return c.json({ message: "Internal Server Error" }, 500)
  }
}

export const create = async (c: Context) => {
  try {
    const body = await c.req.parseBody()

    const asset = await digitalAssetService.createDigitalAsset(
      body.title as string,
      body.desc as string,
      body.category as string,
      body.type as string,
      (body.tech_stack as string) || "[]",
      (body.features as string) || "[]",
      (body.steps as string) || "[]",
      (body.repo_url as string) || "",
      (body.guide_url as string) || "",
      (body.icon as string) || "Gamepad2",
      (body.demo_url as string) || "",
      (body.stats as string) || "{}",
      (body.difficulty as string) || "",
      (body.system_req as string) || "",
      String(body.is_hot) === 'true',
      String(body.is_recommended) === 'true',
      (body.developer as string) || "{}",
      (body.testimonial as string) || "{}",
      (body.changelog as string) || "[]",
      (body.faqs as string) || "[]",
      body.image as File | undefined
    )

    return c.json(asset, 201)
  } catch (err) {
    console.error(err)
    return c.json({ message: "Internal Server Error" }, 500)
  }
}

export const update = async (c: Context) => {
  try {
    const id = c.req.param("id")
    if (!id) return c.json({ message: "ID is required" }, 400)

    const body = await c.req.parseBody()
    const data: any = {}

    if (typeof body.title === "string") data.title = body.title
    if (typeof body.desc === "string") data.desc = body.desc
    if (typeof body.category === "string") data.category = body.category
    if (typeof body.type === "string") data.type = body.type
    if (typeof body.tech_stack === "string") data.tech_stack = body.tech_stack
    if (typeof body.features === "string") data.features = body.features
    if (typeof body.steps === "string") data.steps = body.steps
    if (typeof body.repo_url === "string") data.repo_url = body.repo_url
    if (typeof body.guide_url === "string") data.guide_url = body.guide_url
    if (typeof body.icon === "string") data.icon = body.icon
    if (typeof body.demo_url === "string") data.demo_url = body.demo_url
    if (typeof body.stats === "string") data.stats = body.stats
    if (typeof body.difficulty === "string") data.difficulty = body.difficulty
    if (typeof body.system_req === "string") data.system_req = body.system_req
    if (body.is_hot !== undefined) data.is_hot = String(body.is_hot) === 'true'
    if (body.is_recommended !== undefined) data.is_recommended = String(body.is_recommended) === 'true'
    if (typeof body.developer === "string") data.developer = body.developer
    if (typeof body.testimonial === "string") data.testimonial = body.testimonial
    if (typeof body.changelog === "string") data.changelog = body.changelog
    if (typeof body.faqs === "string") data.faqs = body.faqs

    if (body.image instanceof File) {
      data.image = body.image
    }

    const asset = await digitalAssetService.updateDigitalAsset(id, data)
    if (!asset) return c.json({ message: "Digital Asset not found" }, 404)

    return c.json(asset)
  } catch (err) {
    console.error(err)
    return c.json({ message: "Internal Server Error" }, 500)
  }
}

export const remove = async (c: Context) => {
  try {
    const id = c.req.param("id")
    if (!id) return c.json({ message: "ID is required" }, 400)

    const asset = await digitalAssetService.deleteDigitalAsset(id)
    if (!asset) return c.json({ message: "Digital Asset not found" }, 404)

    return c.json({ message: "Digital Asset deleted successfully" })
  } catch (err) {
    console.error(err)
    return c.json({ message: "Internal Server Error" }, 500)
  }
}

export const like = async (c: Context) => {
  try {
    const id = c.req.param("id")
    if (!id) return c.json({ message: "ID is required" }, 400)
    
    const result = await digitalAssetService.likeDigitalAsset(id)
    if (!result) return c.json({ message: "Digital Asset not found" }, 404)
    
    return c.json(result)
  } catch (err) {
    console.error(err)
    return c.json({ message: "Internal Server Error" }, 500)
  }
}
