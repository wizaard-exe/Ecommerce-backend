const Razorpay = require('razorpay');
const tryCatchErrorHandler = require('../errorHandler/tryCatchErrorHandler');
const ErrorHandler = require('../errorHandler/ErrorHandler');

const razorpayInstance = new Razorpay({
    key_id:process.env.razorpay_id,
    key_secret:process.env.razorpay_key,
});


const getPaymentKey = tryCatchErrorHandler(async(req,res,next) =>
{
    const {amount} = req.body;

    if(!amount)
    {
        next(new ErrorHandler(404,"Amount is Empty!"));
    }
    const options = {
        amount: Number(amount * 100),
        currency: "INR",
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
        success:true,
        order
    })    
});

const verifyPayment = tryCatchErrorHandler(async (req,res,next)=>
{
    console.log(req.body);

    res.status(200).json({
        success:true,
    })    
});









module.exports = {getPaymentKey,verifyPayment};