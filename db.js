const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/inotebook"; // your DB name

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI); // remove options
        console.log("Connected to MongoDB Successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToMongo;
