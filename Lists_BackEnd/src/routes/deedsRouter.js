const { Router } = require("express");
const deedsController = require("../controllers/deedsController");

const deedsRouter = Router();

// deedsRouter.route("/").get(deedsController.list).post(deedsController.add);
// deedsRouter
//     .route("/:id")
//     .get(deedsController.get)
//     .put(deedsController.update)
//     .delete(deedsController.remove);

deedsRouter.route("/").get(deedsController.list).post(deedsController.add);
deedsRouter.route("/:id").get(deedsController.get).delete(deedsController.remove).put(deedsController.update);
// deedsRouter.route("/deeds/:id").delete();

module.exports = deedsRouter