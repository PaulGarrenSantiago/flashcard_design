import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  admin_id: {
    type: String,
    unique: true,
  },
  username: String,
  password: String
}, { timestamps: true });

export default mongoose.model("Admin", AdminSchema);
