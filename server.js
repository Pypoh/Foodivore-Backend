const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var multer = require("multer");
var upload = multer();

const db = require("./app/models");
const dbConfig = require("./app/config/db.config.js");
const Category = require("./app/models/category.model");
const MealSchedule = require("./app/models/schedule.model");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initialRole();
    initialCategory();
    initialSchedule();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initialRole() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

function initialCategory() {
  Category.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Category({
        name: "Kesehatan",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Kesehatan' to roles collection");
      });

      new Category({
        name: "Penyakit",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Penyakit' to roles collection");
      });

      new Category({
        name: "Tips & Trick",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Tips & Trick' to roles collection");
      });

      new Category({
        name: "System",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'System' to roles collection");
      });
    }
  });
}

function initialSchedule() {
  MealSchedule.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new MealSchedule({
        name: "Sarapan",
        scala: 2,
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Sarapan' to roles collection");
      });

      new MealSchedule({
        name: "Camilan",
        scala: 1,
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Camilan Pagi' to roles collection");
      });

      new MealSchedule({
        name: "Makan Siang",
        scala: 2,
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Makan Siang' to roles collection");
      });

      new MealSchedule({
        name: "Minuman",
        scala: 1,
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Camilan Sore' to roles collection");
      });

      new MealSchedule({
        name: "Makan Malam",
        scala: 2,
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Makan Malam' to roles collection");
      });
    }
  });
}

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
// app.use(upload.array());
// app.use(express.static('public'));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Foodivore backend service." });
});

// routes
require("./app/routes/food.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/article.routes")(app);
require("./app/routes/file.routes")(app);
require("./app/routes/schedule.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;