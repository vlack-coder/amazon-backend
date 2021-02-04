const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: {
    type: String,
    // required: true
  },
  other_names: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    // required: true
  },
  referer: {
    type: String
  },
  // user_id: {
  //   type: String,
  //   required: true
  // },
  order: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meal",
  }],
  role: {
    type: String,
    default: 'user'
  }
}).index({email: 'text'});

module.exports = new mongoose.model('User', userSchema);