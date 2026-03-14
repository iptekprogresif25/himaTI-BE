import type { Context } from "hono"
import * as activityService from "../services/activity.service.js"

export const getAll = async (c: Context) => {
  try {

    const activities = await activityService.getActivities()

    return c.json(activities)

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

    const activity = await activityService.getActivityById(id)

    if (!activity) {
      return c.json({ message: "Activity not found" }, 404)
    }

    return c.json(activity)

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

    const activity = await activityService.createActivity(
      body.name as string,
      body.description as string,
      body.image as File,
      body.url as string
    )

    return c.json(activity, 201)

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}

export const update = async (c: Context) => {
  try {

    const id = c.req.param("id")

    if (!id) {
      return c.json({ message: "ID is required" }, 400)
    }

    const body = await c.req.parseBody()

    const activity = await activityService.updateActivity(id, body)

    if (!activity) {
      return c.json({ message: "Activity not found" }, 404)
    }

    return c.json(activity)

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

    const activity = await activityService.deleteActivity(id)

    if (!activity) {
      return c.json({ message: "Activity not found" }, 404)
    }

    return c.json({
      message: "Activity deleted successfully"
    })

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}