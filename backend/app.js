const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error')
const auth = require ('./routes/auth')
const cookieParser = require('cookie-parser');
const order = require('./routes/order')

app.use(express.json())
app.use(cookieParser())
const product = require('./routes/product');

app.use('/api/v1', product)
app.use('/api/v1', auth)
app.use('/api/v1',order)
app.use(errorMiddleware)

module.exports = app;