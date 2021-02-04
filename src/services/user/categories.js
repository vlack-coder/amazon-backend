const User =  require('../../models/user');
const Category = require('../../models/category');


/**
 * Creates a category
 * @param userId
 * @param data 
 * @returns category - Object
*/
exports.createCategory = async (userId, data) => {

  try {
    
    const user = await User.findOne({user_id: userId});
    const isExists = await Category.findOne({category: data.category});

    if (!user || user.role === 'user') {
      const error = new Error('User is not authorized to create categories.');
      error.statusCode = 401;
      throw error;
    }

    if (isExists) {
      const error = new Error('Category already exists.');
      error.statusCode = 409;
      throw error;
    }

    const category = new Category(data);

    category.save();

    if (!category) {
      const error = new Error('Error occured, category was not created.');
      throw error;
    }

    return category;

  } catch (error) {
    console.log('meal upload error',error)
    throw error;
  }
}


/**
 * Gets all categories
 * @returns categories - Array
*/
exports.getAllCategories = async () => {

  try {
    const categories = await Category
      .find()
      .select('category');

    if (!categories) {
      const error = new Error('Error occured, could not fetch category.');
      throw error;
    }

    return categories;

  } catch (error) {
    throw error;
  }
}

/**
 * Updates category info
 * @param userId
 * @param categoryId
 * @param data
 * @returns category - Object
*/
exports.updateCategory = async (userId, categoryId, data) => {

  try {
    
    const user = await User.findOne({user_id: userId});
    
    if (!user || user.role === 'user') {
      const error = new Error('User is not authorized to update category.');
      error.statusCode = 401;
      throw error;
    }

    const updatedCategory = await Category.findOneAndUpdate({_id: categoryId}, data, {new: true});
    
    if (!updatedCategory) {
      const error = new Error('Could not update category.');
      throw error;
    }

    return updatedCategory;
  } catch (error) {
    throw error;
  }
}

// TODO: add delete category function