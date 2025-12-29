import express from 'express';
import { getRecentAccessLogs } from '../controllers/accessLogController.js';

const router = express.Router();

// Route to get the 50 most recent access logs
router.get('/recent', getRecentAccessLogs);

export default router;
