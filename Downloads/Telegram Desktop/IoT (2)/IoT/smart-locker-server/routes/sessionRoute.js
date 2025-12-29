// routes/sessionRoutes.js
import express from 'express';
import { getRecentSessions } from '../controllers/sessionController.js'; // adjust path

const router = express.Router();

// Route to get the 15 most recent sessions
router.get('/recent', getRecentSessions);

export default router;
