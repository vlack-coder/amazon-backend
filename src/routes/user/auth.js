const express = require("express");
const { body } = require("express-validator");

const AuthController = require("../../controllers/user/auth");
const User = require("../../models/user");
const isAuth = require("../../middleware/is-auth");
const isAdmin = require("../../middleware/isAdmin");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom((value, {}) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists");
          }
          return true;
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isAlphanumeric()
      .withMessage("Your password must not contain special characters")
      .isLength({ min: 8 })
      .withMessage("Your password must contain a minimum of 8 characters"),
    body("phone_number")
      .isMobilePhone("en-NG")
      .withMessage("Please enter a valid phone number")
      .isLength({ min: 10, max: 13 }),
    body("name").trim().isString().not().isEmpty(),
  ],
  AuthController.userSignup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password", "Your email or password is not valid")
      .trim()
      .isLength({ min: 8 })
      .isAlphanumeric(),
  ],
  AuthController.login
);

router.patch("/user", [isAuth], AuthController.updateUser);

router.post(
  "/admin/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom((value, {}) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists");
          }
          return true;
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isAlphanumeric()
      .withMessage("Your password must not contain special characters")
      .isLength({ min: 8 })
      .withMessage("Your password must contain a minimum of 8 characters"),
    body("phone_number")
      .isMobilePhone("en-NG")
      .withMessage("Please enter a valid phone number")
      .isLength({ min: 10, max: 13 }),
    body("name").trim().isString().not().isEmpty(),
  ],
  AuthController.signup
);

router.post(
  "/admin/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password", "Your email or password is not valid")
      .trim()
      .isLength({ min: 8 })
      .isAlphanumeric(),
  ],
  AuthController.login
);

router.patch("/admin/user", [isAuth, isAdmin], AuthController.updateUser);

router.get("/admin/users", [isAuth, isAdmin], AuthController.getAllUsers);

router.get("/users/search", [isAuth, isAdmin], AuthController.searchUser);

module.exports = router;
