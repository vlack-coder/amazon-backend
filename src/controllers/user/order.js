const { validationResult } = require("express-validator");

const OrderService = require("../../services/user/order");

exports.createOrder = async (req, res, next) => {
  // const errors = validationResult(req);
  const { userId } = req;

  try {
    const order = await OrderService.createOrder(userId, req.body);

    res.status(201).json({
      message: "order created.",
      data: order,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
    const { page, perPage } = req.query;
  
    try {
      let orders = await OrderService.getAllOrders({ page, perPage });
  
      res.status(200).json({
        message: "Orders found.",
        data: orders,
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };

  exports.viewOrdersByCategory = async (req, res, next) => {
    const { page, perPage } = req.query;
    const { category } = req.params;
  
    try {
      let orders = await OrderService.getOrdersByCategory({
        page,
        perPage,
        category,
      });
  
      res.status(200).json({
        message: "Orders found.",
        data: orders,
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };

  exports.viewOrdersByDate = async (req, res, next) => {
    const { page, perPage } = req.query;
    const { date } = req.params;
  console.log(date)
    try {
      let Orders = await OrderService.getOrdersByDate({ page, perPage, date });
  
      res.status(200).json({
        message: "Orders found.",
        data: Orders,
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };