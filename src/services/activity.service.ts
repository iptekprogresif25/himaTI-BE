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
  image: File | undefined,
  url: string
) => {

  let imageUrl: string | null = null
  let imagePublicId: string | null = null

  if (image) {
    const imageUpload = await uploadImage(image, "activities")
    imageUrl = imageUpload.url
    imagePublicId = imageUpload.public_id
  }

  return await activityModel.create({
    name,
    description,
    image_url: imageUrl,
    image_public_id: imagePublicId,
    url
  })

}


export const updateActivity = async (
  id: string,
  data: any
) => {

  const activity = await activityModel.findById(id)

  if (!activity) {
    return null // ⬅️ jangan throw
  }

  if (data.image instanceof File) {

    if (activity.image_public_id) {
      await deleteImage(activity.image_public_id)
    }

    const image = await uploadImage(data.image, "activities")

    data.image_url = image.url
    data.image_public_id = image.public_id
  }

  delete data.image

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

