const mongoose = require("mongoose")
// connect to the mongoose mongodb database

const uri = process.env.MONGO_URI;

module.exports = async function dbconnect() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(uri, {
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
    }