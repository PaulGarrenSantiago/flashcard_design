import express from "express";
import { loginAdmin } from "../controllers/adminController.js"; // adjust path if needed

const router = express.Router();

// POST route for admin login
router.post("/login", loginAdmin);

export default router;