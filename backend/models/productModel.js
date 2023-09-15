// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please Enter your product name"],
//     trim: true,
//     maxLength: [100, "Product name cannot exced 100 Charecters"]
//   },
//   price: {
//     type: Number,
//     default: 0.0
//   },
//   description: {
//     type: String,
//     required: [true, "Please Enter product description"]
//   },
//   ratings: {
//     type: String,
//     default: 0
//   },
//   images: [
//     {
//       image: {
//         type: String,
//         required: true
//       }
//     }
//   ],
//   category: {
//     type: String,
//     required: [true, "Please enter a category"],
//     enum: {
//       values: [
//         "Electronics",
//         "Mobile Phone",
//         "Accessories",
//         "Laptop",
//         "Headphones",
//         "Food",
//         "Books",
//         "Cloths/Shoes",
//         "Beauty/Health",
//         "Sports",
//         "Outdoor",
//         "Home"
//       ],

//       message: "please enter correct catgory"
//     }
//   },
//   seller: {
//     type: String,
//     required: [true, "Please enter product seller"]
//   },
//   stock: {
//     type: Number,
//     required: [true, "please enter Stock"],
//     maxLength: [20, "Product stock connot exceed 20"]
//   },
//   numOfReviews: {
//     type: Number,
//     default: 0
//   },
//   reviews: [
//     {
//       name: {
//         type: String,
//         required: true
//       },
//       rating: {
//         type: String,
//         required: true
//       },
//       Comment: {
//         type: String,
//         required: true
//       }
//     }
//   ],
//   createdAt:{
//     type : Date,
//     default: Date.now()
//   }
// })
// let schema = mongoose.model('product',productSchema)
// module.exports = schema

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: true,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: String,
        default: 0
    },
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"],
        enum: {
            values: [
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message : "Please select correct category"
        }
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxLength: [20, 'Product stock cannot exceed 20']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {         
             user: mongoose.Schema.Types.ObjectId,

            // user:{
            //     type:mongoose.Schema.Types.ObjectId,
            //      ref: 'User'
            // },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type : mongoose.Schema.Types.ObjectId
    }
    ,
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

let schema = mongoose.model('Product', productSchema)

module.exports = schema