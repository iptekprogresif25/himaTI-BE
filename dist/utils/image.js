import cloudinary from "../config/cloudinary.js";
import heicConvert from "heic-convert";
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
export const convertHeicToJpg = async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const outputBuffer = await heicConvert({
        buffer,
        format: "JPEG",
        quality: 0.9
    });
    const fileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
    return new File([new Uint8Array(outputBuffer)], fileName, {
        type: "image/jpeg"
    });
};
