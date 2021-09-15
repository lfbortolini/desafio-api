const express = require("express");
const UserController = require("./controllers/UserController");
const SessionController = require("./controllers/SessionController");
const TaskController = require("./controllers/TaskController");

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

routes.get("/tasks", login, TaskController.findAll);
routes.get("/tasks/:task_id", login, TaskController.findByID);
routes.post("/tasks", login, TaskController.post);
routes.put("/tasks/:task_id", login, TaskController.update);
routes.delete("/tasks/:task_id", login, userAdmin, TaskController.delete);

routes.patch(
  "/tasks/:task_id/checkin",
  login,
  correctUser,
  TaskController.checkin
);
routes.patch(
  "/tasks/:task_id/checkout",
  login,
  correctUser,
  TaskController.checkout
);

module.exports = routes;
