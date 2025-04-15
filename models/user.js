//models/user.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: [true,"Username is required"],
  },
  email: {
    type: String,
    required: [true,"Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true,"Password is required"],
  },
  userType: {
    type: String,
    enum: ["guest", "host"],
    default: "guest",
    
  },
  resetToken: String,
  resetTokenExpiration: Date,
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
    },
  ],
});
module.exports = mongoose.model("User", userSchema);