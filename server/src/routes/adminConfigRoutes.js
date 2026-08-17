import express from 'express';

import {
  getAdminConfig,
  updateConfig
} from '../controllers/adminConfigController.js';

import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getAdminConfig);

router.put('/', authenticate, updateConfig);

export default router;