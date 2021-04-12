const db = require("../models");
const Food = db.foods;

// Test creating food
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Creating food
  const food = new Food({
    imageUrl: req.body.imageUrl,
    name: req.body.name,
    calorie: req.body.calorie,
    fat: req.body.fat,
    carb: req.body.carb,
    prot: req.body.prot,
    type: req.body.type,
  });

  food
    .save(food)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Food.",
      });
    });
};

// Retrieve all Foods from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  Food.find(condition)
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

  Food.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Food with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Food with id=" + id });
    });
};

// Update a Food by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Food.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Food with id=${id}. Maybe Food was not found!`,
        });
      } else res.send({ message: "Food was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Food with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Food.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Food were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all foods.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Food.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Food with id=${id}. Maybe Food was not found!`,
        });
      } else {
        res.send({
          message: "Food was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Food with id=" + id,
      });
    });
};

// Find all published Food
// exports.findAllPublished = (req, res) => {
//     Tutorial.find({ published: true })
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving tutorials."
//         });
//       });
//   };
