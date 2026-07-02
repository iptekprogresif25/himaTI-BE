import * as DigitalAssetModel from "../models/digitalAsset.model.js";
import { uploadImage, deleteImage } from "../utils/image.js";
import { getQueryOptions, createMeta } from "../utils/queryBuilder.js";
export const getAllDigitalAssets = async (c) => {
    const { page, limit, offset, search, sortBy, order } = getQueryOptions(c, { defaultLimit: 8 });
    const allowedSort = ['id', 'created_at', 'title'];
    const sortColumn = allowedSort.includes(sortBy)
        ? sortBy
        : 'created_at';
    const data = await DigitalAssetModel.findAllWithQuery({
        search,
        sortColumn,
        order,
        limit,
        offset
    });
    const total = await DigitalAssetModel.countAll({
        search
    });
    return {
        data,
        meta: createMeta(page, limit, total)
    };
};
export const getDigitalAssetById = async (id) => {
    const asset = await DigitalAssetModel.findById(id);
    if (!asset)
        return null;
    return asset;
};
export const createDigitalAsset = async (title, desc, category, type, tech_stack, features, steps, repo_url, guide_url, icon, demo_url, stats, difficulty, system_req, is_hot, is_recommended, developer, testimonial, changelog, faqs, image) => {
    let imageUpload = { url: null, public_id: null };
    if (image) {
        imageUpload = await uploadImage(image, "digital_assets");
    }
    return await DigitalAssetModel.create({
        title,
        desc,
        category,
        type,
        tech_stack, // expect JSON string
        features, // expect JSON string
        steps, // expect JSON string
        repo_url,
        guide_url,
        image_url: imageUpload.url,
        image_public_id: imageUpload.public_id,
        icon,
        demo_url,
        stats,
        difficulty,
        system_req,
        is_hot,
        is_recommended,
        developer,
        testimonial,
        changelog,
        faqs
    });
};
export const updateDigitalAsset = async (id, data) => {
    const asset = await DigitalAssetModel.findById(id);
    if (!asset) {
        throw new Error("Digital Asset not found");
    }
    if (data.image) {
        if (asset.image_public_id) {
            await deleteImage(asset.image_public_id);
        }
        const image = await uploadImage(data.image, "digital_assets");
        data.image_url = image.url;
        data.image_public_id = image.public_id;
        delete data.image;
    }
    return await DigitalAssetModel.update(id, data);
};
export const deleteDigitalAsset = async (id) => {
    const asset = await DigitalAssetModel.findById(id);
    if (!asset) {
        return null;
    }
    if (asset.image_public_id) {
        await deleteImage(asset.image_public_id);
    }
    await DigitalAssetModel.remove(id);
    return asset;
};
export const likeDigitalAsset = async (id) => {
    const asset = await DigitalAssetModel.findById(id);
    if (!asset)
        return null;
    return await DigitalAssetModel.incrementLikes(id);
};
