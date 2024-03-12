const User = require('../models/userModel');
const tryCatchErrorHandler = require('../errorHandler/tryCatchErrorHandler');
const ErrorHandler = require("../errorHandler/ErrorHandler");
const sendCookieToken = require('../utils/sendCookie');
const jsonwebtoken = require("jsonwebtoken");
const Product = require('../models/productModel');


// create user 
const createUser = tryCatchErrorHandler(async (req, res, next) => {

  const { name, email, password, confirmPassword, profilePic, role, googleUid } = req.body;

  if (googleUid || googleUid !== undefined && googleUid !== null)
  {
    const alreadyExists = await User.findOne({ googleUid });
    if(alreadyExists)
    {
        sendCookieToken(alreadyExists,200,res);
    }
    else {
        const user = await User.create({
          name,
          email,
          password,
          confirmPassword,
          profilePic,
          role,
          googleUid,
        })
        sendCookieToken(user,200,res);
    }
  } 
  else {

      const checkEmail = await User.findOne({email});
      if(checkEmail)
      {
        return next(new ErrorHandler(404,"Email Already Exists"));
      }

        const user = await User.create({
          name,
          email,
          password,
          confirmPassword,
          profilePic,
          role,
          googleUid,
        });
        sendCookieToken(user,200,res);
      }
});


// LOGIN USER 
const loginUser = tryCatchErrorHandler(async (req,res,next)=>
{
  const {email,password} = req.body;
  if(!email || !password)
  {
    return next(new ErrorHandler(400,"Email or Password is Empty!"));
  }
  const user = await User.findOne({email}).select("+password");

  if(!user)
  {
    return next(new ErrorHandler(400,"Invalid Email or Password"));
  }

  const isPasswordMatched = await user.verifyPassword(password);
  
  if(!isPasswordMatched)
  {
    return next(new ErrorHandler(400,"Invalid Email or Password"));
  }

  sendCookieToken(user,200,res);
})


// LOGOUT USER 
const logout = tryCatchErrorHandler(async (req,res,next)=>{
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successful" });
})

// Get User
const getUser = tryCatchErrorHandler(async (req,res,next)=>{
  const { token } = req.cookies;
  const { id } = jsonwebtoken.verify(token, process.env.JWTKey);
  const user = await User.findOne({ _id: id });
  res.status(200).json({success:true,user});
})

// IS LOGGED IN 
const isUserLoggedIn = tryCatchErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
      return next(new ErrorHandler(401, "Unauthorized"));
  }

  const { id } = jsonwebtoken.verify(token, process.env.JWTKey);
  const user = await User.findOne({ _id: id });

  if (!user) {
      return next(new ErrorHandler(401, "Unauthorized"));
  }
  req.user = user;
  next();
});

// ADD TO CART 
const addtoCart = tryCatchErrorHandler(async(req,res,next) => {
  const { productId, quantity } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'Product ID are required.' });
  }
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    return res.status(400).json({ error: 'Wrong Product ID sent' });
  }
  const user = req.user;

  if(!quantity)
  {
    const alreadyExits = user.cart.findIndex((product)=>product.id.equals(productId));
    if(alreadyExits !== -1)
    {
      res.status(200).json({ message: 'Item Already Added to Cart'});

    }
  }
  const alreadyExits = user.cart.findIndex((product)=>product.id.equals(productId));
  if(alreadyExits !== -1)
  {
    user.cart[alreadyExits].quantity = quantity ;
    await user.save();
    res.status(200).json({ message: 'Product Updated Successfully'});
  }
  else{
      user.cart.push({id:product._id,name:product.name,quantity:quantity || 1,img:product.images[0],price:product.price});
      await user.save();
      res.status(200).json({ success:true,message: 'Added to cart' });
  }
});

// REMOVE ITEM FROM CART 
const removeFromCart = tryCatchErrorHandler(async (req,res,next) =>
{
  const {productId} = req.body;

  if(!productId)
  {
    return next(new ErrorHandler(404,"Product Id is Required!"));
  }
  const user = req.user;

  const removedItems = req.user.cart.findIndex((item)=>item.id.equals(productId));
  if(removedItems === -1)
  {
    return next(new ErrorHandler(404,"Product NOT found in the cart"));
  }
  user.cart.splice(removedItems,1);
  await user.save();
  res.status(200).json({ success: true, message: "Item removed from the Cart" });

});


