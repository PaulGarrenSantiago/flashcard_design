import mongoose from "mongoose";

const LockerSchema = new mongoose.Schema({
  locker_number: Number,

  assigned_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["available", "occupied", "maintenance"],
    default: "available"
  },

  issued_at: Date,
  expired_at: Date,
  accessed_at: Date
});

export default mongoose.model("Locker", LockerSchema);
