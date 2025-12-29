import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/User.js';
import Card from './models/Card.js';
import Locker from './models/Locker.js';
import SessionLogs from './models/SessionLogs.js';
import Admin from './models/Admin.js';

dotenv.config();

async function initDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await User.createCollection();
        await Locker.createCollection();
        await Card.createCollection();
        await SessionLogs.createCollection();
        await Admin.createCollection();
        
        console.log('Collections Created');
        process.exit(0);
    } catch(err) {
        console.error('Init Failed:', err);
        process.exit(1);
    }
}

initDB();