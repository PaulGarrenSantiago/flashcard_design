import mongoose from "mongoose";

const AccessLogSchema = new mongoose.Schema({
  card_uid: { type: String, required: true },
  locker_number: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["granted", "denied", "expired"], required: true },
  reason: { type: String }, // e.g., "Card not found", "Locker not assigned", "Access expired"
  timestamp: { type: Date, default: Date.now },
  locker_ref: { type: mongoose.Schema.Types.ObjectId, ref: "Locker" }
});

export default mongoose.model("AccessLog", AccessLogSchema);
