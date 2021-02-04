const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: ShortUniqueId } = require('short-unique-id');

const jwtsecret = require('../../config/config').secret;

const User = require('../../models/user');

//Instantiate
const uid = new ShortUniqueId();

/**
 * Registers a user Admin
 * @param name 
 * @param email
 * @param password
 * @param phone_number
 * @param referer - (optional) 
 * @returns userId - String
*/
exports.signup = async ({email, password, phone_number, name, referer}) => {

  try {

    const hashedPassword = await bcrypt.hash(password, 12);
    const nameArray = name.split(" ");
    const first_name = nameArray[0];
    let other_names;

    if (nameArray.length > 1) {
      other_names = `${nameArray[1]} ${nameArray[2] || ""}`;      
    }

    const user = new User({
      email,
      first_name,
      phone_number,
      role: 'admin',
      user_id: uid(),
      password: hashedPassword,
      other_names: other_names.trim(),
      referer: referer || 'upbase admin',
    });

    const result = await user.save();

    if (!result) {
      const error = new Error('Error occured, user was not created.');
      throw error;
    }

    return result.user_id;

  } catch (error) {
    console.log('signup error',error)
    throw error;
  }
}


/**
 * Registers a user
 * @param name 
 * @param email
 * @param password
 * @param phone_number
 * @param referer - (optional) 
 * @returns userId - String
*/
exports.userSignup = async ({email, password, phone_number, name, referer}) => {

  try {

    const hashedPassword = await bcrypt.hash(password, 12);
    const nameArray = name.split(" ");
    const first_name = nameArray[0];
    let other_names;

    if (nameArray.length > 1) {
      other_names = `${nameArray[1]} ${nameArray[2] || ""}`;      
    }

    const user = new User({
      email,
      first_name,
      phone_number,
      role: 'user',
      user_id: uid(),
      password: hashedPassword,
      other_names: other_names.trim(),
      referer: referer || 'upbase admin',
    });

    const result = await user.save();

    if (!result) {
      const error = new Error('Error occured, user was not created.');
      throw error;
    }

    return result.user_id;

  } catch (error) {
    console.log('signup error',error)
    throw error;
  }
}


/**
 * Authenticates a user
 * @param email
 * @param password - String
 * @returns user token - Object
*/
exports.login = async ({email, password}) => {

  try {
    const user = await User.findOne({email: email})
  
    if (!user) {
      const error = new Error('User does not exist.');
      error.statusCode = 401;
      throw error;
    }

    const loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual){
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({
      email: loadedUser.email, 
      userId: loadedUser.user_id
    }, jwtsecret, {
      expiresIn: '1h'
    } );

    if (!token) {
      const error = new Error('Error occured, could not create token.');
      throw error;
    }

    return {
      token,
      userId: loadedUser.user_id
    };
    
  } catch (error) {
    console.log(error)
    throw error;
  }
}

/**
 * Fetches all users from database
 * returns a maximum of two documents when @param perPage is not set
 * @param page - (optional) for pagination
 * @param perPage - (optional) for pagination
 * @returns users - Array
*/
exports.getAllUsers = async (page, perPage) => {
  const currentPage = parseInt(page, 10) || 1;
  const usersPerPage = parseInt(perPage, 10) || 10;

  try {
    const users = await User.find()
    .select('email first_name other_names phone_number user_id -_id')
    // .skip((currentPage - 1) * usersPerPage)
    // .limit(usersPerPage);

    if (users.length === 0) {
      const error = new Error('User record is empty');
      throw error;
    }

    return users; 
  } catch (error) {
    throw error;
  }
}

/**
 * Updates user info
 * @param userId
 * @param data
 * @returns user - Object
*/
exports.updateUser = async (userId, data) => {

  try {
    const updatedUser = await User.findOneAndUpdate({user_id: userId}, data, {new: true});
    
    if (!updatedUser) {
      const error = new Error('Could not update user');
      throw error;
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

/**
 * Performs partial text search on user model,
 * returns a maximum of two documents when @param perPage is not set
 * @param queryString
 * @param page - (optional) for pagination
 * @param perPage - (optional) for pagination
 * @returns users - Array
*/
exports.searchUser = async ({ queryString, page, perPage }) => {
  const currentPage = parseInt(page, 10) || 1;
  const usersPerPage = parseInt(perPage, 10) || 5;

  try {
    const query = {
      $or: [
        { email: {
          $regex: queryString,
          '$options': 'i'
          }
        },
        { first_name: {
          $regex: queryString,
          '$options': 'i'
          }
        },
        { other_names: {
          $regex: queryString,
          '$options': 'i'
          }
        },
        { phone_number: {
          $regex: queryString,
          '$options': 'i'
          }
        }
      ]
    };

    const users = await User
      .find(query)
      .select('email first_name other_names phone_number referer -_id')
      .skip((currentPage - 1) * usersPerPage)
      .limit(usersPerPage);
  
    if (users.size == 0){
      return null;
    }
    console.log('users', users)
    return users;
    
  } catch (error) {
    return error;
  }
   
}