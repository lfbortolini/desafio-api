const { Op } = require("sequelize");
const Task = require("../models/Task");
const User = require("../models/User");

module.exports = {
  async findAll(req, res) {},

  async findByID(req, res) {
    const { task_id } = req.params;

    try {
      const task = await Task.findByPk(task_id);

      if (!task) {
        return res.status(404).json({ error: "task not found" });
      }

      return res.status(200).json(task);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "failed to fetch task" });
    }
  },

  async post(req, res) {
    const { description } = req.body;

    if (!description) {
      return res
        .status(400)
        .json({ error: "No body data passed. Try 'description'" });
    }

    try {
      const task = await Task.create({ description, status: "open" });

      return res.status(200).json(task);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to created task" });
    }
  },

  async update(req, res) {
    const { task_id } = req.params;
    const { description, status, responsible_id, date_begin, date_finish } =
      req.body;

    try {
      const result = await Task.update(
        { description, status, responsible_id, date_begin, date_finish },
        { where: { id: task_id } }
      );

      return result[0]
        ? res.status(200).json(result)
        : res.status(404).json({ error: "Task not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to update task" });
    }
  },

  async delete(req, res) {
    const { task_id } = req.params;

    try {
      const result = await Task.destroy({
        where: { id: task_id },
      });

      return result
        ? res.status(204).json()
        : res.status(404).json({ error: "Task not found" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to remove task" });
    }
  },

  async checkin(req, res) {
    const { task_id } = req.params;
    const { responsible_id } = req.body;

    if (!responsible_id) {
      return res
        .status(400)
        .json({ error: "No body data passed. Try 'responsible_id'" });
    }

    try {
      const result = await Task.update(
        { responsible_id, date_begin: new Date(), status: "doing" },
        {
          where: {
            id: task_id,
            date_finish: { [Op.is]: null },
            responsible_id: { [Op.is]: null },
          },
        }
      );

      return result[0]
        ? res.send()
        : res.status(404).json({ error: "Task not found or already taken" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to check-in" });
    }
  },

  async checkout(req, res) {
    const { task_id } = req.params;
    const { responsible_id } = req.body;

    if (!responsible_id) {
      return res
        .status(400)
        .json({ error: "No body data passed. Try 'responsible_id'" });
    }

    try {
      const result = await Task.update(
        { ended_at: new Date(), status: "finished" },
        {
          where: {
            id: task_id,
            responsible_id,
            date_begin: { [Op.not]: null },
          },
        }
      );

      return result[0]
        ? res.send()
        : res.status(404).json({ error: "Task not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to check-in" });
    }
  },
};
