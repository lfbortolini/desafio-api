"use strict";
const { uuid } = require("uuidv4");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash("123456", 6);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuid(),
          name: "admin",
          email: "admin@admin.com",
          role: "admin",
          password_hash: passwordHash,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
