import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  rfid_uid: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assigned_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ['active', 'inactive'], default: "inactive" }
});

export default mongoose.model("Card", CardSchema);

