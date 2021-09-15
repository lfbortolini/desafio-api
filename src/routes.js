const express = require("express");
const UserController = require("./controllers/UserController");

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

module.exports = routes;
