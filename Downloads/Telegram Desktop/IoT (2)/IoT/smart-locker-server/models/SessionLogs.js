import mongoose from "mongoose";

const SessionLogSchema = new mongoose.Schema({
  locker_number: { type: mongoose.Schema.Types.ObjectId, ref: "Locker" },
  rfid_id: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  time_in: { type: Date },
  time_out: { type: Date }
});

export default mongoose.model("SessionLogs", SessionLogSchema);
