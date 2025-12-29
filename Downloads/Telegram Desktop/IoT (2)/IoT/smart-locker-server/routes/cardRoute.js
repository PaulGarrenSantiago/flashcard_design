// routes/cardRoute.js
import express from 'express';
import {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  toggleCardStatus,
  deleteCard
} from '../controllers/cardController.js';

const router = express.Router();

// Get all cards
router.get('/', getAllCards);

// Get a single card by ID
router.get('/:cardId', getCardById);

// Create a new card
router.post('/', createCard);

// Update card details
router.put('/:cardId', updateCard);

// Toggle card status (active/inactive)
router.patch('/toggle/:cardId', toggleCardStatus);

// Delete a card
router.delete('/:cardId', deleteCard);

export default router;
