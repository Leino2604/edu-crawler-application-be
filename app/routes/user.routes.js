const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.UserBoard
  );

  // app.get(
  //   "/api/test/manager",
  //   [authJwt.verifyToken, authJwt.isManager],
  //   controller.ManagerBoard
  // );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.AdminBoard
  );

  // app.get("/api/test/:role", async (req, res) => {
  //   const requiredRole = req.params; // Extract required role from URL parameter

  //   try {
  //     console.log(req.body);
  //     await authJwt.verifyToken(req, res); // Verify token
  //   } catch (error) {
  //     return res.status(error.status || 500).json({ message: error.message });
  //   }

  //   try {
  //     await authJwt.checkRole(req, res, requiredRole); // Check role
  //   } catch (error) {
  //     return res.status(error.status || 500).json({ message: error.message });
  //   }

  //   controller.UserBoard(req, res); // Call controller function
  // });

  app.get("/api/test/:role", [authJwt.verifyToken, authJwt.checkRole], controller.UserBoard);
};