// controllers/sessionController.js
import SessionLogs from '../models/SessionLogs.js';
import Locker from '../models/Locker.js';

// Get 15 most recent sessions including start and end times
export const getRecentSessions = async (req, res) => {
  try {
    // Fetch the 15 most recent session logs
    const sessions = await SessionLogs.find()
      .sort({ _id: -1 }) // newest first
      .limit(15)
      .populate('locker_number', 'locker_number')   // populate locker number
      .populate('rfid_id', 'rfid_uid') // populate card info
      .populate('user', 'name email')             // populate user info
      .exec();

    // Map sessions to include start/end
    const formattedSessions = sessions.map(session => ({
      locker_number: session.locker_number.locker_number,
      user: { name: session.user.name, email: session.user.email },
      card_number: session.rfid_id ? session.rfid_id.rfid_uid : 'N/A',
      time_in: session.time_in,
      time_out: session.time_out
    }));

    res.status(200).json({
      success: true,
      data: formattedSessions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
