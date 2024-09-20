require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

const SALT_ROUNDS = 10;

const setupAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        // Check if an admin user exists
        let admin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });

        if (!admin) {
            // Admin does not exist, create one
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, SALT_ROUNDS);
            admin = new Admin({
                username: process.env.ADMIN_USERNAME,
                password: hashedPassword,
            });
            await admin.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error setting up admin user:', error);
    } finally {
        // Disconnect from MongoDB
        mongoose.disconnect().then(() => console.log('MongoDB disconnected'));
    }
};

setupAdmin();