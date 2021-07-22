module.exports = (app) => {
  const ingredients = require("../controllers/ingredient.controller.js");

  var router = require("express").Router();

  router.post("/", ingredients.create);

  router.get("/", ingredients.findAll);

  router.post("/all", ingredients.findAllList);

  router.get("/:id", ingredients.findOne);

  router.put("/:id", ingredients.update);

  router.delete("/:id", ingredients.delete);

  router.delete("/", ingredients.deleteAll);

  app.use("/api/ingredients", router);
};
