import { createAssetRequestSchema, updateAssetRequestStatusSchema } from '../validators/assetRequest.validator.js';
import * as AssetRequestModel from '../models/assetRequest.model.js';
export const createAssetRequest = async (c) => {
    try {
        const body = await c.req.json();
        const validatedData = createAssetRequestSchema.parse(body);
        const newRequest = await AssetRequestModel.create(validatedData);
        return c.json({ success: true, data: newRequest }, 201);
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return c.json({ success: false, message: 'Data tidak valid', errors: error.errors }, 400);
        }
        console.error('Error creating asset request:', error);
        return c.json({ success: false, message: 'Gagal mengajukan request', error: error.message }, 500);
    }
};
export const getAssetRequests = async (c) => {
    try {
        const requests = await AssetRequestModel.findAll();
        return c.json({ success: true, data: requests }, 200);
    }
    catch (error) {
        console.error('Error fetching asset requests:', error);
        return c.json({ success: false, message: 'Gagal mengambil data request', error: error.message }, 500);
    }
};
import { sendApprovalEmail } from '../utils/mailer.js';
import * as DigitalAssetModel from '../models/digitalAsset.model.js';
export const updateAssetRequestStatus = async (c) => {
    try {
        const id = c.req.param("id");
        if (!id)
            return c.json({ success: false, message: "ID is required" }, 400);
        const body = await c.req.json();
        const validatedData = updateAssetRequestStatusSchema.parse(body);
        const updatedRequest = await AssetRequestModel.updateStatus(id, validatedData.status);
        if (!updatedRequest) {
            return c.json({ success: false, message: 'Request tidak ditemukan' }, 404);
        }
        let emailWarning = null;
        if (validatedData.status === 'approved' && updatedRequest.email) {
            try {
                const asset = await DigitalAssetModel.findById(updatedRequest.asset_id);
                if (asset) {
                    const emailResult = await sendApprovalEmail(updatedRequest.email, asset.title, updatedRequest.name);
                    if (emailResult && !emailResult.success) {
                        emailWarning = `Peringatan: Gagal mengirim email ke ${updatedRequest.email}. Alasan: ${emailResult.error}`;
                    }
                }
            }
            catch (err) {
                console.error('Failed to process approval email:', err);
                emailWarning = `Peringatan: Terjadi kesalahan saat mencoba mengirim email. ${err.message}`;
            }
        }
        return c.json({
            success: true,
            data: updatedRequest,
            warning: emailWarning
        }, 200);
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return c.json({ success: false, message: 'Data tidak valid', errors: error.errors }, 400);
        }
        console.error('Error updating asset request status:', error);
        return c.json({ success: false, message: 'Gagal update status request', error: error.message }, 500);
    }
};
export const deleteAssetRequest = async (c) => {
    try {
        const id = c.req.param("id");
        if (!id)
            return c.json({ success: false, message: "ID is required" }, 400);
        const deleted = await AssetRequestModel.remove(id);
        if (!deleted) {
            return c.json({ success: false, message: 'Request tidak ditemukan' }, 404);
        }
        return c.json({ success: true, message: 'Request berhasil dihapus' }, 200);
    }
    catch (error) {
        console.error('Error deleting asset request:', error);
        return c.json({ success: false, message: 'Gagal menghapus request', error: error.message }, 500);
    }
};
