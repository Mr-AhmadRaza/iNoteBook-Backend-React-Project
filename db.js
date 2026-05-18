const mongoose = require('mongoose');

const connectToMongo = async () => {
    try {
        // Use environment variable for production, localhost for development
        const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/inotebook";
        
        await mongoose.connect(mongoURI);
        console.log("✅ Connected to MongoDB Successfully");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit if can't connect
    }
};

module.exports = connectToMongo;