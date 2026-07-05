import type { Context } from "hono";
import { createAssetRequestSchema, updateAssetRequestStatusSchema } from '../validators/assetRequest.validator.js';
import * as AssetRequestModel from '../models/assetRequest.model.js';

export const createAssetRequest = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = createAssetRequestSchema.parse(body);

    const newRequest = await AssetRequestModel.create(validatedData);
    return c.json({ success: true, data: newRequest }, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ success: false, message: 'Data tidak valid', errors: error.errors }, 400);
    }
    console.error('Error creating asset request:', error);
    return c.json({ success: false, message: 'Gagal mengajukan request', error: error.message }, 500);
  }
};

export const getAssetRequests = async (c: Context) => {
  try {
    const requests = await AssetRequestModel.findAll();
    return c.json({ success: true, data: requests }, 200);
  } catch (error: any) {
    console.error('Error fetching asset requests:', error);
    return c.json({ success: false, message: 'Gagal mengambil data request', error: error.message }, 500);
  }
};

export const getAssetBookedDates = async (c: Context) => {
  try {
    const assetId = c.req.param("assetId");
    if (!assetId) return c.json({ success: false, message: "Asset ID is required" }, 400);

    const bookedDates = await AssetRequestModel.findBookedDatesByAssetId(assetId);
    return c.json({ success: true, data: bookedDates }, 200);
  } catch (error: any) {
    console.error('Error fetching booked dates:', error);
    return c.json({ success: false, message: 'Gagal mengambil data tanggal peminjaman', error: error.message }, 500);
  }
};

import { sendApprovalEmail } from '../utils/mailer.js';
import * as DigitalAssetModel from '../models/digitalAsset.model.js';

export const updateAssetRequestStatus = async (c: Context) => {
  try {
    const id = c.req.param("id");
    if (!id) return c.json({ success: false, message: "ID is required" }, 400);

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
          const links = {
            demo_url: asset.demo_url,
            repo_url: asset.repo_url,
            guide_url: asset.guide_url
          };
          const emailResult = await sendApprovalEmail(updatedRequest.email, asset.title, updatedRequest.name, links);
          if (emailResult && !emailResult.success) {
             emailWarning = `Peringatan: Gagal mengirim email ke ${updatedRequest.email}. Alasan: ${emailResult.error}`;
          }
        }
      } catch (err: any) {
        console.error('Failed to process approval email:', err);
        emailWarning = `Peringatan: Terjadi kesalahan saat mencoba mengirim email. ${err.message}`;
      }
    }

    return c.json({ 
      success: true, 
      data: updatedRequest, 
      warning: emailWarning 
    }, 200);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ success: false, message: 'Data tidak valid', errors: error.errors }, 400);
    }
    console.error('Error updating asset request status:', error);
    return c.json({ success: false, message: 'Gagal update status request', error: error.message }, 500);
  }
};

export const deleteAssetRequest = async (c: Context) => {
  try {
    const id = c.req.param("id");
    if (!id) return c.json({ success: false, message: "ID is required" }, 400);

    const deleted = await AssetRequestModel.remove(id);
    if (!deleted) {
      return c.json({ success: false, message: 'Request tidak ditemukan' }, 404);
    }
    return c.json({ success: true, message: 'Request berhasil dihapus' }, 200);
  } catch (error: any) {
    console.error('Error deleting asset request:', error);
    return c.json({ success: false, message: 'Gagal menghapus request', error: error.message }, 500);
  }
};
