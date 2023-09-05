const express = require('express')
const { registorUser, loginUser, logout, logoutUser } = require('../controllers/authController')
const router = express.Router()

router.route('/register').post(registorUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)

module.exports =  router