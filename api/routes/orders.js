const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
    .select('_id quantity productId')
    .exec()
    .then(doc => {
        const response = {
            count: doc.length,
            orders: doc.map(doc => {
                // return custom response
                return {
                    _id: doc._id,
                    quantity: doc.quantity,
                    productId: doc.product,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/order/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

router.get('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById({_id: orderId})
    .select('_id quantity productId')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost:3000/order/'
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided Id'
            })
        }

    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => {

    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    })
    .then(result => {
        res.status(200).json({
            message : 'Created order successfully.',
            createdOrder: {
                _id: result._id,
                productId: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/order/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    Order.remove({ _id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: id + ' order deleted successfully.',
            result: result
        })
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

router.delete('/all', (req, res, next) => {
    
    Order.remove()
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'All orders deleted successfully.',
            result: result
        })
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;