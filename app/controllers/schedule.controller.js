const db = require("../models");
const Schedule = require("../models/schedule.model");

// Retrieve all Foods from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  Schedule.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find a single Food with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Schedule.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Food with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Food with id=" + id });
    });
};
