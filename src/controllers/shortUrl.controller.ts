import type { Context } from 'hono';
import * as shortUrlModel from '../models/shortUrl.model.js';

export const createShortUrl = async (c: Context) => {
  try {
    const { short_code, original_url } = await c.req.json();
    const newUrl = await shortUrlModel.createShortUrl(short_code, original_url);
    return c.json({ success: true, data: newUrl }, 201);
  } catch (error: any) {
    if (error.code === '23505') { // unique violation in Postgres
      return c.json({ success: false, message: 'Short code sudah digunakan' }, 400);
    }
    return c.json({ success: false, message: 'Terjadi kesalahan internal', error: error.message }, 500);
  }
};

export const getShortUrls = async (c: Context) => {
  try {
    const urls = await shortUrlModel.getShortUrls();
    return c.json({ success: true, data: urls });
  } catch (error: any) {
    return c.json({ success: false, message: 'Terjadi kesalahan internal', error: error.message }, 500);
  }
};

export const updateShortUrl = async (c: Context) => {
  try {
    const id = c.req.param('id') as string;
    const { short_code, original_url } = await c.req.json();
    const updatedUrl = await shortUrlModel.updateShortUrl(id, short_code, original_url);
    if (!updatedUrl) {
      return c.json({ success: false, message: 'URL tidak ditemukan' }, 404);
    }
    return c.json({ success: true, data: updatedUrl });
  } catch (error: any) {
    if (error.code === '23505') {
      return c.json({ success: false, message: 'Short code sudah digunakan' }, 400);
    }
    return c.json({ success: false, message: 'Terjadi kesalahan internal', error: error.message }, 500);
  }
};

export const deleteShortUrl = async (c: Context) => {
  try {
    const id = c.req.param('id') as string;
    await shortUrlModel.deleteShortUrl(id);
    return c.json({ success: true, message: 'URL berhasil dihapus' });
  } catch (error: any) {
    return c.json({ success: false, message: 'Terjadi kesalahan internal', error: error.message }, 500);
  }
};

export const redirectShortUrl = async (c: Context) => {
  try {
    const code = c.req.param('code') as string;
    const url = await shortUrlModel.findAndIncrementClicks(code);
    if (!url) {
      return c.json({ success: false, message: 'URL tidak ditemukan' }, 404);
    }
    return c.json({ success: true, data: { original_url: url.original_url } });
  } catch (error: any) {
    return c.json({ success: false, message: 'Terjadi kesalahan internal', error: error.message }, 500);
  }
};
