const express = require('express');
const router = express.Router();
const {isUserLoggedIn} = require('../controllers/userController');

const {
    getCategory,
    createProduct,
    getAllProducts,
    deleteProduct,
    getSingleProduct,
    updateProduct 
} = require('../controllers/productController');

// Create A Product

router.post("/create/product",createProduct);
router.get("/products",getAllProducts);
router.get("/get/category",getCategory);

router.route("/product/:id")
.get(getSingleProduct)
.delete(deleteProduct)
.put(updateProduct)


module.exports = router;