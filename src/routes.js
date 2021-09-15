const express = require("express");
const UserController = require("./controllers/UserController");
const SessionController = require("./controllers/SessionController");

const { login, userAdmin, correctUser } = require("./middleware/auth");

const routes = express.Router();

routes.get("/users", login, userAdmin, UserController.findAll);
routes.get("/users/:user_id", login, userAdmin, UserController.findByID);
routes.get(
  "/users/:user_id/tasks",
  login,
  userAdmin,
  UserController.findTaskByUser
);
routes.post("/users", login, userAdmin, UserController.post);
routes.put("/users/:user_id", login, userAdmin, UserController.update);
routes.delete("/users/:user_id", login, userAdmin, UserController.delete);

routes.post("/signin", SessionController.signin);

module.exports = routes;
