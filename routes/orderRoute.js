const express = require('express');
const router = express.Router();
const { isUserLoggedIn} = require('../controllers/userController');
const {createOrder,searchOrder,saveAddress} = require('../controllers/orderController');

router.post("/create/order",isUserLoggedIn,createOrder);
router.get("/search/order",isUserLoggedIn,searchOrder);
router.post("/save/address",isUserLoggedIn,saveAddress);


module.exports = router;