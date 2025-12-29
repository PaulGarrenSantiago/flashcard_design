import mongoose from 'mongoose';
import Locker from '../models/Locker.js';
import User from '../models/User.js';
import SessionLogs from '../models/SessionLogs.js';

export const getLockerDetails = async (req, res) => {
    try{
        const lockerId = req.params.id;

        const locker = await Locker.findById(req.params.id).populate("assigned_user_id", "name").lean();

        if (!locker) {
            return res.status(404).json({ success: false, message: "Locker not found" });
        }

        let duration = null;
        if (locker.issued_at) {
            const endTime = locker.expired_at || new Date();
            duration = endTime.getTime() - new Date(locker.issued_at).getTime(); 
        }

        res.status(200).json({
            success: true,
            data: {
                _id: locker._id,
                locker_number: locker.locker_number,
                status: locker.status,
                user: locker.assigned_user_id,
                issued_at: locker.issued_at,
                expired_at: locker.expired_at,
                accessed_at: locker.accessed_at,
                duration
            }
        });
    } catch(error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const getAllLockers = async (req, res) => {
    try{
        const lockers = await Locker.find({}, "locker_number status _id").sort({ locker_number: 1}).lean();

        const dashboardData = lockers.map(locker => ({
            _id: locker._id,
            locker_number: locker.locker_number,
            status: locker.status
        }));

        res.status(200).json({ success: true, data: dashboardData });  
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const assignLockerToUser = async (req, res) => {
    try {
        const { lockerId, userId } = req.body;

        if (!lockerId || !userId) {
            return res.status(400).json({ 
                success: false, 
                message: "lockerId and userId are required" 
            });
        }

        const locker = await Locker.findById(lockerId);
        if (!locker) {
            return res.status(404).json({ 
                success: false, 
                message: "Locker not found" 
            });
        }

        if (locker.status === "occupied") {
            return res.status(400).json({ 
                success: false, 
                message: "Locker is already occupied" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Check if user already has a locker
        const userHasLocker = await Locker.findOne({
            assigned_user_id: userId,
            status: "occupied"
        });

        if (userHasLocker) {
            return res.status(400).json({ 
                success: false, 
                message: "User already has an assigned locker" 
            });
        }

        // If there's an existing user, release that locker first
        if (locker.assigned_user_id) {
            await User.findByIdAndUpdate(locker.assigned_user_id, { locker_id: null });
        }

        locker.assigned_user_id = userId;
        locker.status = "occupied";
        locker.issued_at = new Date();
        locker.accessed_at = new Date();
        locker.expired_at = null;

        await locker.save();

        user.locker_id = locker._id;
        await user.save();

        // Create session log
        const sessionLog = new SessionLogs({
            locker_number: locker._id,
            rfid_id: user.rfid_id || null,
            user: userId,
            time_in: locker.issued_at
        });
        await sessionLog.save();

        const populatedLocker = await Locker.findById(lockerId).populate("assigned_user_id", "name email");

        res.status(200).json({
            success: true,
            message: "Locker successfully assigned to user",
            data: populatedLocker
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
};

export const releaseLocker = async (req, res) => {
    try {
        const { lockerId } = req.body;

        const locker = await Locker.findById(lockerId);
        if (!locker) return res.status(404).json({ error: "Locker not found" });

        const userId = locker.assigned_user_id;

        locker.assigned_user_id = null;
        locker.status = "available";
        locker.expired_at = new Date();
        locker.accessed_at = null;

        await locker.save();

        if (userId) {
            await User.findByIdAndUpdate(userId, { locker_id: null });

            // Update session log with time_out
            await SessionLogs.findOneAndUpdate(
                { locker_number: locker._id, user: userId, time_out: null },
                { time_out: locker.expired_at }
            );
        }

        res.json({
            success: true,
            message: "Locker released successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateLockerAccess = async (req, res) => {
  try {
    const { lockerId } = req.body;

    const locker = await Locker.findById(lockerId);
    if (!locker) return res.status(404).json({ error: "Locker not found" });

    locker.accessed_at = new Date();
    await locker.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLockerStats = async (req, res) => {
    try {
        const totalLockers = await Locker.countDocuments();
        const availableLockers = await Locker.countDocuments({ status: "available" });
        const occupiedLockers = await Locker.countDocuments({ status: "occupied" });

        res.json({
            success: true,
            data: {
            total: totalLockers,
            available: availableLockers,
            occupied: occupiedLockers
        }
    });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};