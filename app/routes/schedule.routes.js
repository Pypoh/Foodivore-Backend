module.exports = app => {
    const schedule = require("../controllers/schedule.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Food
    router.get("/", schedule.findAll);

    router.get("/:id", schedule.findOne);
  
    app.use('/api/schedule', router);
  };