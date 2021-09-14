const express = require("express");

const UserController = require("./controllers/UserController");

const routes = express.Router();

routes.get("/users", UserController.findAll);

module.exports = routes;
