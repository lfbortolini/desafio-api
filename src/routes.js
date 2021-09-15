const express = require("express");
const UserController = require("./controllers/UserController");

const routes = express.Router();

routes.get("/users", UserController.findAll);
routes.get("/users/:user_id", UserController.findByID);
routes.get("/users/:user_id/tasks", UserController.findTaskByUser);
routes.post("/users", UserController.post);
routes.put("/users/:user_id", UserController.update);
routes.delete("/users/:user_id", UserController.delete);

module.exports = routes;
