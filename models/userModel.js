const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT_Token = require('jsonwebtoken');
const addressModel = require("./addressModel");



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email: {
        type: String,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },      
    password:{
        type:String,
        select:false
    },
    confirmPassword:{
        type:String,
        select:false
    },
    profilePic:{
        type:String,
        required:[true,"Profile pic is empty"]
    },
    role:{
        type:String,
        default:"User",
        enum:["User","Admin"]
    },
    googleUid:{
        type:String,
    },
    cart:[
        {
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            name:
            {
                type:String,
                required:true


            },
            quantity:{
                type:Number,
                default:1
            },
            img:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    wishlist:[
        {
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            name:
            {
                type:String,
                required:true


            },
            img:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            }

        }
    ],
    address:addressModel,

},
{
    timestamps:true
}
)


userSchema.pre("save",async function(){
    if(this.isModified('password') && this.password)
    {   
        this.password = await bcrypt.hash(this.password,12);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword,12);

    }   
});

userSchema.methods.getJWTtoken = function(){
    return JWT_Token.sign({id:this._id},process.env.JWTKey,{expiresIn:parseInt(31536000)})
}   

userSchema.methods.verifyPassword = async function(userPassword)
{
    return bcrypt.compare(userPassword,this.password);
}   

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;



