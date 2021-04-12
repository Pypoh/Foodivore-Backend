const db = require("../models");
const User = db.user;
const Role = db.role;
const Record = db.records;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.updatePreTestData = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const name = req.body.name;
  const height = req.body.height;
  const weight = req.body.weight;
  const sex = req.body.sex;
  const age = req.body.age;
  const activity = req.body.activity;
  const target = req.body.target;

  User.findByIdAndUpdate(
    req.userId,
    {
      $set: {
        name: name,
        height: height,
        weight: weight,
        sex: sex,
        age: age,
        activty: activity,
        target: target,
      },
    },
    { multi: true, useFindAndModify: true }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe Food was not found!`,
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.userId;
  User.findById(id, { _id: 0, roles: 0, email: 0, password: 0, __v: 0 })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving User with id=" + id });
    });
};

exports.insertRecord = (req, res) => {
  const id = req.userId;

  if (!req.body.foodId) {
    res.status(400).send({ message: "Food ID can not be empty!" });
    return;
  }

  const record = new Record({
    userId: id,
    foodId: req.body.foodId,
    type: req.body.type,
  });

  record
    .save(record)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Record.",
      });
    });
};

exports.findPlanByDate = (req, res) => {
  if (!req.userId) {
    res.status(400).send({ message: "User ID can not be empty!" });
    return;
  }

  const id = req.userId;

  const time = parseInt(req.query.time);
  const nextDayTime = time + 1000 * 60 * 60 * 24;

  const today = new Date(time)
  const tomorrow = new Date(nextDayTime)

  Record.find({ createdAt: { $gte: today, $lte: tomorrow }, userId: id })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Record with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};