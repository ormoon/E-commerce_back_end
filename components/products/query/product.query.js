const productModel = require('../models/product.model');

function fetch(query, cb) {
    productModel.find(query)
        .exec((err, result) => {
            if (err) {
                cb(err)
            } else {
                cb(null, result)
            }
        })
}

module.exports = {
    fetch
}