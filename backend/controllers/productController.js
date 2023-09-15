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
    // rating:rating,
    rating,
    comment
  }
  const product = await Product.findById(productId)
  //finding user already have a review
  const isReviewed = product.reviews.find(review=>{
     return review.user.toString() == req.user.id.toString()
  })
  if(isReviewed){
    //updating review
    product.reviews.forEach(review=>{
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
  
 product.ratings = isNaN(product.ratings)?0: product.ratings
 await product.save({validateBeforeSave:false})
 res.status(200).json({
  success:true,
  message:'review updated'
 })
})

//get reviews- api/v1/reviews?(poductid)

 exports.getReviews = catchAsyncError(async(req,res,next)=>{
  const product  = await Product.findById(req.query.id)
  res.status(200).json({
    success: true,
    reviews : product.reviews
  })
})

//delete review -/api/v1/review
exports.deleteReview = catchAsyncError(async(req,res,next)=>{


  const product = await Product.findById(req.query.productId)
    //filtering the reviews does not match the deleting review id
  const reviews = product.reviews.filter(review=>{
    return  review._id.toString() !== req.query.id.toString()
    
  })
  //number of reviews
  const numOfReviews = reviews.length
  //finding the avg with the filtered
  let ratings = reviews.reduce((acc,review)=>{
    return review.rating+ acc
  },0)/reviews.length
  ratings = isNaN(ratings)?0:ratings
  //save the product document
  await Product.findByIdAndUpdate(req.id.productId,{
    reviews,
    numOfReviews,
    ratings
  })
  res.ststus(200).json({
    success: true,
    message:'review deleted'

  })

})
// //Delete Review - api/v1/review
// exports.deleteReview = catchAsyncError(async (req, res, next) =>{
//     const product = await Product.findById(req.query.productId);
    
//     //filtering the reviews which does match the deleting review id
//     const reviews = product.reviews.filter(review => {
//        return review._id.toString() !== req.query.id.toString()
//     });
//     //number of reviews 
//     const numOfReviews = reviews.length;

//     //finding the average with the filtered reviews
//     let ratings = reviews.reduce((acc, review) => {
//         return review.rating + acc;
//     }, 0) / reviews.length;
//     ratings = isNaN(ratings)?0:ratings;

//     //save the product document
//     await Product.findByIdAndUpdate(req.query.productId, {
//         reviews,
//         numOfReviews,
//         ratings
//     })
//     res.status(200).json({
//         success: true
//     })


// });
