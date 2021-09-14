import Sequelize, { Model } from "sequelize";
import bcrypt from "bcrypt";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        role: Sequelize.ENUM("admin", "agent"),
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 6);
      }
    });

    return this;
  }

  async checkPassword(password) {
    let isMatch = await bcrypt.compare(password, this.password_hash);
    return isMatch;
  }

  static associate(models) {
    this.hasMany(models.Task, { foreignKey: "responsible_id", as: "tasks" });
  }
}

module.exports = User;
