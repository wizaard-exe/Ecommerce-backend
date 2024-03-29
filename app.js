const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDB = require('./connectDB');
const productRoute = require('./routes/productRoutes');
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
const ErrorMiddleWare = require('./errorHandler/errorMiddleware');
const paymentRoute = require("./payment/paymentRoute");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());
app.use("/api/v1",productRoute);
app.use("/api/v1",userRoute);
app.use("/api/v1/",orderRoute);
app.use("/api/v1",paymentRoute);
app.use(ErrorMiddleWare);



app.listen(process.env.PORT,()=>{
    console.log("server is running");
});

connectDB();

