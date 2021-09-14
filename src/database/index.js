import Sequelize from "sequelize";
import configDB from "../config/database";
import User from "../models/User";
import Task from "../models/Task";

const models = [User, Task];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(configDB);

    models.map((model) => model.init(this.connection));

    models.map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
