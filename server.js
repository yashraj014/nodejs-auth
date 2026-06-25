const express = require('express')
require("dotenv").config();
const connectDB = require("./database/db")
const userRouter = require('./routes/user')
const uploadImageRoute = require('./routes/image-routes')
const PORT=process.env.PORT;

const app =express();

app.use(express.json());

connectDB();

app.use('/user',userRouter);
app.use('/image',uploadImageRoute)

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
}); 