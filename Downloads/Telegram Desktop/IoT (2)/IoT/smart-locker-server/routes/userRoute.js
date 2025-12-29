// routes/userRoute.js
import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, getAvailableCards } from '../controllers/userController.js';

const router = express.Router();

// Get all users
router.get('/', getUsers);

// Get available cards (not assigned to any user)
router.get('/cards/available', getAvailableCards);

// Create new user
router.post('/', createUser);

// Update user
router.put('/:userId', updateUser);

// Delete user
router.delete('/:userId', deleteUser);

export default router;