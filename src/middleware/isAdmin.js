const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ user_id: userId });
    // console.log(user);
    if (user.role !== "admin")
      return res.status(403).send("user not Authorized");
    next();
  } catch (error) {
    console.log(error);
  }
};
