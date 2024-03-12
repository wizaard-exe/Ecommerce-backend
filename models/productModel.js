const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    images: {
        type: [String],
        validate: 
        {
            validator: function (arr) {
                    return arr.length <= 5;
            },
            message: "Maximum Limit is 5"
        }
    },
    category:{
        type:String,
        required:[true,"Cateogry is Defined"]
    },
    brand:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:[true,"Stock is Empty"],
        maxLength:[4,"Stock Limit exceeded"],
        default:0
    },
    rating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"users"
            },
            name:{
               type:String,
               required:true 
            },
            img:{
                type:String,
                required:true 
             },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ]
},
{
    timestamps: true,
}

);


productSchema.pre("save",async function(next){
    try{
        if(this.isModified('reviews') || this.isNew)
        {
            this.numOfReviews = this.reviews.length;
        }
        next();
    }
    catch(e)
    {
        next(e);
    }
})


productSchema.pre('save', function (next) {
    if (this.isModified('reviews')) {
      if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating = totalRating / this.reviews.length;
      } else {
        this.rating = 0;
      }
    }
    next();
  });

  
productSchema.pre('save', function (next) {
    if (this.isModified('reviews')) 
    {
      if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating = Math.floor((totalRating / this.reviews.length) * 10) / 10;
      } else {
        this.rating = 0;
      }
    }
    next();
});
  
const productModel = mongoose.model('Product',productSchema);

module.exports = productModel;


