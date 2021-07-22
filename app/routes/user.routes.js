const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.get("/api/test/all", controller.allAccess);

  // app.get("/api/test/user", [authJwt.verifyToken], controller.findOne);

  // app.get(
  //   "/api/test/mod",
  //   [authJwt.verifyToken, authJwt.isModerator],
  //   controller.moderatorBoard
  // );

  // app.get(
  //   "/api/test/admin",
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   controller.adminBoard
  // );

  app.get("/api/user", [authJwt.verifyToken], controller.findOne);

  app.get(
    "/api/user/calorie",
    [authJwt.verifyToken],
    controller.findOneCalorie
  );

  app.post("/api/user/record", [authJwt.verifyToken], controller.insertRecord);

  app.get(
    "/api/user/record",
    [authJwt.verifyToken],
    controller.findRecordByDate
  );

  app.post("/api/user/plan", [authJwt.verifyToken], controller.insertPlan);

  app.get("/api/user/plan", [authJwt.verifyToken], controller.findPlanByDate);

  app.delete("/api/user/plan/:id", [authJwt.verifyToken], controller.deletePlan);

  app.get(
    "/api/recommendation",
    [authJwt.verifyToken],
    controller.getRecommendation
  );

  app.post(
    "/api/user/image",
    [authJwt.verifyToken],
    controller.updateProfilePicture
  );

  app.post(
    "/api/user/pretest/update",
    [authJwt.verifyToken],
    controller.updatePreTestData
  );
};
