import express from 'express';
import { getLeads } from '../controllers/adminLeadsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getLeads);

export default router;