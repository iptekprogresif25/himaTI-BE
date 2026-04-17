import cloudinary from "../config/cloudinary.js";
export const uploadImage = async (file, folderName) => {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
        folder: "assets/" + folderName
    });
    return {
        url: result.secure_url,
        public_id: result.public_id
    };
};
export const deleteImage = async (publicId) => {
    await cloudinary.uploader.destroy(publicId);
};
