const { SchemaType } = require("mongoose");
const mongoose = require("mongoose");

const Schedule = mongoose.model(
  "Schedule",
  new mongoose.Schema({
    name: String,
    minPercentage: Number,
    maxPercentage: Number,
  })
);

module.exports = Schedule;