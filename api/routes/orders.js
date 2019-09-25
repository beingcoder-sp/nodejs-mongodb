const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

router.get('/', (req, res, next) => {
    Order.find()
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
    .exec()
    .then(doc => {
        res.status(200).json({
            order: doc
        })
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });

    order.save()
    .then(result => {
        res.status(200).json({
            message : 'Created order successfully.',
            result: result
            /*
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/order/' + result._id
                }
            }
            */
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