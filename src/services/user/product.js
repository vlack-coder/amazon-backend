const Meal = require("../../models/meal");
const User = require("../../models/user");
const Category = require("../../models/category");

/**
 * Uploads a meal
 * @param userId
 * @param data
 * @returns meal - Object
 */
exports.uploadMeal = async (userId, data) => {
  try {
    const user = await User.findOne({ user_id: userId });
    const category = await Category.findOne({ category: data.category });

    if (!user || user.role === "user") {
      const error = new Error("User is not authorized to create meals.");
      error.statusCode = 401;
      throw error;
    }

    if (!category) {
      const error = new Error("Category is not yet created.");
      error.statusCode = 404;
      throw error;
    }

    const meal = new Meal(data);

    const result = await meal.save();

    category.meals.push(meal);
    category.mealsCount++;

    category.save();

    if (!result) {
      const error = new Error("Error occured, meal was not created.");
      throw error;
    }

    return result;
  } catch (error) {
    console.log("meal upload error", error);
    throw error;
  }
};

/**
 * Gets all meals, returns a maximum of two documents when @param perPage is not set
 * @param perPage - (optional) for pagination
 * @param page - (optional) for pagination
 * @returns meals - Array and totalItems - Number
 */
exports.getAllMeals = async ({ page, perPage }) => {
  const currentPage = parseInt(page, 10) || 1;
  const questionsPerPage = parseInt(perPage, 10) || 8;

  try {
    const totalItems = await Meal.find().countDocuments();
    const meals = await Meal.find()
      .skip((currentPage - 1) * questionsPerPage)
      .limit(questionsPerPage);

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

/**
 * Updates meal info
 * @param userId
 * @param mealId
 * @param data
 * @returns meal - Object
 */
exports.updateMeal = async (userId, mealId, data) => {
  try {
    const user = await User.findOne({ user_id: userId });

    if (!user || user.role === "user") {
      const error = new Error("User is not authorized to create meals.");
      error.statusCode = 401;
      throw error;
    }

    const updatedMeal = await Meal.findOneAndUpdate({ _id: mealId }, data, {
      new: true,
    });

    if (!updatedMeal) {
      const error = new Error("Could not update meal");
      throw error;
    }

    return updatedMeal;
  } catch (error) {
    throw error;
  }
};

/**
 * Gets meals by category, returns a maximum of two documents when @param perPage is not set
 * @param perPage - (optional) for pagination
 * @param page - (optional) for pagination
 * @param category
 * @returns meals - Array and totalItems - Number
 */
exports.getMealsByCategory = async ({ page, perPage, category }) => {
  const currentPage = parseInt(page, 10) || 1;
  const questionsPerPage = parseInt(perPage, 10) || 2;

  try {
    const totalItems = await Category.find({ category }).countDocuments();
    const meals = await Category.find({ category })
      .populate("meals")
      .skip((currentPage - 1) * questionsPerPage)
      .limit(questionsPerPage);

    if (!meals) {
      const error = new Error("Error occured, could not fetch meals.");
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

/**
 * Gets all meals for a partiular day, returns a maximum of two documents when @param perPage is not set
 * @param perPage - (optional) for pagination
 * @param page - (optional) for pagination
 * @param date
 * @returns meals - Array and totalItems - Number
 */
exports.getMealsByDate = async ({ page, perPage, date }) => {
  //  TODO: work on this
  const currentPage = parseInt(page, 10) || 1;
  const questionsPerPage = parseInt(perPage, 10) || 2;

  try {
    const totalItems = await Meal.find({ createdAt: {"$gte": date}}).countDocuments();
    console.log(date)
    // const meals = await Meal.find({ createdAt: {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}});
    const meals = await Meal.find({ createdAt: {"$gte": date}});
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
