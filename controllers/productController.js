const Product = require('../models/productModel');
const asyncErrorHandler = require('../errorHandler/tryCatchErrorHandler');
const ErrorHandler = require('../errorHandler/ErrorHandler');
const tryCatchErrorHandler = require('../errorHandler/tryCatchErrorHandler');

// Get All Prodcut + Filters

const getAllProducts = asyncErrorHandler(async (req,res,next)=>
{

    const searchQuery = {};
    const totalProducts = await Product.countDocuments({});
    const {name,category,brand,sortBy,maxprice,minprice,rating,query} = req.query;
    
    // SEARCH QUERY

    if(query)
    {
        searchQuery.name = {$regex:query,$options:"i"};
    }

    if(name)
    {
        searchQuery.name = {$regex:name,$options:"i"};
    }

    
    if (category) {
        searchQuery.category = Array.isArray(category) ? { $in: category.map(cat => new RegExp(cat, 'i')) } : new RegExp(category, 'i');
    }
    
    if (brand) {
        searchQuery.brand = Array.isArray(brand) ? { $in: brand.map(br => new RegExp(br, 'i')) } : new RegExp(brand, 'i');
    }
    

    // Rating
    if (rating) {
        searchQuery.rating = { $lte: parseInt(rating) }
    }

    let sortingValue = {};

    // SORTING 
    if (sortBy) {
        if (sortBy === "ascending") {
            sortingValue = { price: 1 }; 
        } else if (sortBy === "descending") {
            sortingValue = { price: -1 };
        }
    }
    
    // PAGINATION 
    let page = Number(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    // PRICE RANGE FILTER 
    if(maxprice)
    {
        searchQuery.price = {$gte:minprice || 0,$lte:maxprice}
    }   

    // MAX PRICE 
    const findMaxPrice = await Product.aggregate([
        {
            $group: {
                _id: null,
                maxprice: { $max: "$price" }
            }
        }
    ]);
    
        // RESULT 
        const product = await Product.find(searchQuery)
        .sort(sortingValue)
        .skip(skip)
        .limit(limit);

    const maxPrice = findMaxPrice.length > 0 ?  Math.ceil(findMaxPrice[0].maxprice / 1000) * 1000 : null;
    

    // if (!product || product.length === 0) {
        // const all_products = await Product.find({});
        // if (!all_products || all_products.length === 0) {
            // return next(new ErrorHandler(404, 'No Products Created!'));
        // }
        // res.status(200).json({ success: true, product:all_products, productCount: all_products.length,totalProducts,limit,maxPrice});
    // } else {
        res.status(200).json({ success: true, product:product, productCount: product.length,totalProducts,limit,maxPrice});
    // }

});



// Get single Product 
const getSingleProduct = asyncErrorHandler(async(req,res,next)=>
{
    if(!req.params.id)
    {
        return next(new ErrorHandler(404,"Product ID Not Found!"));
    }
    
    const singleProduct = await Product.findOne({_id:req.params.id});

    if(!singleProduct)
    {
        return next(new ErrorHandler(404,"Product Not Found!"));
    }
    return res.status(200).json({success:true,singleProduct});
});


// Create Product
const createProduct = asyncErrorHandler(async(req,res)=>{
    const { name, description, price,images, category, stock, reviews,brand} = req.body;
    const product = await Product.create({
        name, 
        description,
        price,images, 
        category, 
        brand,
        stock, 
        reviews
    });
    res.status(201).json({"success":true,message:"Product Created Successfully!"});
});



// Update a product
const updateProduct = asyncErrorHandler(async(req,res,next)=>
{
    const updateFields = req.body;
    if(!req.params.id)
    {
        return next(new ErrorHandler(404,"Product Not Found!"));
    }
    if(Object.keys(updateFields).length === 0)
    {
        return next(new ErrorHandler(400,"No Data for Update"));
    }
    const updatedProduct = await Product.findByIdAndUpdate({_id:req.params.id},updateFields,{new:true});
    res.status(200).json({success:true,updateProduct});

})  


// Delete a product 
const deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const productId = req.params.id;

    if (!productId) {
        return next(new ErrorHandler(404, "Product ID Not Found!"));
    }

    const deleteProduct = await Product.findByIdAndDelete(productId);

    if (!deleteProduct) {
        return next(new ErrorHandler(404, "Product Not Found!"));
    }

    return res.status(200).json({ success: true, message: "Product Deleted Successfully!" });
});

// getCategory 
const getCategory = tryCatchErrorHandler(async (req,res) =>
{
    const Products = await Product.find({});
    const category = [...new Set(Products.map(product=>product.category))];
    const brand = [... new Set(Products.map((product)=>product.brand))]
    res.status(200).json({category,brand});
})




module.exports = {createProduct,getAllProducts,deleteProduct,getSingleProduct,updateProduct,getCategory};