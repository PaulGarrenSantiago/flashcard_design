import AccessLog from '../models/AccessLog.js';
import User from '../models/User.js';

export const getRecentAccessLogs = async (req, res) => {
  try {
    console.log("Fetching recent access logs...");
    
    // Fetch the 50 most recent access logs
    const logs = await AccessLog.find()
      .sort({ timestamp: -1 }) // newest first
      .limit(50)
      .populate('user', 'name email')
      .lean()
      .exec();

    console.log("Found logs:", logs.length);

    // Map to include formatted data
    const formattedLogs = logs.map(log => ({
      _id: log._id,
      card_uid: log.card_uid,
      locker_number: log.locker_number,
      user: log.user || { name: 'Unknown', email: 'N/A' },
      status: log.status,
      reason: log.reason,
      timestamp: log.timestamp
    }));

    res.status(200).json({
      success: true,
      data: formattedLogs
    });
  } catch (err) {
    console.error("Error fetching access logs:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
