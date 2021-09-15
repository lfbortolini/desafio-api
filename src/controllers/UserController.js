const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const yup = require("yup");
const { v4: uuid_v4 } = require("uuid");
const { update } = require("../models/Task");
const { use } = require("../routes");

module.exports = {
  async findAll(req, res) {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role"],
        order: [["name", "ASC"]],
      });
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  async findByID(req, res) {
    const { user_id } = req.params;

    try {
      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).json({ error: "User already exists" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  },

  async findTaskByUser(req, res) {
    const { user_id } = req.params;
    try {
      const tasks = await Task.findAll({
        where: { responsible_id: user_id },
        order: ["created_at"],
      });

      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch user tasks" });
    }
  },

  async post(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      role: yup.string().required(),
      password: yup.string().min(6).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: "No body data passed. Try 'name', 'email', 'role' or 'password'",
      });
    }

    const { role } = req.body;

    if (role && role !== "agent" && role !== "admin") {
      return res
        .status(400)
        .json({ error: "Value 'role' field should be 'agent' or 'admin'" });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    try {
      const { id, name, email, role } = await User.create({
        id: uuid_v4(),
        ...req.body,
      });

      return res.status(201).json({ id, name, email, role });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create user" });
    }
  },

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      role: yup.string().required(),
      old_password: yup.string().min(6),
      password: yup
        .string()
        .when("old_password", (old_password, field) =>
          old_password ? field.required() : field
        ),
      confirm_password: yup
        .string()
        .when("password", (password, field) =>
          password ? field.required().oneOf([yup.ref("password")]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: "No body data passed.",
      });
    }

    const { email, role, old_password } = req.body;

    if (role && role !== "agent" && role !== "admin") {
      return res
        .status(400)
        .json({ error: "Value 'role' field should be 'agent' or 'admin'" });
    }

    const user = await User.findByPk(req.params.user_id);

    if (!user) {
      return res.status(404).json({ message: "This user is not registered" });
    }

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res
          .status(400)
          .json({ message: "This email was already registered" });
      }
    }

    if (!(await user.checkPassword(old_password))) {
      return res.status(404).json({ message: "Old password does not match" });
    }

    try {
      await user.update(req.body);

      return res.status(204).json();
    } catch (error) {
      return res.status(500).json({ error: "Failed to update user" });
    }
  },

  async delete(req, res) {
    const { user_id } = req.params;
    try {
      const result = await User.destroy({ where: { id: user_id } });

      return result
        ? res.status(204).json()
        : res.status(404).json({ error: "User not found" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to remove user" });
    }
  },
};
