const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
  async findAll(req, res) {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role"],
        order: [["name", "ASC"]],
      });
      return res.json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch users" || error.error });
    }
  },
};
