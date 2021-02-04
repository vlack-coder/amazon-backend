const { validationResult } = require("express-validator");

const MealService = require("../../services/user/product");

exports.uploadMeal = async (req, res, next) => {
  const errors = validationResult(req);
  const { userId } = req;

  try {
    // if (!errors.isEmpty()) {
    //   const error = new Error('Validation failed.');
    //   error.statusCode = 422;
    //   error.data = errors.array();
    //   throw error;
    // }

    const meal = await MealService.uploadMeal(userId, req.body);

    res.status(201).json({
      message: "Meal created.",
      data: meal,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllMeals = async (req, res, next) => {
  const { page, perPage } = req.query;

  try {
    let meals = await MealService.getAllMeals({ page, perPage });

    res.status(200).json({
      message: "Meals found.",
      data: meals,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateMeal = async (req, res, next) => {
  const { userId } = req;
  const {id } = req.params;

  try {
    // console.log(id);
    const updatedMeal = await MealService.updateMeal(userId,id, req.body);

    res.status(200).json({
      message: "Meal updated succesfully.",
      data: updatedMeal,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getMealsByCategory = async (req, res, next) => {
  const { page, perPage } = req.query;
  const { category } = req.params;

  try {
    let meals = await MealService.getMealsByCategory({
      page,
      perPage,
      category,
    });

    res.status(200).json({
      message: "Meals found.",
      data: meals,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getMealsByDate = async (req, res, next) => {
  const { page, perPage } = req.query;
  const { date } = req.params;
console.log(date)
  try {
    let meals = await MealService.getMealsByDate({ page, perPage, date });

    res.status(200).json({
      message: "Meals found.",
      data: meals,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
