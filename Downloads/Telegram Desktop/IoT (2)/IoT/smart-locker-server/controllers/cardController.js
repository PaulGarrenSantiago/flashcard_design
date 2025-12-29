import Card from '../models/Card.js';
import User from '../models/User.js';

// Get all cards with user details
export const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({})
      .populate('assigned_user_id', 'name email')
      .sort({ rfid_uid: 1 });

    res.status(200).json({
      success: true,
      data: cards
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get a single card by ID
export const getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId).populate('assigned_user_id', 'name email');

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }

    res.status(200).json({
      success: true,
      data: card
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Create a new card
export const createCard = async (req, res) => {
  try {
    const { rfid_uid, status } = req.body;

    if (!rfid_uid) {
      return res.status(400).json({
        success: false,
        message: 'RFID UID is required'
      });
    }

    // Check if card with same UID already exists
    const existingCard = await Card.findOne({ rfid_uid });
    if (existingCard) {
      return res.status(400).json({
        success: false,
        message: 'Card with this UID already exists'
      });
    }

    const newCard = new Card({
      rfid_uid,
      status: status || 'inactive',
      assigned_user_id: null
    });

    await newCard.save();

    res.status(201).json({
      success: true,
      data: newCard,
      message: 'Card created successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update card details
export const updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { rfid_uid, status } = req.body;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }

    // Check if new UID is already used by another card
    if (rfid_uid && rfid_uid !== card.rfid_uid) {
      const existingCard = await Card.findOne({ rfid_uid });
      if (existingCard) {
        return res.status(400).json({
          success: false,
          message: 'Card with this UID already exists'
        });
      }
      card.rfid_uid = rfid_uid;
    }

    if (status) {
      card.status = status;
    }

    await card.save();

    const populatedCard = await Card.findById(cardId).populate('assigned_user_id', 'name email');

    res.status(200).json({
      success: true,
      data: populatedCard,
      message: 'Card updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Toggle card status (active/inactive)
export const toggleCardStatus = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }

    // Toggle the status
    card.status = card.status === 'active' ? 'inactive' : 'active';
    await card.save();

    res.status(200).json({
      success: true,
      message: `Card has been ${card.status === 'active' ? 'activated' : 'deactivated'}`,
      data: card
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Delete a card
export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }

    // If card is assigned to a user, remove the assignment
    if (card.assigned_user_id) {
      await User.findByIdAndUpdate(card.assigned_user_id, { rfid_id: null });
    }

    await Card.findByIdAndDelete(cardId);

    res.status(200).json({
      success: true,
      message: 'Card deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
