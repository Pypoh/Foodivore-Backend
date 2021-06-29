const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    height: Number,
    weight: Number,
    sex: String,
    age: Number,
    activity: String,
    target: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    calorieNeeds: Number,
    imageUrl: String

  })
);

module.exports = User;