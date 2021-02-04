const { validationResult } = require("express-validator");

const AuthService = require("../../services/user/auth");

exports.signup = 
exports.userSignup = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await AuthService.userSignup(req.body);

    res.status(201).json({
      message: "User created.",
      data: user,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await AuthService.login(req.body);

    res.status(200).json({
      message: "User authenticated.",
      data: user,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  const { page, perPage } = req.query;

  try {
    let users = await AuthService.getAllUsers({ page, perPage });

    res.status(200).json({
      message: "Users found.",
      data: users,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.userId;
  try {
    const updatedUser = await AuthService.updateUser(userId, req.body);
    res.status(200).json({
      message: "User updated succesfully.",
      data: updatedUser,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.searchUser = async (req, res, next) => {
  const { queryString, page, perPage } = req.query;

  try {
    let searchResult = await AuthService.searchUser({
      queryString,
      page,
      perPage,
    });

    res.status(200).json({
      message: "Users search matched.",
      data: searchResult,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
