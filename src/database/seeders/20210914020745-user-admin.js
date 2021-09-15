"use strict";
const { v4: uuid_v4 } = require("uuid");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash("123456", 8);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuid_v4(),
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
