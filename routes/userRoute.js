const express = require('express');
const router = express.Router();

const { removeFromWishlist,removeFromCart,createUser,loginUser,isUserLoggedIn,addtoCart,addtoWishlist,writeReview,editReview,deleteReview,logout,getUser} = require('../controllers/userController');

router.post('/register',createUser);
router.post('/login', loginUser);
router.post('/logout',isUserLoggedIn,logout);

router.post('/cart',isUserLoggedIn,addtoCart);
router.post('/remove/cart',isUserLoggedIn,removeFromCart);

router.post('/wishlist',isUserLoggedIn,addtoWishlist);
router.post('/remove/wishlist',isUserLoggedIn,removeFromWishlist);

router.post('/create/review',isUserLoggedIn,writeReview);
router.post('/edit/review',isUserLoggedIn,editReview);
router.post('/delete/review',isUserLoggedIn,deleteReview);
router.get('/get/user',isUserLoggedIn,getUser);



module.exports = router;
