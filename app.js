const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect("mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb")
mongoose.Promise = global.Promise;

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use((req, res, next) =>  {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>  {
    res.status(error.status);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;