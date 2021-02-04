const express = require("express");
const bodyParser = require("body-parser");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: ShortUniqueId } = require("short-unique-id");
const jwtsecret = require("./src/config/config").secret;

const Product = require("./src/models/product");
const User = require("./src/models/user");
// const userRoute = require("./src/routes/user");
// const authRoute = require('./src/routes/auth');

const db = require("./src/config/mongoose");
var cors = require("cors");

const app = express();

app.use(cors());
const port = process.env.PORT || 3001;



app.use(express.json());

// app.use("/", userRoute);
// app.use('/', adminRoute);
const AuthController = async (req, res, next) => {
  const errors = validationResult(req);
  // const { email, password, phone_number, name, referer } = req.body;
  const { email, password } = req.body;
  try {
    // if (!errors.isEmpty()) {
    //   const error = new Error("Validation failed.");
    //   error.statusCode = 422;
    //   error.data = errors.array();
    //   throw error;
    // }

    const hashedPassword = await bcrypt.hash(password, 12);
    // const nameArray = name.split(" ");
    // const first_name = nameArray[0];
    // let other_names;
    // if (nameArray.length > 1) {
    //   other_names = `${nameArray[1]} ${nameArray[2] || ""}`;
    // }
    let user = await User.findOne({ email });
    if (user){
      const error = new Error("email already exist.");
      throw error;
    }
    user = new User({
      email,
      // first_name,
      // phone_number,
      // role: "admin",
      // user_id: uid(),
      password: hashedPassword,
      // other_names: other_names.trim(),
      // referer: referer || "upbase admin",
    });
    console.log("yes");
    const result = await user.save();
    console.log("no");
    if (!result) {
      const error = new Error("Error occured, user was not created.");
      throw error;
    }

    const user_id = result._id.toString();

    res.status(201).json({
      message: "User created, you can now login",
      data: user_id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

app.post(
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
    // body("phone_number")
    //   .isMobilePhone("en-NG")
    //   .withMessage("Please enter a valid phone number")
    //   .isLength({ min: 10, max: 13 }),
    // body("name").trim().isString().not().isEmpty(),
  ],
  AuthController
);

const AuthControllerlogin = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { email, password } = req.body;
    // const user = await AuthService.login(req.body);
    let user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      const error = new Error("User does not exist.");
      error.statusCode = 401;
      throw error;
    }

    const loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser.user_id,
      },
      jwtsecret,
      {
        expiresIn: "1h",
      }
    );

    if (!token) {
      const error = new Error("Error occured, could not create token.");
      throw error;
    }

    user = {
      token,
      userId: loadedUser.user_id,
    };
    res.status(200).json({
      message: "User authenticated.",
      data: user.userId,
      token: user.token,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

app.post(
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
  AuthControllerlogin
);

// app.patch("/user",  AuthController.updateUser);

const ProductController = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const result = await product.save();
    if (!result) {
      const error = new Error("Error occured, product was not created.");
      throw error;
    }
    res.status(201).json({
      message: "product created.",
      data: product,
    });
  } catch (error) {
    console.log("product upload error", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
const ProductControl = async (req, res, next) => {
  try {
    // const totalItems = await Product.find().countDocuments();
    const product = await Product.find();
    // .skip((currentPage - 1) * questionsPerPage)
    // .limit(questionsPerPage);

    if (!product) {
      const error = new Error("Error occured, could not fetch product.");
      throw error;
    }
    res.status(200).json({
      message: "products found.",
      data: product,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

app.post("/product", ProductController);

app.get("/product", ProductControl);


// app.get("/", (req, res, next) =>
//   res.json({ message: "app working." })
// );

app.use("/", (req, res, next) =>
  res.status(404).json({ message: "Page not found." })
);

// Global error handler
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    message,
    data,
    status,
  });
});

db.mongoConnection()
  .then((result) => {
    app.listen(port, () => {
      console.log(`server starting on port: ${port}`);
    });
  })
  .catch((error) => console.log("Mongo connection error"));
