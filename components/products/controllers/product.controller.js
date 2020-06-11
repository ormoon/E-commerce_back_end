const productQuery = require('../query/product.query');


function find(req, res, next) {
    var condition = {};
    if (req.loggedInUser.role !== 1) {
        condition.user = req.loggedInUser._id;
    }
    productQuery.fetch(condition, (err, result) => {
        if (err) {
            return next(err);
        }
        res.status(200).json(result);
    })
}

function findById(req, res, next) {
    var condition = { _id: req.params.id };
    productQuery.fetch(condition, (err, result) => {
        if (err) {
            return next(err);
        }
        res.status(200).json(result[0]);
    });
}

module.exports = {
    find,
    findById
}