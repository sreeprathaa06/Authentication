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

        try {
            const collection = mongoose.connection.collection('emailverificationtokens');
            
            // Check if collection exists first to avoid errors on fresh db
            const collections = await mongoose.connection.db.listCollections({ name: 'emailverificationtokens' }).toArray();
            
            if (collections.length > 0) {
                const indexes = await collection.indexes();
                const hasTokenIndex = indexes.some(idx => idx.name === 'token_1');
                
                if (hasTokenIndex) {
                    await collection.dropIndex('token_1');
                    console.log("Dropped outdated token_1 index from emailverificationtokens");
                }
            }
        } catch (idxErr) {
            // Only log if it's a real unexpected error, not just index missing
            if (idxErr.codeName !== 'IndexNotFound' && idxErr.codeName !== 'NamespaceNotFound') {
                console.error("Safe index cleanup error:", idxErr.message);
            }
        }

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