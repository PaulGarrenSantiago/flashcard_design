import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  locker_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locker", unique: true, sparse: true },
  rfid_id: { type: mongoose.Schema.Types.ObjectId, ref: "Card" }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
