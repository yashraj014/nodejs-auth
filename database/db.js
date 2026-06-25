const mongoose = require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect('mongodb://localhost:27017/auth-db')
        console.log("MongoDB connected successfully!!")
    } catch (error) {
        console.error("Connection to DB failed");
        process.exit(1)
    }
}

module.exports = connectDB;