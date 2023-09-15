const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");

// get products = api/v1/products
exports.getProducts = async (req, res, next) => {
  const resPerPage = 5;
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .paginate(resPerPage);
  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};
//create newproduct - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//get single product api/v1/product/:id

exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }
  res.status(200).json({
    success: true,
    product,
  });
};

//update product -api/v1/product/:id
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
};

//delete product -api/v1/product/:id

exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  await product.deleteOne(product);
  res.status(200).json({
    success: true,
    message: "prodect deleted sucessfully",
  });
};


//create review - api/v1/review
exports.createReview = catchAsyncError(async(req,res,next)=>{
  const {productId,rating,comment} = req.body
  const review = {
    user :req.user.id,
    rating:rating,
    comment
  }
  const product = await Product.findById(productId)
  //finding user already have a review
  const isReviewed = product.reviews.find(review=>{
     return review.user.toString() == req.user.id.toString()
  })
  if(isReviewed){
    //updating review
    product.reviews.forEach(reviews=>{
      if(review.user.toString()==req.user.id.toString()){
        review.comment = comment
        review.rating= rating
      }
    })

  }else{
    //create review
   product.reviews.push(review)
    product.numOfReviews = product.reviews.length
    
  }
  //averege of product review
  product.ratings= product.reviews.reduce((acc,review)=>{
    return review.rating+acc
  },0)/product.reviews.length
  
 product.rating = isNaN(product.ratings)?0: product.ratings
 await product.save({validateBeforeSave:false})
 res.status(200).json({
  success:true,
  message:'review updated'
 })
})