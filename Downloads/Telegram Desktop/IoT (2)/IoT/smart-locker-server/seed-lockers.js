import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Locker from './models/Locker.js';

dotenv.config();

async function seedLockers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Check if lockers already exist
        const count = await Locker.countDocuments();
        if (count > 0) {
            console.log(`Already have ${count} lockers`);
            process.exit(0);
        }

        // Create 10 lockers
        const lockers = [];
        for (let i = 1; i <= 10; i++) {
            lockers.push({ locker_number: i, status: 'available' });
        }

        await Locker.insertMany(lockers);
        console.log('Seeded 10 lockers');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

seedLockers();