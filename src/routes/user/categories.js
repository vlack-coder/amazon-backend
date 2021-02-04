const express = require('express');

const CategoryController = require('../../controllers/user/categories');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();


router.post('/', isAuth, CategoryController.createCategory);

router.patch('/:id', isAuth, CategoryController.updateCategory);

router.get('/', CategoryController.getAllCategories);

module.exports = router;