// controllers/userController.js
import User from '../models/User.js';
import Card from '../models/Card.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .populate('rfid_id', 'rfid_uid status')
      .sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, rfid_id } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      rfid_id: rfid_id || null
    });

    // If rfid_id is provided, update the card's assigned_user_id
    if (rfid_id) {
      await Card.findByIdAndUpdate(rfid_id, { assigned_user_id: newUser._id });
    }

    await newUser.save();

    const populatedUser = await User.findById(newUser._id).populate('rfid_id', 'rfid_uid status');

    res.status(201).json({
      success: true,
      data: populatedUser,
      message: 'User created successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, rfid_id } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update basic info
    if (name) user.name = name;
    if (email) {
      // Check if new email is already used by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      user.email = email;
    }

    // Handle card assignment change
    if (rfid_id !== undefined) {
      // Remove old card assignment if exists
      if (user.rfid_id) {
        await Card.findByIdAndUpdate(user.rfid_id, { assigned_user_id: null });
      }

      // Assign new card if provided
      if (rfid_id) {
        await Card.findByIdAndUpdate(rfid_id, { assigned_user_id: userId });
        user.rfid_id = rfid_id;
      } else {
        user.rfid_id = null;
      }
    }

    await user.save();

    const populatedUser = await User.findById(userId).populate('rfid_id', 'rfid_uid status');

    res.status(200).json({
      success: true,
      data: populatedUser,
      message: 'User updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove card assignment
    if (user.rfid_id) {
      await Card.findByIdAndUpdate(user.rfid_id, { assigned_user_id: null });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getAvailableCards = async (req, res) => {
  try {
    // Get cards that are not assigned to any user (or only assigned_user_id is null)
    const availableCards = await Card.find({ assigned_user_id: null })
      .select('rfid_uid status _id');

    res.status(200).json({
      success: true,
      data: availableCards
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};