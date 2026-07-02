import { Hono } from "hono";
import { createAssetRequest, getAssetRequests, updateAssetRequestStatus, deleteAssetRequest } from '../controllers/assetRequest.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const assetRequestRoute = new Hono();
assetRequestRoute.post('/', createAssetRequest);
assetRequestRoute.get('/', authMiddleware, getAssetRequests);
assetRequestRoute.put('/:id/status', authMiddleware, updateAssetRequestStatus);
assetRequestRoute.delete('/:id', authMiddleware, deleteAssetRequest);
export default assetRequestRoute;
