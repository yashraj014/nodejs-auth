const mongoose = require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully!!")
    } catch (error) {
        console.error("Connection to DB failed");
        process.exit(1)
    }
}

module.exports = connectDB;