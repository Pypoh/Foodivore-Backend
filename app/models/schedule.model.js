const { SchemaType } = require("mongoose");
const mongoose = require("mongoose");

const Schedule = mongoose.model(
  "Schedule",
  new mongoose.Schema({
    name: String,
    scala: Number
  })
);

module.exports = Schedule;