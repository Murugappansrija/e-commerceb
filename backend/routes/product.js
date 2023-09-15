const express = require('express')
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productController')
const router = express.Router()
const {isAuthenticatedUser, autherizeRoles} = require('../middlewares/authenticate')

router.route("/products").get(isAuthenticatedUser,getProducts)
router.route('/product/new').post(isAuthenticatedUser,autherizeRoles('admin'),newProduct)
router.route('/product/:id').get(getSingleProduct)
router.route('/product/:id').putisAuthenticatedUser,(autherizeRoles('admin'),updateProduct)
router.route('/product/:id').delete(isAuthenticatedUser,autherizeRoles('admin'),deleteProduct)

router.route('/review').put(isAuthenticatedUser,createReview)
router.route('/reviews').get(getReviews)
router.route('/review').delete(deleteReview)


module.exports = router