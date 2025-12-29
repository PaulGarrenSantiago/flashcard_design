import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Locker from './models/Locker.js';

dotenv.config();

async function checkLockers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const count = await Locker.countDocuments();
        console.log(`Number of lockers in DB: ${count}`);

        if (count === 0) {
            console.log('No lockers found. You need to seed the database with lockers.');
        } else {
            const lockers = await Locker.find({}, 'locker_number status').limit(5);
            console.log('Sample lockers:', lockers);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkLockers();