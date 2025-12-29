import Admin from "../models/Admin.js";

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username }).lean();
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Simple password check (plain text for demo)
    if (admin.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Success → send admin info (omit password)
    res.status(200).json({ success: true, data: { id: admin._id, username: admin.username } });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
