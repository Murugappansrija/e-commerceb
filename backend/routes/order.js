const express = require('express')
const { newOrder,  getSingleOrder, myOrders, orders, updateOrder, deleteOrder } = require('../controllers/orderController')
const router = express.Router()
const {isAuthenticatedUser, autherizeRoles} = require('../middlewares/authenticate')

router.route('/order/new').post(isAuthenticatedUser,newOrder)
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)
router.route('/myorders').get(isAuthenticatedUser,myOrders)
router.route('/orders').get(isAuthenticatedUser,autherizeRoles('admin'),orders)
router.route('/orders/:id').put(isAuthenticatedUser,autherizeRoles('admin'),updateOrder)
router.route('/orders/:id').delete(isAuthenticatedUser,autherizeRoles('admin'),deleteOrder)
module.exports =  router