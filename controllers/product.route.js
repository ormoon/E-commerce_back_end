const productModel = require('../models/product.model');
const express = require('express');
const router = express.Router();
const path = require('path')
const fs = require('fs');

var multer = require('multer');

var diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), '/files/images')) //root directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

function fileFilter(req, file, cb) {
    var mimeType = file.mimetype.split('/')[0];
    if (mimeType != 'image') {
        req.fileError = true;
        cb(null, false)
    }
    else {
        cb(null, true)
    }
}


var upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter
})




function mapProduct(product, productDetails) {
    if (productDetails.name)
        product.name = productDetails.name;
    if (productDetails.category)
        product.category = productDetails.category;
    if (productDetails.brand)
        product.brand = productDetails.brand;
    if (productDetails.description)
        product.description = productDetails.description;
    if (productDetails.price)
        product.price = productDetails.price;
    if (productDetails.color)
        product.color = productDetails.color;
    if (productDetails.weight)
        product.weight = productDetails.weight;
    if (productDetails.tags)
        product.tags = Array.isArray(productDetails.tags) ? productDetails.tags : productDetails.tags.split(',');
    if (productDetails.warrentyStatus === true || productDetails.warrentyStatus === 'true') {
        product.warrenty = {
            warrentyStatus: productDetails.warrentyStatus,
            warrentyPeriod: productDetails.warrentyPeriod
        }
    } else if (productDetails.warrentyStatus === false || productDetails.warrentyStatus === 'false') {
        product.warrenty = {
            warrentyStatus: productDetails.warrentyStatus,
            warrentyPeriod: "No warrenty is mentioned for this product"
        }
    }

    if (productDetails.discountedItem === true || productDetails.discountedItem === 'true') {
        product.discount = {
            discountedItem: productDetails.discountedItem,
            discountType: productDetails.discountType,
            discount: productDetails.discount
        }
    } else if (productDetails.discountedItem === false || productDetails.discountedItem === 'false') {
        product.discount = {
            discountedItem: productDetails.discountedItem,
            discountType: "Sorry! no discount available",
            discount: "Sorry! no discount available"
        }
    }
    if (productDetails.modelNo)
        product.modelNo = productDetails.modelNo;
    if (productDetails.image)
        product.image = productDetails.image;
    if (productDetails.manuDate)
        product.manuDate = productDetails.manuDate;
    if (productDetails.expDate)
        product.expDate = productDetails.expDate;
    if (productDetails.quantity)
        product.quantity = productDetails.quantity;
    if (productDetails.origin)
        product.origin = productDetails.origin;
    if (productDetails.image)
        product.image = productDetails.image;

    return product;
}



router.route('/')
    .get(function (req, res, next) {
        productModel
            .find({
                user: req.loggedInUser._id
            }, {
                // name: 1,
                // category: 1
            })//here second query is projection that holds data that need to be included or excluded(if 0) for given search query in first params
            .populate('user', {
                name: 1,
                email: 1
            }) //user is property in our productSchema, poppulate means give details of user
            .sort({ _id: -1 })
            .lean()
            .exec((err, done) => {
                if (!err) {
                    res.status(200).send(done)
                } else {
                    next(err)
                }
            })
    })
    .post(upload.single('img'), function (req, res, next) {
        var Product = new productModel({});
        var newProduct = mapProduct(Product, req.body)
        newProduct.user = req.loggedInUser._id;
        if (req.fileError) {
            return next("Invalid file format");
        }

        if (req.file) {
            req.body.image = req.file.filename;
        }
        newProduct.save((err, saved) => {
            if (err) {
                next(err)
            } else {
                res.status(200).json(saved);
            }
        })
    })


router.route('/search')
    .get((req, res, next) => {
        var condition = {};
        var searchConditon = mapProduct(condition, req.query);
        search(searchConditon)
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                next(err)
            })
    })
    .post((req, res, next) => {
        var condition = {};
        var searchConditon = mapProduct(condition, req.body);
        search(searchConditon)
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                next(err)
            })
    })


function search(query) {
    return new Promise((resolve, reject) => {
        productModel.find(query)
            .exec((err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
    })
}



router.route('/:id')
    .get(function (req, res, next) {
        productModel.findById(req.params.id, (err, found) => {
            if (!err) {
                res.status(200).json(found);
            } else {
                return next(err)
            }
        }).populate('user', {
            name: 1,
            email: 1
        })
    })

    .put(upload.single('img'), function (req, res, next) {
        productModel.findById(req.params.id)
            .exec((err, product) => {
                if (err) {
                    next(err)
                }
                if (req.fileError) {
                    return next("Invalid file format");
                }
                if (product) {
                    var oldImage = product.image;
                    if (req.file) {
                        req.body.image = req.file.filename;
                    }
                    var updated = mapProduct(product, req.body)
                    if (req.body.reviewMsg && req.body.reviewPoint) {
                        updated.reviews.push({
                            user: req.body.loggedInUser,
                            message: req.body.reviewMsg,
                            point: req.body.reviewPoint
                        })
                    }
                    updated.save((err, done) => {
                        if (!err) {
                            if (req.file) {
                                fs.unlink(path.join(process.cwd(), 'files/images' + oldImage), (err, done) => {
                                    if (!err) {
                                        console.log("File removed")
                                    } else {
                                        console.log("File has been removed error >> ", err)
                                    }
                                })
                            }
                            res.status(200).send("Product has been updated successfully >> " + done)
                        } else {
                            next(err)
                        }
                    })
                } else {
                    next("product didn't found")
                }
            })
    })

    .delete(function (req, res, next) {
        productModel.findByIdAndRemove(req.params.id)
            .exec((err, product) => {
                if (product) {
                    res.status(200).send("Item has been deleted successfully")
                } else {
                    next("Product didn't found")
                }
            })
    })



module.exports = router;