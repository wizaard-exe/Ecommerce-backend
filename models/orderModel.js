const mongoose = require('mongoose'); 
const addressModel = require('./addressModel');

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    orderedProducts : [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "products"
            },
            name:{
                type:String,
                required:true
            },
            img:{
                type:String,
                required:true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price:{
                type: Number,
                required: true,
            }

        },
    ],
    address:addressModel,
    orderStatus: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered","confirmed"], 
        default: "Pending"
    },
    totalAmount:{
        type:Number,
    },
    payment:{
        paymentMode:{
            type:String,
            default:"Cash On Delivery"
        },
        amount:{
            type:String,
        }
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

}
,{
    timestamps:true
});



const orderCollection = mongoose.model("order",orderSchema);

module.exports = orderCollection;


