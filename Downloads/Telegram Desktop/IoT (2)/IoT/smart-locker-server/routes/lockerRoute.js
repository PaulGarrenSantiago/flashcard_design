// routes/lockerRoutes.js
import express from 'express';
import {
  getLockerDetails,
  getAllLockers,
  assignLockerToUser,
  releaseLocker,
  updateLockerAccess,
  getLockerStats
} from '../controllers/lockerController.js'; // adjust path

const lockerRoute = express.Router();

// Get stats for dashboard
lockerRoute.get('/stats', getLockerStats);

// Get all lockers (for dashboard)
lockerRoute.get('/', getAllLockers);

// Get a single locker by ID
lockerRoute.get('/:id', getLockerDetails);

// Assign a locker to a user
lockerRoute.post('/assign-user', assignLockerToUser);

// Release a locker
lockerRoute.post('/release', releaseLocker);

// Update locker access timestamp
lockerRoute.patch('/access', updateLockerAccess);

export default lockerRoute;
