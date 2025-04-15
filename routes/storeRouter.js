// External Module
const express = require("express");
const storeRouter = express.Router();
const isAuth = require("../middleware/auth");

// Local Module
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("rules/:homeId", storeController.getHouseRules);
storeRouter.get("/homes", storeController.getHomes);

// Protected routes
storeRouter.get("/checkout", isAuth, storeController.getCheckout);
storeRouter.post("/bookings", isAuth, storeController.postBooking);
storeRouter.get("/bookings", isAuth, storeController.getBookingList);
storeRouter.post("/bookings/delete/:homeId", isAuth, storeController.postRemoveBooking);
storeRouter.get("/favourites", isAuth, storeController.getFavouriteList);
storeRouter.post("/favourites", isAuth, storeController.postAddToFavourite);

storeRouter.post("/process-payment", isAuth, storeController.processPayment);

storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.post("/favourites/delete/:homeId", storeController.postRemoveFromFavourite);

module.exports = storeRouter;
