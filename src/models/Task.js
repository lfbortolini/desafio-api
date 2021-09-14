const { Model, DataTypes } = require("sequelize");

class Task extends Model {
  static init(sequelize) {
    super.init(
      {
        description: DataTypes.STRING,
        status: DataTypes.ENUM("open", "doing", "finished"),
        date_begin: DataTypes.DATE,
        date_finish: DataTypes.DATE,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "responsible_id",
      as: "responsible",
    });
  }
}

module.exports = Task;
