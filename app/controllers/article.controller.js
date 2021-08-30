const db = require("../models");
const Category = require("../models/category.model");
const Article = db.article;

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
    // const blob = bucket.file(req.file.originalname);
    const folderName = "article";
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

      const article = new Article({
        imageUrl: publicUrl,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
      });

      console.log(req.body.category);
      console.log(req.body.title);

      article.save((err, article) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        Category.findOne(
          {
            name: { $in: req.body.category },
          },
          (err, categories) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            article.category = categories._id;
            article.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
            });

            res.status(200).send({
              message:
                "article " +
                article.title +
                " succesfully created with id " +
                article._id,
            });
          }
        );
      });

      // res.status(200).send({
      //   message: "Uploaded the file successfully: " + req.file.originalname,
      //   url: publicUrl,
      // });
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

exports.findAll = (req, res) => {
  if (req.query.category) {
    Category.findOne(
      {
        name: { $in: req.query.category },
      },
      (err, category) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        Article.find({ category: category._id })
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
  } else if (req.query.title) {
    Article.find({
      title: { $regex: new RegExp(req.query.title), $options: "i" },
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving articles.",
        });
      });
  } else {
    Article.find()
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
};

exports.findCategory = (req, res) => {
  Category.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving article.",
      });
    });
};
