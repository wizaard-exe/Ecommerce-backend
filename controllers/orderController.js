const Order = require("../models/orderModel");
const tryCatchErrorHandler = require('../errorHandler/tryCatchErrorHandler');
const ErrorHandler = require('../errorHandler/ErrorHandler');

// SAVE ADDRESS
const saveAddress = tryCatchErrorHandler(async (req,res,next)=>{
    const { name, mobileNumber, pincode, locality, city, landmark, state, alternateNumber, fullAddress } = req.body;

    if(!name ||  !mobileNumber || !pincode || !locality || !city || !landmark || !state || !alternateNumber || !fullAddress)
    
    {
        return next(new ErrorHandler(404,"Empty Fields!"))
    }
    req.user.address = {
        name, mobileNumber, pincode, locality, city, landmark, state, alternateNumber, fullAddress
    };
    await req.user.save();
    res.status(200).json({message:"Address Saved"});
})

// Create An Order

const createOrder = tryCatchErrorHandler(async (req,res,next)=>{

    const {totalAmount } = req.body;
    if(!totalAmount)
    {
        return next(new ErrorHandler(400,"Total Amount is required!"));
    };

    const userData = req.user;
    
    const orderedProducts = userData.cart.length > 0 && userData.cart.map(({ id, img, name, price, quantity }) => ({
        productId: id,
        img,
        name,
        price,
        quantity,
    }));
    
    if(!orderedProducts){
        return next(new ErrorHandler(401,"No items in cart"));

    }
    

    const order = new Order({
        user:userData._id,
        orderedProducts,
        address:userData.address,
        totalAmount,
    });

    await order.save();

    res.status(201).json({ success: true, message:"Order Created Successfully!" });
});

// Search For An Order

const searchOrder  = tryCatchErrorHandler(async (req,res,next)=>{
    const {_id} = req.user;
    const userOrders = await Order.find({user:_id}); 
    if(!userOrders)
    {
        return next(new ErrorHandler(404,"Order Not Found!"))
    }
    const totalAmount = userOrders.reduce((total,order)=>{
        return total + order.totalAmount;
    },0);
    res.status(200).json({orders:userOrders,totalOrder:userOrders.length,totalAmount});
});



module.exports = {createOrder,searchOrder,saveAddress};