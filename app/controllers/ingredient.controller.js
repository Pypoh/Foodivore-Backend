const db = require("../models");
const Ingredient = db.ingredient;
const FoodType = require("../models/foodtype.model");
const Food = db.foods;

const processFile = require("../middlewares/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("foodivore_images");

exports.create = async (req, res) => {
  try {
    let publicUrl;
    await processFile(req, res);

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // Create a new blob in the bucket and upload the file data.
    const folderName = "foods";
    const blob = bucket.file(`${folderName}/${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      // Create URL for directly file access via HTTP.
      publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      try {
        // Make the file public
        await bucket.file(req.file.originalname).makePublic();
      } catch {
        // return res.status(500).send({
        //   message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
        //   url: publicUrl,
        // });
      }

      // Creating food
      const ingredient = new Ingredient({
        imageUrl: publicUrl,
        name: req.body.name,
        calorie: req.body.calorie,
        fat: req.body.fat,
        carb: req.body.carb,
        prot: req.body.prot,
      });

      FoodType.findOne(
        {
          name: { $in: req.body.foodtype },
        },
        (err, foodtypes) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          
          ingredient.foodtype = foodtypes._id;

          ingredient
            .save(ingredient)
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the Food.",
              });
            });
        }
      );
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

// Retrieve all Foods from the database.
exports.findAll = (req, res) => {
  let condition;

  if (req.query.name) {
    const name = req.query.name;

    condition = name
      ? { name: { $regex: new RegExp(name), $options: "i" } }
      : {};

    Ingredient.find(condition)
      .populate("foodtype", "name")
      .exec(function (err, ingredient) {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving tutorials.",
          });
        }
        res.send(ingredient);
      });
  } else if (req.query.foodtype) {
    const foodtype = req.query.foodtype;
    FoodType.findOne(
      {
        name: { $in: foodtype },
      },
      (err, foodtype) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        Ingredient.find({ foodtype: foodtype._id })
          .populate("foodtype", "name")
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving articles.",
            });
          });
      }
    );
  } else {
    Ingredient.find({})
      .populate("foodtype", "name")
      .exec(function (err, ingredient) {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving foods.",
          });
        }
        res.send(ingredient);
      });
  }
};

// Find a single Food with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Ingredient.findById(id)
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

  Ingredient.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
  Ingredient.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Food were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all foods.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Ingredient.findByIdAndRemove(id)
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
