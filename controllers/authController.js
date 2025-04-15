const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
exports.getLogin= (req, res, next) => {
    res.render("auth/login", {
      errors: [],
       oldInput: {} ,
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
    });
  };
exports.getRegister= (req, res, next) => {
    res.render("auth/register", {
      pageTitle: "Register",
      currentPage: "register",
      isLoggedIn: false,
      errors: [],
      oldInput: { username: "", email: "", password: "", confirmPassword: "" },
      user: {},

    });
  };
exports.postRegister=[
  check ("username")
  .isLength({min: 6}).withMessage ("Username must be at least 3 characters long"),
  check ("email")
  .isEmail().withMessage ("Please enter a valid email")
  .normalizeEmail(),
  check ("password")
  .isLength({min: 8}).withMessage ("Password must be at least 8 characters long")
  .matches(/[A-Z]/).withMessage ("Password must contain at least one uppercase letter")
  .matches(/[a-z]/).withMessage ("Password must contain at least one lowercase letter")
  .matches(/[0-9]/).withMessage ("Password must contain at least one number")
  .matches(/[!@&]/).withMessage ("Password must contain at least one special character")
  .trim(),
  check ("confirmPassword")
  .isLength({min: 8}).withMessage ("Password must be at least 8 characters long")
  .matches(/[A-Z]/).withMessage ("Password must contain at least one uppercase letter")
  .matches(/[a-z]/).withMessage ("Password must contain at least one lowercase letter")
  .matches(/[0-9]/).withMessage ("Password must contain at least one number")
  .matches(/[!@&]/).withMessage ("Password must contain at least one special character")
  .trim()
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
 check("userType")
 .notEmpty().withMessage("Please select a user type")
 .isIn(["guest", "host"]).withMessage("Please select a valid user type"),
 check("terms")
   .notEmpty()
   .withMessage("Please accept the terms and conditions")
   .custom((value, {req}) => {
     if (value !== "on") {
       throw new Error("Please accept the terms and conditions");
     }
     return true;
   }),
   
   (req, res, next) => {
     const {username, email, password, userType} = req.body;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(422).render("auth/register", {
         pageTitle: "Register",
         currentPage: "register",
         isLoggedIn: false,
         errors: errors.array().map(err => err.msg),
         oldInput: {username, email, password, userType},
         user: {},
       });
     }
 
     bcrypt.hash(password, 12)
     .then(hashedPassword => {
       const user = new User({username, email, password: hashedPassword, userType});
       return user.save();
     })
     .then(() => {
       res.redirect("/login");
     }).catch(err => {
       return res.status(422).render("auth/register", {
         pageTitle: "Register",
         currentPage: "register",
         isLoggedIn: false,
         errors: [err.message],
         oldInput: {username, email, userType},
         user: {},
       });
     });
   }
]
exports.postLogin = async (req, res, next) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: {email},
      user: {},
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid Password"],
      oldInput: {email},
      user: {},
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();

  res.redirect("/");
}

exports.postLogout= (req, res, next) => {
  console.log("Logout successfully");
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
}

exports.getForgotPassword = (req, res) => {
  res.render('auth/forgot-password', {
    pageTitle: 'Forgot Password',
    currentPage: 'forgot-password',
    isLoggedIn: false,
    errors: [],
    oldInput: {}
  });
};

exports.postForgotPassword = (req, res) => {
  const { email } = req.body;
  
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/forgot-password', {
          pageTitle: 'Forgot Password',
          currentPage: 'forgot-password',
          isLoggedIn: false,
          errors: ['No account with that email found'],
          oldInput: { email }
        });
      }
      
      res.render('auth/reset-password', {
        pageTitle: 'Reset Password',
        currentPage: 'reset',
        isLoggedIn: false,
        errors: [],
        userId: user._id.toString()
      });
    })
    .catch(err => console.log(err));
};

exports.getResetPassword = (req, res) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }
  })
    .then(user => {
      if (!user) {
        return res.redirect('/login');
      }
      res.render('auth/reset-password', {
        pageTitle: 'Reset Password',
        currentPage: 'reset',
        isLoggedIn: false,
        errors: [],
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => console.log(err));
};

exports.postResetPassword = [
  // Add password validation
  check("password")
    .isLength({min: 8}).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[!@&]/).withMessage("Password must contain at least one special character")
    .trim(),
  
  (req, res) => {
    const { password, userId } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/reset-password', {
        pageTitle: 'Reset Password',
        currentPage: 'reset',
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        userId: userId
      });
    }

    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.redirect('/login');
        }
        return bcrypt.hash(password, 12)
          .then(hashedPassword => {
            user.password = hashedPassword;
            return user.save();
          });
      })
      .then(() => {
        res.redirect('/login');
      })
      .catch(err => console.log(err));
  }
];