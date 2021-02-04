const Order = require("../../models/order");
const Meal = require("../../models/meal");
const User = require("../../models/user");
const Category = require("../../models/category");

/**
 * Uploads a meal
 * @param userId
 * @param data
 * @returns meal - Object
 */
exports.createOrder = async (userId, data) => {
  try {
    const user = await User.findOne({ user_id: userId });
    // const category = await Category.findOne({ category: data.category });
    const meal = await Meal.findOne({ meal: data.meal });

    if (!user || user.role === "user") {
      const error = new Error("User is not authorized to create Orders.");
      error.statusCode = 401;
      throw error;
    }

    // if (!category) {
    //   const error = new Error("Category is not yet created.");
    //   error.statusCode = 404;
    //   throw error;
    // }
    if (!meal) {
      const error = new Error("meal is not yet created.");
      error.statusCode = 404;
      throw error;
    }
    console.log(meal)

    const order = new Order(data);
    order.meal.push(meal._id)
  
    order.ordersCount++;
    const result = await order.save();
    // console.log(order);
    // user.order.push(order);
    // user.save()
    // console.log(user)

    if (!result) {
      const error = new Error("Error occured, Order was not created.");
      throw error;
    }

    return result;
  } catch (error) {
    console.log("Order upload error", error);
    throw error;
  }
};

exports.getAllOrders = async ({ page, perPage }) => {
  const currentPage = parseInt(page, 10) || 1;
  const questionsPerPage = parseInt(perPage, 10) || 2;

  try {
    const totalItems = await Order.find().countDocuments();
    const Orders = await Order.find()
      .skip((currentPage - 1) * questionsPerPage)
      .limit(questionsPerPage);

    if (!Orders) {
      const error = new Error("Error occured, could not fetch Order.");
      throw error;
    }

    return {
      Orders,
      totalItems,
    };
  } catch (error) {
    throw error;
  }
};

exports.getOrdersByCategory = async ({ page, perPage, category }) => {
  const currentPage = parseInt(page, 10) || 1;
  const ordersPerPage = parseInt(perPage, 10) || 2;

  try {
    const totalItems = await Category.find({ category }).countDocuments();
    const orders = await Orders.find({ category })
      .populate("meals")
      .skip((currentPage - 1) * ordersPerPage)
      .limit(questionsPerPage);

    if (!orders) {
      const error = new Error("Error occured, could not fetch Orders.");
      throw error;
    }

    return {
      Orders,
      totalItems,
    };
  } catch (error) {
    throw error;
  }
};

exports.getOrdersByDate = async ({ page, perPage, date }) => {
  //  TODO: work on this
  const currentPage = parseInt(page, 10) || 1;
  const questionsPerPage = parseInt(perPage, 10) || 2;

  try {
    const totalItems = await Meal.find({
      createdAt: { $gte: date },
    }).countDocuments();
    console.log(date);
    // const meals = await Meal.find({ createdAt: {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}});
    const meals = await Meal.find({ createdAt: { $gte: date } });
    // .skip((currentPage - 1) * questionsPerPage)
    // .limit(questionsPerPage);

    if (!meals) {
      const error = new Error("Error occured, could not fetch meal.");
      throw error;
    }

    return {
      meals,
      totalItems,
    };
  } catch (error) {
    throw error;
  }
};
