const { validationResult } = require('express-validator');

const CategoryService = require('../../services/user/categories');

exports.createCategory = async (req, res, next) => {
  // const errors = validationResult(req);
  const { userId } = req;

  try {

    // if (!errors.isEmpty()) {
    //   const error = new Error('Validation failed.');
    //   error.statusCode = 422;
    //   error.data = errors.array();
    //   throw error;
    // }

    const category = await CategoryService.createCategory(userId, req.body);

    res.status(201).json({
      message: 'Category created.',
      data: category
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.getAllCategories = async (req, res, next) => {

  try {
    let categories = await CategoryService.getAllCategories();

    res.status(200).json({
      message: 'Categories found.',
      data: categories
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.updateCategory = async (req, res, next) => {
  const { userId } = req;
  const { categoryId } = req.params;

  try {
    const updatedCategory = await CategoryService.updateCategory(userId, categoryId, req.body);

    res.status(200).json({
      message: 'Category updated succesfully.',
      data: updatedCategory
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}
