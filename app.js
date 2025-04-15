// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const flash = require('connect-flash');

const MongoDBStore = require('connect-mongodb-session')(session);
const DB_PATH = "mongodb+srv://mantupal778899:DlUfNLTNzhlLTJzb@cluster0.7vqqwwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const sessionStore = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
});

// Local Module
const storeRouter = require("./routes/storeRouter")
const authRouter = require("./routes/authRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { default: mongoose } = require('mongoose');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
const storage=multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, randomString(10) + '-' + file.originalname)
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(express.urlencoded());
app.use(express.json());

app.use(multer({storage,fileFilter}).single('photo'));
app.use(express.static(path.join(rootDir, 'public')))
app.use("/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/host/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/homes/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/rules", express.static(path.join(rootDir, 'rules')))
app.use("/homes/rules", express.static(path.join(rootDir, 'rules')))
app.use("/host/rules", express.static(path.join(rootDir, 'rules')))
app.use("/invoices", express.static(path.join(rootDir, 'invoices')))


// **Move session middleware above custom middleware**
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Add flash messages middleware
app.use(flash());

// Add authentication check middleware
app.use((req, res, next) => {
  if (!req.session.isLoggedIn) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

// Add locals middleware for templates
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.user = req.session.user;
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  next();
});

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn || false; // Ensure it's always a boolean
  next();
});

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.use("/host", hostRouter);
app.use(express.static(path.join(rootDir, 'public')));

app.use(errorsController.pageNotFound);

const PORT = 3000;

mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});
