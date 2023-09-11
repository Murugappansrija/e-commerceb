const express = require('express')
const { registorUser, loginUser, logout, logoutUser, forgotPassword } = require('../controllers/authController')
const { isAuthenticatedUser } = require('../middlewares/authenticate')
const router = express.Router()

router.route('/register').post(registorUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/password/forgot').post(forgotPassword)

module.exports =  router