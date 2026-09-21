const mongoose = require("mongoose");
const dns = require("dns");

// Use Google DNS to solve MongoDB SRV DNS resolution problems
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const connectDB = async () => {
    try {

        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI is not defined in .env"
            );
        }

        console.log("MONGO_URI loaded: YES");

        await mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 15000,
                connectTimeoutMS: 15000,
                socketTimeoutMS: 45000
            }
        );

        console.log(
            "MongoDB connected successfully ✅"
        );

    } catch (error) {

        console.error(
            "MongoDB connection failed ❌"
        );

        console.error(
            error.message
        );

        process.exit(1);
    }
};

module.exports = connectDB;