const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        role: DataTypes.ENUM("admin", "agent"),
        password: DataTypes.VIRTUAL,
        password_hash: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
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
