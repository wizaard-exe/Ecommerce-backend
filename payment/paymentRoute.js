const express = require('express');
const paymentRoute = express.Router();
const {getPaymentKey,verifyPayment} = require('./paymentController');

paymentRoute.post("/key/payment",getPaymentKey);
paymentRoute.post("/payment/verification",verifyPayment);

module.exports = paymentRoute;


