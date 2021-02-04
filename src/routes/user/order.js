const express = require('express');
// const { body } = require('express-validator');

const OrderController = require('../../controllers/user/order');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();


router.post('/', isAuth, OrderController.createOrder);

router.get('/', OrderController.getAllOrders);

router.get('/category/:category', OrderController.viewOrdersByCategory);

router.get('/date/:date', OrderController.viewOrdersByDate);

module.exports = router;