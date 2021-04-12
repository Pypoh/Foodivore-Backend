module.exports = app => {
    const foods = require("../controllers/food.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Food
    router.post("/", foods.create);
  
    // Retrieve all Food
    router.get("/", foods.findAll);

    // // Retrieve all published Food
    // router.get("/published", foods.findAllPublished);
  
    // Retrieve a single Food with id
    router.get("/:id", foods.findOne);
  
    // Update a Food with id
    router.put("/:id", foods.update);
  
    // Delete a Food with id
    router.delete("/:id", foods.delete);
  
    router.delete("/", foods.deleteAll);
  
    app.use('/api/foods', router);
  };