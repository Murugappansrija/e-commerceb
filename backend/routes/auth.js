const express = require('express')
const { registorUser, loginUser } = require('../controllers/authController')
const router = express.Router()

router.route('/register').post(registorUser)
router.route('/login').post(loginUser)

module.exports =  router