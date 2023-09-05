const products = require ('../data/products.json')
// get a data from product models
const Product = require('../models/productModel')
const dotenv = require('dotenv')
const connectDatabase = require('../config/database')
dotenv.config({path:'backend/config/config.env'})
connectDatabase()


const seedProduct = async()=>{
    try{
        await Product.deleteMany();
        console.log("all product are deleted succesfully")
        await Product.insertMany(products)
        console.log(" all product are inserted")
    }
    catch(error){
        console.log(error.message)

    }
    process.exit()

}
seedProduct()