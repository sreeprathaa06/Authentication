const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Check whether MongoDB URI exists
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env");
        }

        console.log("MONGO_URI loaded: YES");

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000
        });

        console.log("MongoDB connected successfully ✅");

    } catch (error) {
        console.error("MongoDB connection failed ❌");
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = connectDB;