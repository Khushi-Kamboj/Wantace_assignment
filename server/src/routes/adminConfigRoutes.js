import express from 'express';
import { updateConfig } from '../controllers/adminConfigController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/', authenticate, updateConfig);

export default router;