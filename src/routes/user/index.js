const express = require('express');

// const AuthRoute = require('./auth');
const ProductRoute = require('./product');
// const OrderRoute = require('./order');
// const CategoryRoute = require('./categories');

const router = express.Router();


// router.use('/auth', AuthRoute);

router.use('/product', ProductRoute);

// router.use('/admin/order', OrderRoute);

// router.use('/admin/categories', CategoryRoute);

module.exports = router;