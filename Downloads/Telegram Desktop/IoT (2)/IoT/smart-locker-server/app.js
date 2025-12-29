import express from 'express';
import cors from 'cors';
import router from './routes/adminRoute.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer } from 'ws';

import lockerRoute from './routes/lockerRoute.js';
import sessionRoute from './routes/sessionRoute.js';
import userRoute from './routes/userRoute.js';
import accessLogRoute from './routes/accessLogRoute.js';
import cardRoute from './routes/cardRoute.js';
import Card from './models/Card.js';
import User from './models/User.js';
import Locker from './models/Locker.js';
import SessionLogs from './models/SessionLogs.js';
import AccessLog from './models/AccessLog.js';

dotenv.config();

const app = express();

// ✅ Allow cross-origin requests (important if frontend runs on a different port)
app.use(cors());

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Your routes - more specific routes first
app.use('/api/lockers/', lockerRoute);

app.use('/api/sessions/', sessionRoute);

app.use('/api/users/', userRoute);

app.use('/api/logs/', accessLogRoute);

app.use('/api/cards/', cardRoute);

// General API routes last
app.use('/api', router);

// Optional ESP32 endpoints
app.post("/rfid", async (req, res) => {
  try {
    const { uid, locker_number } = req.body;
    console.log("RFID received:", req.body);

    // Find the card
    const card = await Card.findOne({ rfid_uid: uid });
    if (!card) {
      // Log denied access
      await AccessLog.create({
        card_uid: uid,
        locker_number: locker_number,
        status: "denied",
        reason: "Card not found"
      });
      return res.json({ status: "Card not found" });
    }

    console.log("Card found:", card);
    console.log("Card's assigned_user_id:", card.assigned_user_id);
    console.log("Locker number to find:", locker_number);

    // Check if card is active
    if (card.status !== 'active') {
      // Log denied access - card inactive
      await AccessLog.create({
        card_uid: uid,
        locker_number: locker_number,
        user: card.assigned_user_id || card.user_id,
        status: "denied",
        reason: `Card is ${card.status} (card disabled or lost)`
      });
      return res.json({ status: "Card is inactive" });
    }

    // Find the locker assigned to the card's user and matches the locker_number
    const query = { 
      locker_number: locker_number,
      assigned_user_id: card.assigned_user_id || card.user_id
    };
    console.log("Searching for locker with query:", query);
    
    const locker = await Locker.findOne(query);
    
    console.log("Locker found:", locker);
    
    if (!locker) {
      console.log("No locker found. Checking all lockers in DB...");
      const allLockers = await Locker.find({});
      console.log("All lockers in DB:", allLockers);
      // Log denied access
      await AccessLog.create({
        card_uid: uid,
        locker_number: locker_number,
        user: card.assigned_user_id || card.user_id,
        status: "denied",
        reason: "Locker not assigned to this card"
      });
      return res.json({ status: "Locker not assigned to this card" });
    }

    // Check if assignment is still valid (not expired)
    if (locker.expired_at && new Date() > locker.expired_at) {
      // Log expired access
      await AccessLog.create({
        card_uid: uid,
        locker_number: locker_number,
        user: card.assigned_user_id || card.user_id,
        locker_ref: locker._id,
        status: "expired",
        reason: "Access expired"
      });
      return res.json({ status: "Access expired" });
    }

    // Update accessed_at for last opened
    locker.accessed_at = new Date();
    await locker.save();

    // Log granted access
    await AccessLog.create({
      card_uid: uid,
      locker_number: locker_number,
      user: card.assigned_user_id || card.user_id,
      locker_ref: locker._id,
      status: "granted",
      reason: "Access granted"
    });

    res.json({ status: "Access granted", locker: locker.locker_number });
  } catch (err) {
    console.error(err);
    // Log error
    await AccessLog.create({
      card_uid: req.body.uid || "unknown",
      locker_number: req.body.locker_number || 0,
      status: "denied",
      reason: "Error processing request: " + err.message
    }).catch(e => console.error("Failed to log error:", e));
    res.json({ status: "Error" });
  }
});

app.get("/esp32/ping", (req, res) => {
  console.log("✅ ESP32 is connected");
  res.json({ status: "ESP32 connected" });
});

// Optional WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('message', msg => console.log('WS Received:', msg.toString()));
  ws.send(JSON.stringify({ msg: 'Welcome WS client' }));
});

// Connect to MongoDB
connectDB();

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
