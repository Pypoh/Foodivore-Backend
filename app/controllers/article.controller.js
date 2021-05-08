const db = require("../models");
const Category = require("../models/category.model");
const Blog = db.article;

exports.create = (req, res) => {
  const article = new Blog({
    imageUrl: req.body.imagerUrl,
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
  });

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
};
