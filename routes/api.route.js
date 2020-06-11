const userRoute = require('../controllers/user.route');
const authRoute = require('../controllers/auth.route');
const prodRoute = require('../controllers/product.route');
const authenticate = require('../middlewares/authenticate')

const newProductRoute = require('../components/products/routes/product.route');


module.exports = function () {
    const router = require('express').Router();
    router.use('/user', authenticate, userRoute);
    router.use('/auth', authRoute);
    router.use('/product', authenticate, prodRoute);
    router.use('/new-product', authenticate, newProductRoute)
    return router;
}