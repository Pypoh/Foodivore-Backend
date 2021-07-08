const { SchemaType } = require("mongoose");
const mongoose = require("mongoose");

const FoodType = mongoose.model(
  "FoodType",
  new mongoose.Schema({
    name: String,
  })
);

module.exports = FoodType;