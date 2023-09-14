const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/orderSchema");
const ErrorHandler = require("../utils/errorHandler");
const Product = require('../models/productModel')

// create new order = api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;
  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });
  res.status(200).json({
    success: true,
    order
  })
});


//get single product - api/v1/order/:id

exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
  const order =  await Order.findById(req.params.id).populate('user','name email')
  if(!order){
    return next (new ErrorHandler(`order not found with this id ${req.body.id}`,404))
  }
  res.status(200).json({
    success:true,
    order
  })

})

//get loged in users orders  - api/v1/myorders

exports.myOrders = catchAsyncError(async(req,res,next)=>{
  const orders = await Order.find({user : req.user.id})
  res.status(200).json({
    success:true,
    orders
  })
})


//admin: get all orders = api/v1/orders

exports.orders = catchAsyncError(async(req,res,next)=>{
    const orders =  await Order.find()

    let totalAmount =0
    orders.forEach(order => {
      totalAmount += order.totalPrice
    });
    res.status(200).json({
      suc:true,
      totalAmount,
      orders
    })
})

//admin : update order-> delivered and reduce quantity in products

exports.updateOrder = catchAsyncError(async(req,res,next)=>{
const order = await Order.findById(req.params.id)
if(order.orderStatus == 'Delivered'){
  return next(new ErrorHandler('Order has been already deliverd'))
}
//updating the product stock for every order
  order.orderItems.forEach(async orderItem =>{
    await  updateStock(orderItem.product,orderItem.quantity)
})
order.orderStatus = req.body.orderStatus
order.deliverdAt = Date.now()
await order.save()
res.status(200).json({
  success : true,
  message: 'stock updated'
})
})

async function updateStock(productId,quantity){
      const product = await Product.findById(productId)
      product.stock =product.stock-quantity
      product.save({validateBeforeSave: false})
}