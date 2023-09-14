const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    phoneNo: {
      type: Number,
      required: true
    },
    postalCode: {
      type: Number,
      required: true,
    }
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User"
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref:'Product',
        required: true
      },
    },
  ],
  itemsPrice:{
    type:Number,
    required: true,
    default: 0.00
  },
  taxPrice:{
    type: Number,
    required:true,
    default:0.00
  },
  shippingPrice:{
    type: Number,
    required: true,
    default:0.00
  },
  totalPrice:{
    type: Number,
    required: true,
    default:0.00
  },
  paidAt:{
    type:Date
  },
  deliveredAt:{
    type:Date
  },
  orderStatus:{
    type: String,
    required: true,
    default: 'Processing'
  },
  createdAt:{
    type:Date,
    default: Date.now
  }
});

let orderModel =mongoose.model('Order',orderSchema)

module.exports = orderModel