import * as activityModel from "../models/activity.model.js";
import { uploadImage, deleteImage } from "../utils/image.js";
export const getActivities = async () => {
    return await activityModel.findAll();
};
export const getActivityById = async (id) => {
    const activity = await activityModel.findById(id);
    if (!activity) {
        return null;
    }
    return activity;
};
export const createActivity = async (name, description, image, url) => {
    let imageUrl = null;
    let imagePublicId = null;
    if (image) {
        const imageUpload = await uploadImage(image, "activities");
        imageUrl = imageUpload.url;
        imagePublicId = imageUpload.public_id;
    }
    return await activityModel.create({
        name,
        description,
        image_url: imageUrl,
        image_public_id: imagePublicId,
        url
    });
};
export const updateActivity = async (id, data) => {
    const activity = await activityModel.findById(id);
    if (!activity) {
        return null; // ⬅️ jangan throw
    }
    if (data.image instanceof File) {
        if (activity.image_public_id) {
            await deleteImage(activity.image_public_id);
        }
        const image = await uploadImage(data.image, "activities");
        data.image_url = image.url;
        data.image_public_id = image.public_id;
    }
    delete data.image;
    return await activityModel.update(id, data);
};
export const deleteActivity = async (id) => {
    const activity = await activityModel.findById(id);
    if (!activity) {
        return null;
    }
    if (activity.image_public_id) {
        await deleteImage(activity.image_public_id);
    }
    await activityModel.remove(id);
    return activity;
};
