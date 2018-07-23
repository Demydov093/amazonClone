const router = require('express').Router();

const Product = require('../models/product');
const express = require('express');
const app = express()


const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({ accessKeyId: "AKIAJMYCGVUZMBSL6HBA", secretAccessKey: "pWCe3yfoT/uEKV8C5EH30Tj22NsR36ns5SW/EuCd"});


const faker = require('faker');


const checkJWT = require('../middlewares/check-jwt');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'amazcloneapp',
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        },
    })
});

router.route('/products')
    .get(checkJWT,(req, res, next) => {
        Product.find({ owner: req.decoded.user._id})
          .populate('owner')
          .populate('category')
          .exec((err, products) => {
            if (products) {
                res.json({
                    success: true,
                    message: 'Products',
                    products: products
                });
            }
        });
     })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
     let product = new Product();
     product.owner = req.decoded.user._id;
     product.category = req.body.categoryId;
     product.title = req.body.title;
     product.price = req.body.price;
     product.description = req.body.description;
     product.image = req.file.location;

     console.log(3, product);
     product.save();
     res.json({
         success: true,
         message: 'Successfully added the product'
     });
});


/* just for testing */

router.get('/faker/test', (req, res, next) => {
    for(let i = 0; i < 20; i++) {
        let product = new Product();
        product.category = '5b153e00c236941ea46588bf';
        product.owner = '5b0fbb0b7d66fc0be0a6d8eb';
        product.title = faker.commerce.productName();
        product.price = faker.commerce.price();
        product.description = faker.lorem.words();
        product.image = faker.image.cats();
        product.save();
    }
    res.json({
        message: "Successfully added 20 pictures"
    })
 });


module.exports = router;
//
// AKIAJMYCGVUZMBSL6HBA
// pWCe3yfoT/uEKV8C5EH30Tj22NsR36ns5SW/EuCd