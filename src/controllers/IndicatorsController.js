const { Op } = require("sequelize");
const Task = require("../models/Task");
const moment = require("moment");
require("moment-precise-range-plugin");

module.exports = {
  async qtCompletedTasks(req, res) {
    const { date_begin, date_finish } = req.query;

    const whereOptions = {};
    if (date_begin) {
      whereOptions.date_begin = { [Op.gte]: date_begin };
    }

    if (date_finish) {
      whereOptions.date_finish = { [Op.lte]: date_finish };
    }

    const result = await Task.count({
      where: {
        status: "finished",
        date_finish: { [Op.not]: null },
        ...whereOptions,
      },
    });

    return res.status(200).json(result);
  },

  async qtCompletedTasksByUser(req, res) {
    const { date_begin, date_finish } = req.query;

    const whereOptions = {};
    if (date_begin) {
      whereOptions.date_begin = { [Op.gte]: date_begin };
    }

    if (date_finish) {
      whereOptions.date_finish = { [Op.lte]: date_finish };
    }

    const tasks = await Task.count({
      attributes: {
        include: ["responsible_id"],
      },
      where: {
        status: "finished",
        ended_at: { [Op.not]: null },
        ...whereOptions,
      },
      group: ["responsible_id"],
    });

    return res.status(200).json(tasks);
  },

  async timeBetweenOpenAndInProgress(req, res) {
    const { date_begin, date_finish } = req.query;

    const whereOptions = {};
    if (date_begin) {
      whereOptions.date_begin = { [Op.gte]: date_begin };
    }

    if (date_finish) {
      whereOptions.date_finish = { [Op.lte]: date_finish };
    }

    const tasks = await Task.findAll({
      attributes: {
        include: ["description", "created_at", "date_begin"],
      },
      where: {
        date_begin: { [Op.not]: null },
        ...whereOptions,
      },
    });

    const result = [];
    tasks.forEach((task) => {
      result.push({
        description: task.description,
        created_at: task.created_at,
        date_begin: task.date_begin,
        timeOpenInProgress: moment.preciseDiff(
          task.created_at,
          task.date_begin,
          true
        ),
      });
    });

    return res.status(200).json(result);
  },

  async timeBetweenInProgressAndDone(req, res) {
    const { date_begin, date_finish } = req.query;

    const whereOptions = {};
    if (date_begin) {
      whereOptions.date_begin = { [Op.gte]: date_begin };
    }

    if (date_finish) {
      whereOptions.date_finish = { [Op.lte]: date_finish };
    }

    const tasks = await Task.findAll({
      attributes: {
        include: ["description", "created_at", "date_begin", "date_finish"],
      },
      where: {
        date_begin: { [Op.not]: null },
        date_finish: { [Op.not]: null },
        status: "finished",
        ...whereOptions,
      },
    });

    const result = [];
    tasks.forEach((task) => {
      result.push({
        description: task.description,
        created_at: task.created_at,
        date_begin: task.date_begin,
        timeOpenInProgress: moment.preciseDiff(
          task.date_begin,
          task.date_finish,
          true
        ),
      });
    });

    return res.status(200).json(result);
  },
};
