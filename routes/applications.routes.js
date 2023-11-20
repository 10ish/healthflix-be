const applicationController = require("../controllers/application.controller");
const authValidator = require("../middlewares/authValidator");

module.exports = (app) => {
  app.post(
    "/applications/submit",
    [authValidator.verifyUserToken],
    applicationController.createApplication
  );
  app.get("/applications", applicationController.getAllApplications);
  app.get("/applications/:id", applicationController.getOneApplication);
  app.delete(
    "/applications/delete",
    applicationController.deleteOneApplication
  );
};
