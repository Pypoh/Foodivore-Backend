const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
// db.url = dbConfig.url;
db.foods = require("./food.model.js")(mongoose);
db.records = require("./record.model.js")(mongoose);

db.user = require("./user.model");
db.role = require("./role.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;