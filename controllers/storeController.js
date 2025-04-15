const Home = require("../models/home");
const User = require("../models/user");
const Booking = require("../models/bookings");
const path = require("path");
const rootDir = require("../utils/pathUtil");
const generateInvoice = require('../utils/invoiceGenerator');

exports.getIndex = (req, res, next) => {
  console.log("Session Value: ", req.session);
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

// exports.getBookings = (req, res, next) => {
//   res.render("store/bookings", {
//     pageTitle: "My Bookings",
//     currentPage: "bookings",
//     isLoggedIn: req.isLoggedIn, 
//     user: req.session.user,
//   });
// };
exports.getBookingList = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const bookings = await Booking.find({ userId: userId }).populate('hotelId');

    // Pass the invoice query parameter to the template
    const invoice = req.query.invoice || null;

    res.render("store/booking-list", {
      bookingHomes: bookings,
      pageTitle: "My Bookings",
      currentPage: "bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      invoice: invoice, // Pass the invoice value
    });
  } catch (error) {
    console.log(error);
    res.redirect("/homes");
  }
};
exports.postBooking = async (req, res, next) => {
  try {
    // Check if user is logged in
    if (!req.session.isLoggedIn || !req.session.user) {
      req.flash('error', 'Please login to make a booking');
      return res.redirect('/login');
    }

    const userId = req.session.user._id;
    const { homeId, checkIn, checkOut, guests, price } = req.body;

    // Validate required fields
    if (!homeId || !checkIn || !checkOut || !guests || !price) {
      req.flash('error', 'All fields are required');
      return res.redirect('/homes');
    }

    // Create and save booking
    const booking = new Booking({
      userId,
      hotelId: homeId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: parseInt(guests),
      price: parseFloat(price),
      status: 'pending'
    });

    await booking.save();
    req.flash('success', 'Booking created successfully');
    res.redirect('/checkout');

  } catch (error) {
    console.error('Booking error:', error);
    req.flash('error', 'An error occurred while processing your booking');
    res.redirect('/homes');
  }
};
exports.postRemoveBooking = async (req, res, next) => {
  const userId = req.session.user._id;
  const homeId = req.params.homeId;
  try {
    await Booking.deleteOne({ userId: userId, hotelId: homeId });
    res.redirect("/bookings");
  }
  catch (error) {
    console.log(error);
    res.redirect("/homes");
  }
}
  

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn, 
        user: req.session.user,
      });
    }
  });
};
exports.postBookHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      home.bookings.push(userId);
      return home.save();
    }
  }).then(() => {
    res.redirect("/bookings");
  }).catch(err => {
    console.log(err);
    res.redirect("/homes");
  });
};

exports.getHouseRules= (req, res, next) => {
    if(!req.isLoggedIn){
        return res.redirect("/login");
    }
    next();
    };
    (req, res, next) => {
      const homeId = req.params.homeId;
      const rulesFileName = "rules.pdf";
      Home.findById(homeId).then((home) => {
        if (!home) {
          console.log("Home not found");
          res.redirect("/homes");
          } else {
          const filePath = path.join(rootDir,  "rules", rulesFileName);
          res.download(filePath, rulesFileName, (err) => {
            if (err) {
              console.log("Error downloading file: ", err);
            }
          });
        }
      }
      ).catch(err => {
        console.log(err);
        res.redirect("/homes");
      });
    }

exports.getCheckout = async (req, res, next) => {
  try {
    const homeId = req.query.homeId;
    const checkIn = req.query.checkIn;
    const checkOut = req.query.checkOut;
    const guests = req.query.guests;

    const home = await Home.findById(homeId);
    if (!home) {
      return res.redirect('/homes');
    }

    // Calculate number of nights
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (guests <= 0) {
      req.flash('error', 'Invalid number of guests');
      return res.redirect('/homes');
    }
    if (nights <= 0) {
      req.flash('error', 'Invalid booking dates');
      return res.redirect('/homes');
    }
    const totalAmount = home.price * nights * guests;

    res.render('store/checkout', {
      home,
      checkIn,
      checkOut,
      guests,
      totalAmount,
      pageTitle: 'Checkout',
      currentPage: 'checkout',
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  } catch (error) {
    console.log(error);
    res.redirect('/homes');
  }
};

exports.processPayment = async (req, res, next) => {
  try {
    const bookingData = JSON.parse(req.body.bookingData);
    
    // Create booking
    const booking = new Booking({
      userId: req.session.user._id,
      hotelId: bookingData.homeId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      price: bookingData.price,
      status: 'confirmed'
    });
    
    await booking.save();

    // Generate invoice
    const invoicePath = await generateInvoice(booking);

    // Send success response
    req.flash('success', 'Payment successful! Booking confirmed.');
    // req.flash('success', 'Payment successful! Booking confirmed.');
    res.redirect(`/bookings?invoice=${encodeURIComponent(invoicePath)}`);
  } catch (error) {
    console.error('Payment processing error:', error);
    req.flash('error', 'Payment processing failed');
    res.redirect('/checkout');
  }
};

