const express = require('express');
// const { body } = require('express-validator');

const ProductController = require('../../controllers/user/product');
// const isAuth = require('../../middleware/is-auth');
// const isAdmin = require('../../middleware/isAdmin');

const router = express.Router();


// router.post('/', [isAuth, isAdmin], MealController.uploadMeal);
router.post('/', ProductController.uploadProduct);

// router.patch('/:id', [isAuth, isAdmin], MealController.updateMeal);

// router.get('/', [isAuth, isAdmin], MealController.getAllMeals);

// router.get('/category/:category',[isAuth, isAdmin], MealController.getMealsByCategory);

// router.get('/date/:date', MealController.getMealsByDate);

module.exports = router;