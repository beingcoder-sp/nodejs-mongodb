const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {

    Product.find()
    .select('name price _id') // Only get name, price and _id field
    .exec()
    .then(doc => {
        const response = {
            count: doc.length,
            products: doc.map(doc => {
                // return custom response
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/product/' + doc._id
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

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
    .select('name price _id') // Only get name, price and _id field
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost:3000/product/'
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided Id'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => {
   
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
    .then(result => {
        res.status(200).json({
            message : 'Created product successfully.',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/product/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: id + ' deleted successfully.',
            result : result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/all', (req, res, next) => {
    
    Product.remove()
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'All products deleted successfully.',
            result : result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;

    const updateOps = {};
    for(const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }

    //Product.update( {_id: id}, { $set: { name: req.body.name, price: req.body.price } } );
    Product.update( {_id: id}, { $set: updateOps } )
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;