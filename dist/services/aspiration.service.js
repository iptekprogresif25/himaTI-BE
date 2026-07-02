import * as AspirationModel from "../models/aspiration.model.js";
import { uploadImage, deleteImage } from "../utils/image.js";
import { createMeta, getQueryOptions } from "../utils/queryBuilder.js";
// ✅ GET ALL
export const getAllWithQuery = async (c) => {
    // 🔥 semua diambil dari queryBuilder
    const { page, limit, offset, search, sortBy, order } = getQueryOptions(c, { defaultLimit: 6 });
    // 🔒 whitelist sorting
    const allowedSort = ['id', 'created_at', 'topic'];
    const sortColumn = allowedSort.includes(sortBy)
        ? sortBy
        : 'created_at';
    // 🔍 filter tambahan
    const status = c.req.query('status') || undefined;
    const data = await AspirationModel.findAllWithQuery({
        search,
        status,
        sortColumn,
        order, // ✅ langsung dari queryBuilder
        limit,
        offset
    });
    const total = await AspirationModel.countAll({
        search,
        status
    });
    return {
        data,
        meta: createMeta(page, limit, total)
    };
};
// ✅ GET BY ID
export const getAspirationById = async (id) => {
    const aspiration = await AspirationModel.findById(id);
    if (!aspiration) {
        return null;
    }
    return aspiration;
};
// ✅ CREATE
export const createAspiration = async (data) => {
    let file_public_id = null;
    let file_url = null;
    // 🔥 upload file (optional)
    if (data.file) {
        const fileUpload = await uploadImage(data.file, "aspirations");
        file_url = fileUpload.url;
        file_public_id = fileUpload.public_id;
    }
    return await AspirationModel.create({
        name: data.name,
        topic: data.topic,
        description: data.description,
        urgency: data.urgency,
        contact_person: data.contact_person,
        category: data.category,
        file_url,
        file_public_id
    });
};
// ✅ DELETE
export const deleteAspiration = async (id) => {
    const aspiration = await AspirationModel.findById(id);
    if (!aspiration) {
        return null;
    }
    // 🔥 hapus image
    if (aspiration.file_public_id) {
        await deleteImage(aspiration.file_public_id);
    }
    await AspirationModel.remove(id);
    return aspiration;
};
