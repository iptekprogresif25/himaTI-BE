import * as activityModel from "../models/activity.model.js"
import { uploadImage, deleteImage } from "../utils/image.js"

export const getActivities = async () => {
  return await activityModel.findAll()
}

export const getActivityById = async (id: string) => {

  const activity = await activityModel.findById(id)

  if (!activity) {
    return null
  }

  return activity
}


export const createActivity = async (
  name: string,
  description: string,
  image: File,
  url: string
) => {

  const imageUpload = await uploadImage(image,"activity")

  return await activityModel.create({
    name,
    description,
    image_url: imageUpload.url,
    image_public_id: imageUpload.public_id,
    url
  })

}

export const updateActivity = async (
  id: string,
  data: any
) => {

  const activity = await activityModel.findById(id)

  if (!activity) {
    throw new Error("Activity not found")
  }

  if (data.image) {

    if (activity.image_public_id) {
      await deleteImage(activity.image_public_id)
    }

    const image = await uploadImage(data.image, "activity")

    data.image_url = image.url
    data.image_public_id = image.public_id
  }

  return await activityModel.update(id, data)

}

export const deleteActivity = async (id: string) => {

  const activity = await activityModel.findById(id)

  if (!activity) {
    return null
  }

  if (activity.image_public_id) {
    await deleteImage(activity.image_public_id)
  }

  await activityModel.remove(id)

  return activity
}

