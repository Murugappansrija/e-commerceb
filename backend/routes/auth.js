const express = require('express')
const { registorUser, loginUser, logout, logoutUser, forgotPassword, resetPassword, getUserProfile, changepassword, updateProfile, getAllUsers, getSingleUser, updateUser, deleteUser} = require('../controllers/authController')
const { isAuthenticatedUser, autherizeRoles } = require('../middlewares/authenticate')
const router = express.Router()

router.route('/register').post(registorUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/myprofile').get(isAuthenticatedUser,getUserProfile)
router.route('/changepassword').put(isAuthenticatedUser,changepassword)
router.route('/updateprofile').put(isAuthenticatedUser,updateProfile)

//admin routes
router.route('/admin/users').get(isAuthenticatedUser,autherizeRoles('admin'),getAllUsers)
router.route('/admin/users/:id').get(isAuthenticatedUser,autherizeRoles('admin'),getSingleUser)
router.route('/admin/users/:id').put(isAuthenticatedUser,autherizeRoles('admin'),updateUser)
router.route('/admin/users/:id').delete(isAuthenticatedUser,autherizeRoles('admin'),deleteUser)
module.exports =  router