// ADD TO WISHLIST 
const addtoWishlist = tryCatchErrorHandler(async (req,res,next)=>{
  const {productId} = req.body;

  const product = await Product.findOne({_id:productId});
  if(!product) {
    return next(new ErrorHandler(400,"Wrong Product Id"));
  }
  const user = req.user;

  const alreadyExists = user.wishlist.findIndex((product)=>product.id.equals(productId));
  
  if(alreadyExists !== -1)
  {
    res.status(200).json({ success: true, message: 'Product already in wishlist'});

  }
  else {
    user.wishlist.push({id:product._id,name:product.name,img:product.images[0],price:product.price});
    await user.save();
    res.status(200).json({success:true,message:"Added to Wishlist"});
  }
})

// REMOVE WISHLIST
const removeFromWishlist = tryCatchErrorHandler(async(req,res,next) =>{
  const {productId} = req.body;
  if(!productId)
  {
    return next(new ErrorHandler(404,"Id is Missing!"));
  }

  const itemTobeRemoved = req.user.wishlist.findIndex(item=>item.id.equals(productId));

  if(itemTobeRemoved === -1)
  {
    return next(new ErrorHandler(404,"Item Not Found!"));
  }
  req.user.wishlist.splice(itemTobeRemoved,1);
  await req.user.save();

  res.status(200).json({success:true,message:"Item Remove From Wishlist"});
});


// WRITE REVIEW 
const writeReview = tryCatchErrorHandler(async (req,res,next)=>
{
  const {productId,rating,comment} = req.body;
  if(!productId || !rating || !comment)
  {
      return next(new ErrorHandler(400,"Incorrect Product ID"));
  }
  const product = await Product.findOne({_id:productId});

  if(!product)
  {
    return next(new ErrorHandler(400,"Incorrect Product ID"));
  }
  const user = req.user;

  product.reviews.push({user:user._id,name:user.name,img:user.profilePic,rating,comment});

  await product.save();

  res.status(200).json({ success: true, message: 'Thanks for Your valuable Feedback' });
})


// EDIT REVIEW 
const editReview = tryCatchErrorHandler(async (req, res, next) => {
  const { reviewId, rating, comment } = req.body;

  if (!reviewId) {
    return next(new ErrorHandler(400, "reviewId is required"));
  }

  const user = req.user;

  const product = await Product.findOne({reviews:{$elemMatch:{_id:reviewId,user:user._id}}});

  if (!product) {
    return next(new ErrorHandler(404, "Review not found!"));
  }

  const reviewTobeUpdate = product.reviews.find(review => review._id.equals(reviewId));

  if (!reviewTobeUpdate) {
    return next(new ErrorHandler(404, "Review not found"));
  }

  if(rating !== undefined || rating !== null)
  {
    reviewTobeUpdate.rating = rating;
  }
  if(comment !== undefined || comment !== null)
  {
    reviewTobeUpdate.comment = comment;
  }

  await product.save();

  res.status(200).json({ success: true, message: 'Review updated successfully' });

});

// delete a review 
const deleteReview = tryCatchErrorHandler(async (req,res,next)=>{
  const { reviewId } = req.body;
  if (!reviewId) {
    return next(new ErrorHandler(400, "Review ID is Empty"));
  }
  
  const user = req.user;
  
  const product = await Product.findOne({
    reviews: { $elemMatch: { _id: reviewId, user: user._id } },
  });
  
  if (!product) {
    return next(new ErrorHandler(400, "Review ID is Invalid"));
  }
  
  const reviewTobeDelted = product.reviews.findIndex(review => review._id.equals(reviewId));
  
  if (reviewTobeDelted === -1) {
    return next(new ErrorHandler(400, "Review not found"));
  }

  product.reviews.splice(reviewTobeDelted,1);
  // product.reviews.pull({ _id: reviewId }); fro mongo db 
  await product.save();
  res.status(200).json({ success: true, message: "Review deleted successfully" });

})


module.exports = {removeFromWishlist,removeFromCart,getUser,logout,createUser,loginUser,isUserLoggedIn,addtoCart,addtoWishlist,writeReview,editReview,deleteReview};



